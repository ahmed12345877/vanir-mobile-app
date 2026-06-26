import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SupportActionStrip } from '../../components/SupportActionStrip';
import { Screen, SectionCard, screenStyles } from '../../components/Screen';
import { companyContent } from '../../content/companyContent';
import { useAuth } from '../../context/AuthContext';
import { trpc } from '../../lib/trpc';
import type { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';

type ProfileStats = {
  bookings?: number;
  reviews?: number;
  aiCredits?: number;
};

export function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, isAuthenticated, signOut } = useAuth();
  const statsQuery = trpc.users.profileStats.useQuery(undefined, { enabled: isAuthenticated });
  const bookingsQuery = trpc.bookings.myBookings.useQuery(undefined, { enabled: isAuthenticated });
  const reviewsQuery = trpc.reviews.myReviews.useQuery(undefined, { enabled: isAuthenticated });
  const stats = (statsQuery.data ?? {}) as ProfileStats;

  if (!isAuthenticated) {
    return (
      <Screen
        title="Profile"
        subtitle="Sign in to reuse the current VANIR account, bookings, reviews, and customer history."
        actions={<SupportActionStrip focus="contact" />}>
        <SectionCard>
          <Text style={screenStyles.sectionTitle}>Contact the VANIR travel desk</Text>
          <Text style={screenStyles.body}>{companyContent.contact.address}</Text>
          <Text style={screenStyles.body}>{companyContent.contact.email}</Text>
          <Text style={screenStyles.body}>{companyContent.contact.phone}</Text>
          <Image source={{ uri: companyContent.articles[0].imageUrl }} style={styles.heroImage} />
          <Text style={screenStyles.body}>This screen mirrors the protected profile routes from the website.</Text>
          <Pressable style={styles.button} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.buttonText}>Sign in</Text>
          </Pressable>
        </SectionCard>
      </Screen>
    );
  }

  return (
    <Screen
      title="Profile"
      subtitle="Your profile is loaded from the same authenticated backend routes used by the website."
        actions={<SupportActionStrip focus="book" />}>
      <SectionCard>
        <Text style={screenStyles.label}>Current user</Text>
        <Text style={screenStyles.sectionTitle}>{String((user as { name?: string })?.name ?? 'VANIR traveler')}</Text>
        <Text style={screenStyles.body}>{String((user as { email?: string })?.email ?? 'No email available')}</Text>
      </SectionCard>

      <View style={styles.metricsRow}>
        <Metric label="Bookings" value={stats.bookings ?? 0} />
        <Metric label="Reviews" value={stats.reviews ?? 0} />
        <Metric label="AI Credits" value={stats.aiCredits ?? 0} />
      </View>

      <SectionCard>
        <Text style={screenStyles.sectionTitle}>Recent activity</Text>
        <Text style={screenStyles.body}>Bookings: {(bookingsQuery.data ?? []).length}</Text>
        <Text style={screenStyles.body}>Reviews: {(reviewsQuery.data ?? []).length}</Text>
        <Pressable style={styles.secondaryButton} onPress={signOut}>
          <Text style={styles.secondaryButtonText}>Sign out</Text>
        </Pressable>
      </SectionCard>
    </Screen>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  metricValue: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '700',
  },
  metricLabel: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  heroImage: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    marginTop: 8,
  },
  button: {
    marginTop: 12,
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
  },
  buttonText: {
    color: colors.background,
    fontWeight: '700',
  },
  secondaryButton: {
    marginTop: 12,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
  },
  secondaryButtonText: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
});
