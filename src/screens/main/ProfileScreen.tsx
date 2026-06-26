import React from 'react';
import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
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

  function openLink(url: string) {
    Linking.openURL(url).catch(() => undefined);
  }

  if (!isAuthenticated) {
    return (
      <Screen
        title="Profile"
        subtitle="A premium member area for bookings, loyalty, AI access, and secure account controls."
        actions={<SupportActionStrip focus="contact" />}>
        <SectionCard>
          <Image source={{ uri: companyContent.articles[0].imageUrl }} style={styles.heroImage} />
          <Text style={screenStyles.label}>Private access</Text>
          <Text style={screenStyles.sectionTitle}>Unlock your VANIR member space</Text>
          <Text style={screenStyles.body}>Sign in to manage bookings, review your travel history, access AI Studio usage, and open support and legal tools in one place.</Text>
          <View style={styles.contactStrip}>
            <Text style={styles.contactChip}>{companyContent.contact.email}</Text>
            <Text style={styles.contactChip}>{companyContent.contact.phone}</Text>
          </View>
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
      subtitle="Your premium member dashboard for travel history, AI usage, support, and compliance actions."
        actions={<SupportActionStrip focus="book" />}>
      <SectionCard>
        <Text style={screenStyles.label}>Current member</Text>
        <Text style={screenStyles.sectionTitle}>{String((user as { name?: string })?.name ?? 'VANIR traveler')}</Text>
        <Text style={screenStyles.body}>{String((user as { email?: string })?.email ?? 'No email available')}</Text>
        <View style={styles.membershipRibbon}>
          <Text style={styles.membershipRibbonText}>Premium traveler profile</Text>
        </View>
      </SectionCard>

      <View style={styles.metricsRow}>
        <Metric label="Bookings" value={stats.bookings ?? 0} />
        <Metric label="Reviews" value={stats.reviews ?? 0} />
        <Metric label="AI Credits" value={stats.aiCredits ?? 0} />
      </View>

      <SectionCard>
        <Text style={screenStyles.sectionTitle}>Recent activity</Text>
        <View style={styles.activityCard}>
          <Text style={styles.activityTitle}>Bookings</Text>
          <Text style={styles.activityValue}>{(bookingsQuery.data ?? []).length}</Text>
        </View>
        <View style={styles.activityCard}>
          <Text style={styles.activityTitle}>Reviews</Text>
          <Text style={styles.activityValue}>{(reviewsQuery.data ?? []).length}</Text>
        </View>
        <Pressable style={styles.secondaryButton} onPress={signOut}>
          <Text style={styles.secondaryButtonText}>Sign out</Text>
        </Pressable>
      </SectionCard>

      <SectionCard>
        <Text style={screenStyles.sectionTitle}>Legal & Play Store compliance</Text>
        <Text style={screenStyles.body}>Review Terms of Service and Privacy Policy directly from the app. This section also provides a delete-account request path for compliance workflows.</Text>
        <View style={styles.legalActions}>
          <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate('LegalCenter')}>
            <Text style={styles.secondaryButtonText}>Open Legal Center</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => openLink(companyContent.contact.termsOfService)}>
            <Text style={styles.secondaryButtonText}>Terms of Service</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => openLink(companyContent.contact.privacyPolicy)}>
            <Text style={styles.secondaryButtonText}>Privacy Policy</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => openLink(`mailto:${companyContent.contact.email}?subject=Delete%20My%20Account`)}>
            <Text style={styles.secondaryButtonText}>Request Account Deletion</Text>
          </Pressable>
        </View>
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
  contactStrip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  contactChip: {
    backgroundColor: colors.surfaceAlt,
    color: colors.textPrimary,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    overflow: 'hidden',
    fontSize: 12,
    fontWeight: '600',
  },
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
    height: 210,
    borderRadius: 16,
  },
  membershipRibbon: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  membershipRibbonText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: '800',
  },
  activityCard: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 4,
  },
  activityTitle: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  activityValue: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
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
  legalActions: {
    marginTop: 4,
    gap: 6,
  },
});
