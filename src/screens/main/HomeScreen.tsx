import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen, SectionCard, screenStyles } from '../../components/Screen';
import { useAuth } from '../../context/AuthContext';
import { trpc } from '../../lib/trpc';
import type { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';

const quickActions = [
  { label: 'Book a package', route: 'Booking' as const },
  { label: 'Read reviews', route: 'Reviews' as const },
  { label: 'Sign in', route: 'Login' as const },
];

export function HomeScreen() {
  const { isAuthenticated } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const offersQuery = trpc.offers.listActive.useQuery();
  const blogQuery = trpc.blog.list.useQuery({ limit: 3 });
  const galleryQuery = trpc.gallery.listVisible.useQuery();

  return (
    <Screen
      title="VANIR Mobile"
      subtitle="A React Native shell mapped from the current web experience: travel discovery, offers, gallery, content, bookings, reviews, and profile.">
      <SectionCard>
        <Text style={screenStyles.label}>{isAuthenticated ? 'Signed in' : 'Guest mode'}</Text>
        <Text style={screenStyles.body}>
          {isAuthenticated
            ? `Connected to the same Firebase + Node backend as the website.`
            : 'Browse public content first, then sign in when you are ready to book or manage your profile.'}
        </Text>
      </SectionCard>

      <View style={styles.actionGrid}>
        {quickActions.map(action => (
          <Pressable key={action.label} style={styles.actionTile} onPress={() => navigation.navigate(action.route)}>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </Pressable>
        ))}
      </View>

      <SectionCard>
        <Text style={screenStyles.sectionTitle}>Live platform snapshot</Text>
        <View style={styles.metricRow}>
          <Metric label="Active offers" value={offersQuery.data?.length ?? 0} />
          <Metric label="Blog posts" value={blogQuery.data?.length ?? 0} />
          <Metric label="Gallery items" value={galleryQuery.data?.length ?? 0} />
        </View>
      </SectionCard>

      <SectionCard>
        <Text style={screenStyles.sectionTitle}>What was mirrored from web</Text>
        <Text style={screenStyles.body}>
          Home, gallery, offers, blog, bookings, reviews, and profile were chosen as the strongest mobile-first slices from the current website.
        </Text>
      </SectionCard>
    </Screen>
  );
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionTile: {
    flexBasis: '31%',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 18,
    minHeight: 88,
    padding: 16,
    justifyContent: 'center',
  },
  actionLabel: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  metricRow: {
    flexDirection: 'row',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 14,
    padding: 12,
    gap: 4,
  },
  metricValue: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: '700',
  },
  metricLabel: {
    color: colors.textSecondary,
    fontSize: 13,
  },
});
