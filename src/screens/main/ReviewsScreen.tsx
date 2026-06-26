import React, { useState } from 'react';
import { Alert, FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SupportActionStrip } from '../../components/SupportActionStrip';
import { Screen, SectionCard, screenStyles } from '../../components/Screen';
import { companyContent } from '../../content/companyContent';
import { trpc } from '../../lib/trpc';
import { colors } from '../../theme/colors';

type Review = {
  id?: number;
  tripName?: string;
  title?: string;
  content?: string;
  rating?: number;
  guestName?: string;
  adminReply?: string;
};

type ReviewStats = {
  averageRating?: number;
  totalReviews?: number;
};

export function ReviewsScreen() {
  const reviewsQuery = trpc.reviews.list.useQuery({ limit: 20, offset: 0 });
  const statsQuery = trpc.reviews.stats.useQuery();
  const createReview = trpc.reviews.create.useMutation();
  const [tripName, setTripName] = useState('Nile Cruise');
  const [guestName, setGuestName] = useState('');
  const [content, setContent] = useState('');

  const stats = (statsQuery.data ?? {}) as ReviewStats;

  async function submitReview() {
    try {
      await createReview.mutateAsync({
        tripName,
        guestName,
        content,
        rating: 5,
      });
      setContent('');
      Alert.alert('Review submitted', 'Your feedback has been sent for moderation.');
    } catch (error) {
      Alert.alert('Submission failed', error instanceof Error ? error.message : 'Please try again.');
    }
  }

  return (
    <Screen
      title="Reviews"
      subtitle="Approved testimonials and review creation are wired to the same review router used on web."
      actions={<SupportActionStrip focus="contact" />}>
      <SectionCard>
        <Text style={screenStyles.sectionTitle}>Platform review stats</Text>
        <View style={styles.statsRow}>
          <Stat label="Average rating" value={stats.averageRating?.toFixed?.(1) ?? '—'} />
          <Stat label="Approved reviews" value={stats.totalReviews ?? '—'} />
        </View>
      </SectionCard>

      <SectionCard>
        <Text style={screenStyles.sectionTitle}>What our clients say</Text>
        <Text style={screenStyles.body}>Real traveler stories, pinned inside the app, help users compare expectations before they book.</Text>
        <FlatList
          data={companyContent.testimonials}
          keyExtractor={item => item.name}
          scrollEnabled={false}
          contentContainerStyle={styles.testimonialList}
          renderItem={({ item }) => (
            <View style={styles.testimonialCard}>
              <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
              <View style={styles.testimonialBody}>
                <Text style={styles.clientName}>{item.name}</Text>
                <Text style={screenStyles.label}>{item.role}</Text>
                <Text style={screenStyles.body}>{item.quote}</Text>
                <Text style={styles.clientMeta}>{item.location}</Text>
              </View>
            </View>
          )}
        />
      </SectionCard>

      <SectionCard>
        <Text style={screenStyles.sectionTitle}>Leave a review</Text>
        <TextInput style={styles.input} value={tripName} onChangeText={setTripName} placeholder="Trip name" placeholderTextColor={colors.textMuted} />
        <TextInput style={styles.input} value={guestName} onChangeText={setGuestName} placeholder="Your name" placeholderTextColor={colors.textMuted} />
        <TextInput
          style={[styles.input, styles.textArea]}
          value={content}
          onChangeText={setContent}
          placeholder="Tell us about your experience"
          placeholderTextColor={colors.textMuted}
          multiline
        />
        <Pressable style={styles.button} onPress={submitReview} disabled={createReview.isPending}>
          <Text style={styles.buttonText}>{createReview.isPending ? 'Submitting…' : 'Submit review'}</Text>
        </Pressable>
      </SectionCard>

      <FlatList
        data={(reviewsQuery.data ?? []) as Review[]}
        keyExtractor={(item, index) => String(item.id ?? index)}
        scrollEnabled={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <SectionCard>
            <Text style={screenStyles.label}>{item.guestName ?? 'Traveler'}</Text>
            <Text style={screenStyles.sectionTitle}>{item.title ?? item.tripName ?? 'Verified review'}</Text>
            <Text style={screenStyles.body}>{item.content ?? 'No review content provided.'}</Text>
            {item.adminReply ? <Text style={styles.replyText}>Admin reply: {item.adminReply}</Text> : null}
          </SectionCard>
        )}
      />
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 14,
    padding: 12,
  },
  statValue: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: '700',
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    color: colors.textPrimary,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
  },
  buttonText: {
    color: colors.background,
    fontWeight: '700',
  },
  list: {
    gap: 12,
  },
  testimonialList: {
    gap: 12,
  },
  testimonialCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 16,
    padding: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  testimonialBody: {
    flex: 1,
    gap: 4,
  },
  clientName: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  clientMeta: {
    color: colors.textMuted,
    fontSize: 12,
  },
  replyText: {
    color: colors.primarySoft,
  },
});
