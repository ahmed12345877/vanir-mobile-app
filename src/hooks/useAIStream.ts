/**
 * useAIStream — streaming AI chat hook for the VANIR AI Studio.
 *
 * Supports the OpenAI-compatible Server-Sent Events (SSE) format:
 *   data: {"choices":[{"delta":{"content":"token"}}]}\n\n
 *
 * Falls back to a simple { token: "..." } format if choices is absent.
 * The final [DONE] sentinel ends the stream.
 *
 * Firebase Analytics events are fired at stream start and completion.
 * Non-fatal errors are recorded to Crashlytics.
 */

import { useCallback, useRef, useState } from 'react';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import { ChatMessage } from '../components/ChatBubble';
import { apiUrl } from '../services/api';

export type AIMode = 'concierge' | 'planner' | 'vision';

interface UseAIStreamOptions {
  mode: AIMode;
  initialGreeting: string;
  /** Supabase ai_conversations.id — if supplied, completed messages are synced to the DB. */
  conversationId?: string | null;
}

export interface UseAIStreamReturn {
  messages: ChatMessage[];
  /** True while waiting for the first SSE token — drives the TypingBubble. */
  isTyping: boolean;
  /** True while tokens are actively flowing — the last message is being built in-place. */
  isStreaming: boolean;
  sendMessage: (text: string) => Promise<void>;
  /** Push one or more messages externally (e.g. vision capture results). */
  pushMessages: (...msgs: Omit<ChatMessage, 'id' | 'timestamp'>[]) => void;
  /** Reset conversation to a fresh greeting (e.g. on mode switch). */
  resetMessages: (greeting: string) => void;
  /** Abort an in-flight stream. */
  abort: () => void;
}

// ─── Internal helpers ────────────────────────────────────────────────────────

let _seq = 0;
function nextId(): string {
  return `m${++_seq}_${Date.now()}`;
}

function greetingMsg(content: string): ChatMessage {
  return { id: nextId(), role: 'assistant', content, timestamp: new Date() };
}

const ANALYTICS_START: Record<AIMode, string> = {
  concierge: 'ai_concierge_started',
  planner: 'ai_planner_started',
  vision: 'ai_vision_started',
};

const ANALYTICS_DONE: Record<AIMode, string> = {
  concierge: 'ai_concierge_completed',
  planner: 'ai_planner_generated',
  vision: 'ai_vision_capture_success',
};

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useAIStream({
  mode,
  initialGreeting,
  conversationId = null,
}: UseAIStreamOptions): UseAIStreamReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([
    greetingMsg(initialGreeting),
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const streamingIdRef = useRef<string | null>(null);

  // ── abort ──────────────────────────────────────────────────────────────────
  const abort = useCallback(() => {
    abortRef.current?.abort();
    setIsTyping(false);
    setIsStreaming(false);
    const sId = streamingIdRef.current;
    if (sId) {
      streamingIdRef.current = null;
      setMessages(prev =>
        prev.map(m =>
          m.id === sId && !m.content
            ? { ...m, content: '[Response interrupted]' }
            : m,
        ),
      );
    }
  }, []);

  // ── resetMessages ──────────────────────────────────────────────────────────
  const resetMessages = useCallback(
    (greeting: string) => {
      abort();
      setMessages([greetingMsg(greeting)]);
    },
    [abort],
  );

  // ── pushMessages ───────────────────────────────────────────────────────────
  const pushMessages = useCallback(
    (...msgs: Omit<ChatMessage, 'id' | 'timestamp'>[]) => {
      const stamped: ChatMessage[] = msgs.map(m => ({
        ...m,
        id: nextId(),
        timestamp: new Date(),
      }));
      setMessages(prev => [...prev, ...stamped]);
    },
    [],
  );

  // ── sendMessage ────────────────────────────────────────────────────────────
  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      // Cancel any ongoing stream
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;

      const userMsg: ChatMessage = {
        id: nextId(),
        role: 'user',
        content: trimmed,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMsg]);
      setIsTyping(true);
      setIsStreaming(false);

      // Analytics: session start
      analytics()
        .logEvent(ANALYTICS_START[mode], {
          mode,
          prompt_length: trimmed.length,
        })
        .catch(() => undefined);

      const t0 = Date.now();

      try {
        const response = await fetch(apiUrl('/api/ai/chat'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          signal: ctrl.signal,
          body: JSON.stringify({ mode, conversationId, message: trimmed }),
        });

        if (!response.ok) {
          const body = await response.text().catch(() => String(response.status));
          throw new Error(`AI API ${response.status}: ${body}`);
        }

        if (!response.body) {
          throw new Error('Server returned no streaming body.');
        }

        // Insert AI placeholder message — content is built up as tokens arrive
        const aiMsgId = nextId();
        streamingIdRef.current = aiMsgId;

        setIsTyping(false);
        setIsStreaming(true);
        setMessages(prev => [
          ...prev,
          { id: aiMsgId, role: 'assistant', content: '', timestamp: new Date() },
        ]);

        // ── SSE read loop ────────────────────────────────────────────────────
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buf = '';
        let fullContent = '';

        streamLoop: while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buf += decoder.decode(value, { stream: true });

          const lines = buf.split('\n');
          buf = lines.pop() ?? '';

          for (const raw of lines) {
            const line = raw.trim();
            if (!line || line === ':') continue; // heartbeat

            if (line.startsWith('data: ')) {
              const payload = line.slice(6);
              if (payload === '[DONE]') break streamLoop;

              try {
                const chunk = JSON.parse(payload) as {
                  choices?: Array<{ delta?: { content?: string } }>;
                  token?: string;
                };
                const token =
                  chunk.choices?.[0]?.delta?.content ?? chunk.token ?? '';

                if (token) {
                  fullContent += token;
                  const snapshot = fullContent;
                  setMessages(prev =>
                    prev.map(m =>
                      m.id === aiMsgId ? { ...m, content: snapshot } : m,
                    ),
                  );
                }
              } catch {
                // Malformed SSE chunk — skip silently
              }
            }
          }
        }

        setIsStreaming(false);
        streamingIdRef.current = null;

        // Analytics: completion
        analytics()
          .logEvent(ANALYTICS_DONE[mode], {
            mode,
            duration_ms: Date.now() - t0,
            response_length: fullContent.length,
          })
          .catch(() => undefined);

        // Persist to Supabase via API (fire-and-forget, non-blocking)
        if (fullContent && conversationId) {
          fetch(apiUrl('/api/ai/messages'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              conversationId,
              role: 'assistant',
              content: fullContent,
            }),
          }).catch(() => undefined);
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') return; // user-initiated — not an error

        const error = err instanceof Error ? err : new Error('Streaming error');

        try {
          crashlytics().recordError(error, `useAIStream/${mode}`);
        } catch {
          // Crashlytics not available — safe to ignore
        }

        setIsTyping(false);
        setIsStreaming(false);
        streamingIdRef.current = null;

        setMessages(prev => [
          ...prev,
          {
            id: nextId(),
            role: 'system',
            content: 'Connection interrupted. Please try again.',
            timestamp: new Date(),
          },
        ]);
      }
    },
    [mode, conversationId],
  );

  return {
    messages,
    isTyping,
    isStreaming,
    sendMessage,
    pushMessages,
    resetMessages,
    abort,
  };
}
