/**
 * AIStudioScreen — VANIR AI Studio with three real AI modes:
 *
 *   ◈  24/7 Concierge  — streaming SSE chat (useAIStream)
 *   ◉  Trip Planner    — streaming SSE + structured JSON → ItineraryView
 *   ◎  Vision          — live camera capture → Vision API + result in chat
 *
 * All modes share a single messages list managed by useAIStream.
 * The Planner mode detects JSON responses and swaps the ChatBubble
 * for the premium ItineraryView timeline component.
 */

import React, { useCallback, useRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { ChatBubble, ChatMessage, TypingBubble } from '../../components/ChatBubble';
import { AIVisionScanner } from '../../components/AIVisionScanner';
import { ItineraryView, tryParseItinerary } from '../../components/ItineraryView';
import { useAIStream, AIMode } from '../../hooks/useAIStream';
import { colors } from '../../theme/colors';
import { borderRadius, spacing } from '../../theme/spacing';

// ─── Config ───────────────────────────────────────────────────────────────────

interface ModeConfig {
  id: AIMode;
  label: string;
  icon: string;
  greeting: string;
}

const MODES: ModeConfig[] = [
  {
    id: 'concierge',
    label: '24/7 Concierge',
    icon: '◈',
    greeting:
      'Welcome. I am your VANIR AI Concierge, available around the clock. I can arrange restaurant reservations, modify your itinerary, arrange private transfers, or assist with any request. How may I be of service?',
  },
  {
    id: 'planner',
    label: 'Trip Planner',
    icon: '◉',
    greeting:
      'I am your personal AI Trip Planner. Share your dream destination, travel dates, preferences, and budget — I will craft a bespoke day-by-day itinerary tailored exclusively for you.',
  },
  {
    id: 'vision',
    label: 'Vision & Translate',
    icon: '◎',
    greeting:
      'Point your camera at any landmark, monument, or text. I will provide rich historical context for sites and instant translation for menus, signage, and documents.',
  },
];

const QUICK_PROMPTS: Record<AIMode, string[]> = {
  concierge: [
    'Book dinner at Nusr-Et Dubai',
    'Arrange a private transfer',
    'Suite upgrade at Burj Al Arab',
    'Private yacht for the evening',
  ],
  planner: [
    'Plan 7-day Egypt luxury trip',
    'Private villa in Santorini',
    'First-class Japan itinerary',
    'Maldives overwater escape',
  ],
  vision: [
    'What landmark is this?',
    'Translate this menu',
    'Historical context please',
    'Identify this artwork',
  ],
};

// ─── Screen ───────────────────────────────────────────────────────────────────

export function AIStudioScreen() {
  const [activeMode, setActiveMode] = React.useState<AIMode>('concierge');
  const [inputText, setInputText] = React.useState('');
  const scrollRef = useRef<ScrollView>(null);

  const {
    messages,
    isTyping,
    isStreaming,
    sendMessage,
    pushMessages,
    resetMessages,
    abort,
  } = useAIStream({
    mode: activeMode,
    initialGreeting: MODES[0].greeting,
  });

  const scrollToBottom = useCallback(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
  }, []);

  // Switch mode — abort stream, push system divider, reset to new greeting
  const switchMode = useCallback(
    (newMode: AIMode) => {
      if (newMode === activeMode) return;
      abort();
      setActiveMode(newMode);
      setInputText('');
      const config = MODES.find(m => m.id === newMode)!;
      resetMessages(config.greeting);
    },
    [activeMode, abort, resetMessages],
  );

  const handleSend = useCallback(
    async (text: string) => {
      if (!text.trim() || isTyping || isStreaming) return;
      setInputText('');
      await sendMessage(text.trim());
      scrollToBottom();
    },
    [isTyping, isStreaming, sendMessage, scrollToBottom],
  );

  // Vision scanner callback — pushes user "captured image" + AI result as messages
  const handleVisionAnalysis = useCallback(
    (userPrompt: string, aiResult: string) => {
      pushMessages(
        { role: 'user', content: userPrompt },
        { role: 'assistant', content: aiResult },
      );
      scrollToBottom();
    },
    [pushMessages, scrollToBottom],
  );

  const hasUserMessages = messages.some(m => m.role === 'user');
  const quickPrompts = QUICK_PROMPTS[activeMode];

  // Render a single message — planner mode tries to parse itinerary JSON
  const renderMessage = (m: ChatMessage) => {
    if (activeMode === 'planner' && m.role === 'assistant') {
      const days = tryParseItinerary(m.content);
      if (days) {
        return <ItineraryView key={m.id} days={days} />;
      }
    }
    return <ChatBubble key={m.id} message={m} />;
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <LinearGradient
        colors={[colors.surface, colors.background]}
        style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Text style={styles.aiIcon}>✦</Text>
            <View>
              <Text style={styles.headerTitle}>AI STUDIO</Text>
              <Text style={styles.headerSubtitle}>Powered by VANIR Intelligence</Text>
            </View>
          </View>
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Online</Text>
          </View>
        </View>

        {/* Mode switcher */}
        <View style={styles.modeSwitcher}>
          {MODES.map(m => (
            <Pressable
              key={m.id}
              onPress={() => switchMode(m.id)}
              style={[styles.modeTab, activeMode === m.id && styles.modeTabActive]}>
              <Text
                style={[
                  styles.modeIcon,
                  activeMode === m.id && styles.modeIconActive,
                ]}>
                {m.icon}
              </Text>
              <Text
                style={[
                  styles.modeLabel,
                  activeMode === m.id && styles.modeLabelActive,
                ]}>
                {m.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}>

        {activeMode === 'vision' ? (
          /* ── Vision mode ─────────────────────────────────────────────── */
          <ScrollView
            ref={scrollRef}
            style={styles.flex}
            contentContainerStyle={styles.visionScroll}
            showsVerticalScrollIndicator={false}>

            {/* Live camera */}
            <AIVisionScanner onAnalysis={handleVisionAnalysis} />

            {/* Previous vision results rendered as chat below the scanner */}
            {messages.filter(m => m.role !== 'system' || true).map(renderMessage)}

            {isTyping && <TypingBubble />}
          </ScrollView>
        ) : (
          /* ── Chat modes (concierge / planner) ────────────────────────── */
          <>
            <ScrollView
              ref={scrollRef}
              style={styles.flex}
              contentContainerStyle={styles.messageList}
              showsVerticalScrollIndicator={false}
              onContentSizeChange={scrollToBottom}>
              {messages.map(renderMessage)}
              {isTyping && <TypingBubble />}
            </ScrollView>

            {/* Quick prompts — shown until the user sends their first message */}
            {!hasUserMessages && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.quickPromptsRow}
                style={styles.quickPromptsScroll}>
                {quickPrompts.map(p => (
                  <Pressable
                    key={p}
                    style={styles.quickPromptChip}
                    onPress={() => handleSend(p)}>
                    <Text style={styles.quickPromptText}>{p}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}

            {/* Input bar */}
            <InputBar
              value={inputText}
              onChangeText={setInputText}
              onSend={() => handleSend(inputText)}
              disabled={isTyping || isStreaming}
            />
          </>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Input bar sub-component ──────────────────────────────────────────────────

interface InputBarProps {
  value: string;
  onChangeText: (t: string) => void;
  onSend: () => void;
  disabled: boolean;
}

function InputBar({ value, onChangeText, onSend, disabled }: InputBarProps) {
  const canSend = value.trim().length > 0 && !disabled;

  return (
    <View style={styles.inputBar}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder="Message your AI concierge…"
          placeholderTextColor={colors.textMuted}
          multiline
          maxLength={2000}
          selectionColor={colors.primary}
          blurOnSubmit={false}
        />
      </View>

      <Pressable
        onPress={onSend}
        disabled={!canSend}
        style={({ pressed }) => [
          styles.sendBtn,
          !canSend && styles.sendBtnDisabled,
          pressed && canSend && styles.sendBtnPressed,
        ]}>
        <LinearGradient
          colors={canSend ? [colors.primary, colors.primaryDark] : [colors.surfaceAlt, colors.surfaceAlt]}
          style={styles.sendBtnGradient}>
          <Text style={styles.sendBtnIcon}>↑</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },

  // Header
  header: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing[3],
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
    paddingTop: spacing[3],
    paddingBottom: spacing[3],
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing[3] },
  aiIcon: { fontSize: 28, color: colors.primary },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 3,
    fontFamily: 'Georgia',
  },
  headerSubtitle: {
    fontSize: 10,
    color: colors.textMuted,
    letterSpacing: 1.5,
    marginTop: 1,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    backgroundColor: colors.successMuted,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing[3],
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(63,185,143,0.3)',
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success },
  statusText: { fontSize: 11, color: colors.success, fontWeight: '600' },

  // Mode switcher
  modeSwitcher: {
    flexDirection: 'row',
    paddingHorizontal: spacing[5],
    gap: spacing[2],
  },
  modeTab: {
    flex: 1,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[2],
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: 3,
  },
  modeTabActive: {
    backgroundColor: colors.primaryMuted,
    borderColor: colors.primaryBorder,
  },
  modeIcon: { fontSize: 14, color: colors.textMuted },
  modeIconActive: { color: colors.primary },
  modeLabel: { fontSize: 10, color: colors.textMuted, fontWeight: '600', letterSpacing: 0.3 },
  modeLabelActive: { color: colors.primary },

  // Messages
  messageList: { paddingTop: spacing[4], paddingBottom: spacing[4] },

  // Vision scroll
  visionScroll: { paddingBottom: spacing[4] },

  // Quick prompts
  quickPromptsScroll: { maxHeight: 48 },
  quickPromptsRow: {
    paddingHorizontal: spacing[4],
    gap: spacing[2],
    alignItems: 'center',
    paddingVertical: spacing[2],
  },
  quickPromptChip: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
  },
  quickPromptText: { fontSize: 12, color: colors.primary, fontWeight: '500' },

  // Input bar
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    paddingBottom: spacing[5],
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing[3],
    backgroundColor: colors.background,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    paddingHorizontal: spacing[4],
    paddingVertical: Platform.OS === 'ios' ? spacing[3] : spacing[2],
    maxHeight: 120,
  },
  input: { color: colors.textPrimary, fontSize: 15, lineHeight: 22 },
  sendBtn: { width: 44, height: 44 },
  sendBtnDisabled: { opacity: 0.35 },
  sendBtnPressed: { opacity: 0.85 },
  sendBtnGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnIcon: { fontSize: 18, fontWeight: '700', color: colors.textOnGold },
});
