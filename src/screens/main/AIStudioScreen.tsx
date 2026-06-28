import React, { useRef, useState } from 'react';
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
import { colors } from '../../theme/colors';
import { borderRadius, spacing } from '../../theme/spacing';

type AIMode = 'concierge' | 'planner' | 'vision';

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

const QUICK_PROMPTS = [
  'Plan 7-day Egypt luxury trip',
  'Book dinner at Nusr-Et Dubai',
  'Private villa in Santorini',
  'First-class flight to Maldives',
];

let messageCounter = 0;
function makeId() {
  return String(++messageCounter);
}

export function AIStudioScreen() {
  const [activeMode, setActiveMode] = useState<AIMode>('concierge');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'assistant',
      content: MODES[0].greeting,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const switchMode = (mode: AIMode) => {
    const config = MODES.find(m => m.id === mode)!;
    setActiveMode(mode);
    setMessages([
      {
        id: makeId(),
        role: 'system',
        content: `— Switched to ${config.label} —`,
        timestamp: new Date(),
      },
      {
        id: makeId(),
        role: 'assistant',
        content: config.greeting,
        timestamp: new Date(),
      },
    ]);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = {
      id: makeId(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Scroll to bottom
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

    // Simulate AI response — replace with real API call
    await simulateAIResponse(text.trim(), activeMode, (reply) => {
      setIsTyping(false);
      const aiMsg: ChatMessage = {
        id: makeId(),
        role: 'assistant',
        content: reply,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
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
              <Text style={[styles.modeIcon, activeMode === m.id && styles.modeIconActive]}>
                {m.icon}
              </Text>
              <Text style={[styles.modeLabel, activeMode === m.id && styles.modeLabelActive]}>
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
        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}>
          {messages.map(m => (
            <ChatBubble key={m.id} message={m} />
          ))}
          {isTyping && <TypingBubble />}
        </ScrollView>

        {/* Quick prompts (show when no user messages yet) */}
        {messages.filter(m => m.role === 'user').length === 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickPromptsRow}
            style={styles.quickPromptsScroll}>
            {QUICK_PROMPTS.map(p => (
              <Pressable key={p} style={styles.quickPromptChip} onPress={() => sendMessage(p)}>
                <Text style={styles.quickPromptText}>{p}</Text>
              </Pressable>
            ))}
          </ScrollView>
        )}

        {/* Input bar */}
        <View style={styles.inputBar}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Message your AI concierge…"
              placeholderTextColor={colors.textMuted}
              multiline
              maxLength={2000}
              selectionColor={colors.primary}
              onSubmitEditing={() => sendMessage(inputText)}
              blurOnSubmit={false}
            />
          </View>
          <Pressable
            onPress={() => sendMessage(inputText)}
            disabled={!inputText.trim() || isTyping}
            style={({ pressed }) => [
              styles.sendBtn,
              (!inputText.trim() || isTyping) && styles.sendBtnDisabled,
              pressed && styles.sendBtnPressed,
            ]}>
            <LinearGradient
              colors={
                !inputText.trim() || isTyping
                  ? [colors.surfaceAlt, colors.surfaceAlt]
                  : [colors.primary, colors.primaryDark]
              }
              style={styles.sendBtnGradient}>
              <Text style={styles.sendBtnIcon}>↑</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Simulated AI response — replace with OpenAI / Anthropic API call ─────────

async function simulateAIResponse(
  userMessage: string,
  mode: AIMode,
  callback: (reply: string) => void,
): Promise<void> {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 1500 + Math.random() * 1000));

  const responses: Record<AIMode, string[]> = {
    concierge: [
      `Certainly. I have noted your request and will arrange that immediately. May I confirm the date and time preferences?`,
      `Of course. I will coordinate with our partners to ensure everything is prepared to the highest standard. Shall I proceed?`,
      `Understood. As an elite VANIR member, this will be handled with absolute priority. Any special requirements I should note?`,
    ],
    planner: [
      `Excellent choice. Here is your personalized 7-day itinerary:\n\n**Day 1:** Private arrival transfer, check-in at the Nile Ritz-Carlton, sunset cruise on the Nile.\n\n**Day 2:** Exclusive private tour of the Pyramids of Giza with a certified Egyptologist.\n\n**Day 3:** Luxor by private jet — Valley of the Kings at dawn.\n\nShall I continue with the full itinerary?`,
      `I've designed a bespoke journey based on your preferences. The key highlights include private access to exclusive sites, curated fine dining, and seamless VIP transfers throughout.`,
    ],
    vision: [
      `I can see this is the Great Sphinx of Giza, one of the most iconic monuments in human history. Carved approximately in 2500 BCE during the reign of Pharaoh Khafre, it stands 20 meters tall and 73 meters long...`,
      `Translation complete. This menu features traditional Egyptian cuisine. The highlighted dish is "Koshary" — a beloved street food layered with rice, lentils, pasta, and spiced tomato sauce.`,
    ],
  };

  const pool = responses[mode];
  callback(pool[Math.floor(Math.random() * pool.length)]);
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
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
  headerSubtitle: { fontSize: 10, color: colors.textMuted, letterSpacing: 1.5, marginTop: 1 },
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
  input: {
    color: colors.textPrimary,
    fontSize: 15,
    lineHeight: 22,
  },
  sendBtn: { width: 44, height: 44 },
  sendBtnDisabled: { opacity: 0.4 },
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
