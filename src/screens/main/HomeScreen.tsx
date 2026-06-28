import React, { useCallback, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';

import { ArtDecoHeader, SectionHeading } from '../../components/ArtDecoHeader';
import {
  BookingCategory,
  CategorySwitcher,
} from '../../components/CategorySwitcher';
import { FlightCard, FlightCardData } from '../../components/FlightCard';
import { PropertyCard, PropertyCardData } from '../../components/PropertyCard';
import { SearchCard, SearchParams } from '../../components/SearchCard';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme/colors';
import { borderRadius, spacing } from '../../theme/spacing';
import type { RootStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

// ─── Mock data ────────────────────────────────────────────────────────────────

const FEATURED_PROPERTIES: PropertyCardData[] = [
  {
    id: '1',
    name: 'The Nile Ritz-Carlton',
    location: 'Cairo, Egypt',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    pricePerNight: 850,
    currency: '$',
    rating: 4.9,
    reviewCount: 312,
    badges: [
      { label: 'Fully Refundable', variant: 'success' },
      { label: 'VIP Access', variant: 'gold' },
    ],
    category: 'hotel',
  },
  {
    id: '2',
    name: 'Burj Al Arab Jumeirah',
    location: 'Dubai, UAE',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
    pricePerNight: 2400,
    currency: '$',
    rating: 5.0,
    reviewCount: 845,
    badges: [
      { label: 'Elite Member Price', variant: 'gold' },
      { label: 'Private Butler', variant: 'info' },
    ],
    category: 'resort',
  },
  {
    id: '3',
    name: 'Amanzoe Private Villa',
    location: 'Porto Heli, Greece',
    imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
    pricePerNight: 3200,
    currency: '$',
    rating: 4.8,
    reviewCount: 178,
    badges: [
      { label: 'Private Pool', variant: 'info' },
      { label: 'Fully Refundable', variant: 'success' },
    ],
    category: 'villa',
  },
];

const FEATURED_FLIGHTS: FlightCardData[] = [
  {
    id: 'f1',
    airline: 'Emirates',
    airlineCode: 'EK',
    flightNumber: 'EK 926',
    origin: 'Cairo',
    originCode: 'CAI',
    destination: 'Dubai',
    destinationCode: 'DXB',
    departureTime: '09:15',
    arrivalTime: '14:30',
    duration: '3h 15m',
    stops: 0,
    price: 1240,
    currency: '$',
    cabinClass: 'Business',
    badges: [
      { label: 'Fully Refundable', variant: 'success' },
      { label: 'Elite Fare', variant: 'gold' },
    ],
  },
  {
    id: 'f2',
    airline: 'Qatar Airways',
    airlineCode: 'QR',
    flightNumber: 'QR 1352',
    origin: 'Dubai',
    originCode: 'DXB',
    destination: 'London',
    destinationCode: 'LHR',
    departureTime: '22:55',
    arrivalTime: '05:20',
    duration: '7h 25m',
    stops: 0,
    price: 3800,
    currency: '$',
    cabinClass: 'First',
    badges: [
      { label: 'Private Suite', variant: 'gold' },
      { label: 'Chauffeur', variant: 'info' },
    ],
  },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export function HomeScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<Nav>();
  const [activeCategory, setActiveCategory] = useState<BookingCategory>('stays');

  const handleSearch = useCallback(
    (params: SearchParams) => {
      if (params.category === 'ai-studio') {
        navigation.navigate('AIStudio');
      } else {
        navigation.navigate('SearchResults', { params });
      }
    },
    [navigation],
  );

  const handlePropertyPress = useCallback((id: string) => {
    navigation.navigate('Booking');
  }, [navigation]);

  const handleFlightPress = useCallback((id: string) => {
    navigation.navigate('Booking');
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* ─── Top Bar ─── */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.brandName}>VANIR GROUP</Text>
          <Text style={styles.brandTagline}>Private Travel Concierge</Text>
        </View>
        <Pressable style={styles.profileBtn} onPress={() => navigation.navigate('MainTabs')}>
          <LinearGradient
            colors={[colors.primaryDark, colors.primary]}
            style={styles.profileAvatar}>
            <Text style={styles.profileInitial}>
              {user ? (user as { name?: string }).name?.[0]?.toUpperCase() ?? 'V' : 'V'}
            </Text>
          </LinearGradient>
        </Pressable>
      </View>

      {/* ─── Category Tabs ─── */}
      <CategorySwitcher active={activeCategory} onChange={setActiveCategory} />

      {/* ─── Scrollable Content ─── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}>

        {/* Hero greeting */}
        <LinearGradient
          colors={['rgba(201,168,76,0.08)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.heroGradient}>
          <ArtDecoHeader
            title={getGreeting(user)}
            subtitle="Where shall we take you today?"
          />
        </LinearGradient>

        {/* Search card */}
        <SearchCard category={activeCategory} onSearch={handleSearch} />

        {/* AI Studio quick-access banner */}
        {activeCategory !== 'ai-studio' && (
          <Pressable onPress={() => navigation.navigate('AIStudio')}>
            <LinearGradient
              colors={[colors.primaryMuted, 'rgba(139,105,20,0.08)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.aiStripeBanner}>
              <View style={styles.aiStripeLeft}>
                <Text style={styles.aiStripeIcon}>✦</Text>
                <View>
                  <Text style={styles.aiStripeTitle}>VANIR AI Studio</Text>
                  <Text style={styles.aiStripeSubtitle}>
                    Let AI plan your perfect journey
                  </Text>
                </View>
              </View>
              <Text style={styles.aiStripeArrow}>→</Text>
            </LinearGradient>
          </Pressable>
        )}

        {/* Results / Featured section */}
        <View style={styles.section}>
          <SectionHeading
            label={
              activeCategory === 'flights'
                ? 'Featured Flights'
                : activeCategory === 'cars'
                ? 'Luxury Vehicles'
                : 'Featured Properties'
            }
          />

          {activeCategory === 'flights' || activeCategory === 'cars' ? (
            FEATURED_FLIGHTS.map(f => (
              <FlightCard key={f.id} data={f} onPress={handleFlightPress} />
            ))
          ) : (
            FEATURED_PROPERTIES.map(p => (
              <PropertyCard key={p.id} data={p} onPress={handlePropertyPress} />
            ))
          )}
        </View>

        {/* Exclusive Offers strip */}
        <View style={styles.section}>
          <SectionHeading label="Exclusive Member Offers" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.offersRow}>
            {OFFER_CARDS.map(offer => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Offer mini-card ──────────────────────────────────────────────────────────

const OFFER_CARDS = [
  { id: '1', title: 'Nile Cruise', subtitle: 'From $2,400', tag: '40% OFF', color: '#1a1520' },
  { id: '2', title: 'Maldives Escape', subtitle: 'From $4,800', tag: 'VIP ONLY', color: '#0f1a1a' },
  { id: '3', title: 'Santorini Villa', subtitle: 'From $3,200', tag: 'TRENDING', color: '#1a1015' },
];

function OfferCard({ offer }: { offer: typeof OFFER_CARDS[0] }) {
  return (
    <Pressable>
      <View style={[styles.offerCard, { backgroundColor: offer.color }]}>
        <View style={styles.offerTag}>
          <Text style={styles.offerTagText}>{offer.tag}</Text>
        </View>
        <View style={styles.offerContent}>
          <Text style={styles.offerTitle}>{offer.title}</Text>
          <Text style={styles.offerSubtitle}>{offer.subtitle}</Text>
        </View>
        <View style={styles.offerLine} />
      </View>
    </Pressable>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getGreeting(user: unknown | null): string {
  const hour = new Date().getHours();
  const name = user ? (user as { name?: string }).name?.split(' ')[0] : null;
  const timeGreet = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
  return name ? `${timeGreet}, ${name}` : timeGreet;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
  },
  brandName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 4,
    fontFamily: 'Georgia',
  },
  brandTagline: {
    fontSize: 10,
    color: colors.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  profileBtn: {},
  profileAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.primaryBorderStrong,
  },
  profileInitial: { color: colors.textOnGold, fontSize: 15, fontWeight: '700' },
  scroll: { gap: spacing[5], paddingBottom: spacing[10] },
  heroGradient: { paddingHorizontal: spacing[5], paddingVertical: spacing[5] },
  // Search card sits edge-to-edge with padding
  // (SearchCard itself has margin-x handled by wrapping here)
  aiStripeBanner: {
    marginHorizontal: spacing[5],
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    padding: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  aiStripeLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing[3] },
  aiStripeIcon: { fontSize: 20, color: colors.primary },
  aiStripeTitle: { fontSize: 14, fontWeight: '700', color: colors.primary, letterSpacing: 1 },
  aiStripeSubtitle: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  aiStripeArrow: { fontSize: 18, color: colors.primary },
  section: { paddingHorizontal: spacing[5], gap: spacing[4] },
  offersRow: { gap: spacing[3], paddingRight: spacing[5] },
  offerCard: {
    width: 160,
    height: 130,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    padding: spacing[4],
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  offerTag: {
    backgroundColor: colors.primaryMuted,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  offerTagText: { fontSize: 9, fontWeight: '700', color: colors.primary, letterSpacing: 1 },
  offerContent: { gap: 2 },
  offerTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  offerSubtitle: { fontSize: 12, color: colors.primary },
  offerLine: { position: 'absolute', bottom: 0, left: spacing[4], right: spacing[4], height: 1, backgroundColor: colors.primaryBorder },
  bottomPad: { height: spacing[5] },
});
