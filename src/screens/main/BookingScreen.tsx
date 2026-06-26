import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SupportActionStrip } from '../../components/SupportActionStrip';
import { Screen, SectionCard, screenStyles } from '../../components/Screen';
import { useCart } from '../../context/CartContext';
import { companyContent } from '../../content/companyContent';
import type { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';

const bookingCategories = [
  {
    route: 'PackageBooking' as const,
    title: 'Luxury Packages',
    subtitle: 'Curated itineraries with stay, guides, and transfers',
    imageUrl: companyContent.packages[0]?.imageUrl,
    eyebrow: 'SIGNATURE',
    detail: 'All-in-one journeys',
  },
  {
    route: 'FlightBooking' as const,
    title: 'Flights',
    subtitle: 'Live search against the dedicated flight booking API',
    imageUrl: companyContent.flights[0]?.imageUrl,
    eyebrow: 'AIR',
    detail: 'Cabins, seats, baggage',
  },
  {
    route: 'HotelBooking' as const,
    title: 'Hotels',
    subtitle: 'Standalone hotel availability and room booking flow',
    imageUrl: companyContent.hotels[0]?.imageUrl,
    eyebrow: 'STAY',
    detail: 'Room and meal selection',
  },
];

const premiumSignals = [
  { label: 'Private handling', value: 'Concierge-ready' },
  { label: 'Booking speed', value: 'Mobile-first' },
  { label: 'Journey control', value: 'End-to-end' },
];

export function BookingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { itemCount } = useCart();

  return (
    <Screen
      title="Booking, Reframed"
      subtitle="A premium booking hub with stronger visual hierarchy, clearer paths into packages, flights, hotels, and a shared trip cart."
      actions={<SupportActionStrip focus="book" />}>
      <SectionCard>
        <Text style={screenStyles.label}>Luxury booking stack</Text>
        <Text style={styles.heroTitle}>Choose the service that matches the trip you want to build.</Text>
        <Text style={screenStyles.body}>
          Each route now behaves like a dedicated product line instead of a plain list. Packages, flights, and hotels are visually distinct and easier to trust.
        </Text>
        <Pressable style={styles.checkoutButton} onPress={() => navigation.navigate('UnifiedCheckout')}>
          <Text style={styles.checkoutButtonText}>Open unified checkout · {itemCount} item(s)</Text>
        </Pressable>
        <View style={styles.signalRow}>
          {premiumSignals.map(signal => (
            <View key={signal.label} style={styles.signalCard}>
              <Text style={styles.signalValue}>{signal.value}</Text>
              <Text style={styles.signalLabel}>{signal.label}</Text>
            </View>
          ))}
        </View>
      </SectionCard>

      <View style={styles.grid}>
        {bookingCategories.map(category => (
          <Pressable key={category.title} style={styles.card} onPress={() => navigation.navigate(category.route)}>
            {category.imageUrl ? <Image source={{ uri: category.imageUrl }} style={styles.image} /> : null}
            <View style={styles.imageOverlay}>
              <Text style={styles.eyebrow}>{category.eyebrow}</Text>
            </View>
            <View style={styles.body}>
              <Text style={styles.title}>{category.title}</Text>
              <Text style={styles.subtitle}>{category.subtitle}</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.detail}>{category.detail}</Text>
                <Text style={styles.arrow}>→</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroTitle: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 29,
  },
  signalRow: {
    flexDirection: 'row',
    gap: 10,
  },
  checkoutButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
  },
  checkoutButtonText: {
    color: colors.background,
    fontWeight: '800',
  },
  signalCard: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  signalValue: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '800',
  },
  signalLabel: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  grid: {
    gap: 14,
  },
  card: {
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: {
    width: '100%',
    height: 220,
  },
  imageOverlay: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: 'rgba(8,8,16,0.72)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  eyebrow: {
    color: colors.primarySoft,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  body: {
    padding: 16,
    gap: 8,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textSecondary,
    lineHeight: 22,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  detail: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  arrow: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '800',
  },
});
