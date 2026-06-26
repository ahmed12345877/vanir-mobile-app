import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen, SectionCard, screenStyles } from '../../components/Screen';
import { companyContent } from '../../content/companyContent';
import { useAuth } from '../../context/AuthContext';
import { trpc } from '../../lib/trpc';
import type { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';

const heroCards = [
  {
    id: 'booking',
    label: 'Book',
    title: 'Luxury Packages',
    subtitle: 'Cruises, private tours, and curated itineraries.',
    imageUrl: companyContent.packages[0]?.imageUrl,
    action: 'Booking' as const,
  },
  {
    id: 'offers',
    label: 'Offers',
    title: 'Best Deals',
    subtitle: 'Seasonal savings and VIP travel privileges.',
    imageUrl: companyContent.packages[1]?.imageUrl,
    action: 'OffersTab' as const,
  },
  {
    id: 'ai',
    label: 'AI Studio',
    title: 'Create Visuals',
    subtitle: 'Generate premium travel content inside the app.',
    imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663477605010/hMv7CdB7RdAWDPc2Ku9pP8/egypt-pyramids-hero-iqbfDkZV4VwqjH9bTnSoDx.webp',
    action: 'AIStudio' as const,
  },
];

const serviceButtons = [
  { title: 'Packages', subtitle: 'Curated luxury trips', accent: '#d4a853', route: 'Booking' as const },
  { title: 'Flights', subtitle: 'Premium air routes', accent: '#78b8ff', route: 'FlightBooking' as const },
  { title: 'Hotels', subtitle: '5-star stays', accent: '#8cd8b0', route: 'HotelBooking' as const },
  { title: 'Visa / eSIM', subtitle: 'Travel essentials', accent: '#f29a6a', route: 'TravelEssentials' as const },
  { title: 'Offers', subtitle: 'Hot seasonal deals', accent: '#c78cff', route: 'OffersTab' as const },
  { title: 'Reviews', subtitle: 'Trusted feedback', accent: '#ffd36e', route: 'Reviews' as const },
];

export function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isAuthenticated } = useAuth();
  const offersQuery = trpc.offers.listActive.useQuery();
  const blogQuery = trpc.blog.list.useQuery({ limit: 3 });
  const galleryQuery = trpc.gallery.listVisible.useQuery();
  const featuredDestinations = companyContent.destinations.slice(0, 3);

  const goToHero = (action: (typeof heroCards)[number]['action']) => {
    if (action === 'OffersTab') {
      (navigation as any).navigate('MainTabs', { screen: 'Offers' });
      return;
    }

    navigation.navigate(action);
  };

  const goToService = (route: (typeof serviceButtons)[number]['route']) => {
    if (route === 'OffersTab') {
      (navigation as any).navigate('MainTabs', { screen: 'Offers' });
      return;
    }

    navigation.navigate(route);
  };

  return (
    <Screen
      title="Luxury Travel, Better Organized"
      subtitle="A cleaner mobile home with strong visuals, direct actions, and no accidental navigation overlap.">
      <SectionCard>
        <Text style={screenStyles.label}>{isAuthenticated ? 'Signed in' : 'Guest mode'}</Text>
        <Text style={styles.heroIntroTitle}>{companyContent.heroTitle}</Text>
        <Text style={screenStyles.body}>{companyContent.heroBody}</Text>
      </SectionCard>

      <View style={styles.heroGrid}>
        <Pressable style={styles.heroLargeCard} onPress={() => goToHero(heroCards[0].action)}>
          <Image source={{ uri: heroCards[0].imageUrl }} style={styles.heroLargeImage} />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroBadge}>{heroCards[0].label}</Text>
            <Text style={styles.heroLargeTitle}>{heroCards[0].title}</Text>
            <Text style={styles.heroSubtitle}>{heroCards[0].subtitle}</Text>
          </View>
        </Pressable>

        <View style={styles.heroColumn}>
          {heroCards.slice(1).map(card => (
            <Pressable key={card.id} style={styles.heroSmallCard} onPress={() => goToHero(card.action)}>
              <Image source={{ uri: card.imageUrl }} style={styles.heroSmallImage} />
              <View style={styles.heroOverlay}>
                <Text style={styles.heroBadge}>{card.label}</Text>
                <Text style={styles.heroSmallTitle}>{card.title}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      <SectionCard>
        <Text style={screenStyles.sectionTitle}>Core Services</Text>
        <View style={styles.serviceGrid}>
          {serviceButtons.map(button => (
            <Pressable key={button.title} style={styles.serviceButton} onPress={() => goToService(button.route)}>
              <View style={[styles.serviceAccent, { backgroundColor: button.accent }]} />
              <Text style={styles.serviceButtonText}>{button.title}</Text>
              <Text style={styles.serviceButtonSubtext}>{button.subtitle}</Text>
            </Pressable>
          ))}
        </View>
      </SectionCard>

      <SectionCard>
        <Text style={screenStyles.sectionTitle}>Platform Snapshot</Text>
        <View style={styles.metricsRow}>
          <Metric label="Offers" value={offersQuery.data?.length ?? 0} />
          <Metric label="Blog" value={blogQuery.data?.length ?? 0} />
          <Metric label="Gallery" value={galleryQuery.data?.length ?? 0} />
        </View>
      </SectionCard>

      <SectionCard>
        <Text style={screenStyles.sectionTitle}>Featured Destinations</Text>
        <View style={styles.destinationList}>
          {featuredDestinations.map(destination => (
            <View key={destination.name} style={styles.destinationCard}>
              <Image source={{ uri: destination.imageUrl }} style={styles.destinationImage} />
              <View style={styles.destinationBody}>
                <Text style={screenStyles.label}>{destination.category}</Text>
                <Text style={styles.destinationTitle}>{destination.name}</Text>
                <Text style={screenStyles.body}>{destination.region}</Text>
              </View>
            </View>
          ))}
        </View>
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
  heroIntroTitle: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
  },
  heroGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  heroLargeCard: {
    flex: 1.1,
    minHeight: 260,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  heroColumn: {
    flex: 0.9,
    gap: 12,
  },
  heroSmallCard: {
    minHeight: 124,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  heroLargeImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroSmallImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(8,8,16,0.34)',
    padding: 14,
    gap: 4,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(8,8,16,0.76)',
    color: colors.primarySoft,
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 4,
  },
  heroLargeTitle: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
  },
  heroSmallTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  heroSubtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  serviceButton: {
    flexBasis: '48%',
    backgroundColor: colors.surfaceAlt,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 16,
    paddingHorizontal: 14,
    minHeight: 104,
    justifyContent: 'center',
    gap: 6,
  },
  serviceAccent: {
    width: 34,
    height: 4,
    borderRadius: 999,
  },
  serviceButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  serviceButtonSubtext: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 16,
    padding: 14,
    gap: 4,
  },
  metricValue: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: '800',
  },
  metricLabel: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  destinationList: {
    gap: 12,
  },
  destinationCard: {
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: colors.surfaceAlt,
  },
  destinationImage: {
    width: '100%',
    height: 160,
  },
  destinationBody: {
    padding: 14,
    gap: 4,
  },
  destinationTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
  },
});
