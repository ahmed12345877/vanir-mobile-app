import React, { useMemo, useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen, SectionCard, screenStyles } from '../../components/Screen';
import { useCart, type CartItem } from '../../context/CartContext';
import { trpc } from '../../lib/trpc';
import type { RootStackParamList } from '../../navigation/types';
import { bookFlight, bookHotel, checkoutTravelEssentials } from '../../services/travelBooking';
import { colors } from '../../theme/colors';

type CheckoutResult = {
  id: string;
  title: string;
  confirmation: string;
  status: string;
};

export function UnifiedCheckoutScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { items, removeItem, clearCart } = useCart();
  const createBooking = trpc.bookings.create.useMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<CheckoutResult[]>([]);

  const groupedCounts = useMemo(
    () => ({
      booking: items.filter(item => item.kind === 'package' || item.kind === 'flight' || item.kind === 'hotel').length,
      essentials: items.filter(item => item.kind === 'essential').length,
    }),
    [items],
  );

  async function processItem(item: CartItem): Promise<CheckoutResult> {
    if (item.kind === 'package') {
      const booking = await createBooking.mutateAsync({
        packageName: item.payload.packageName,
        guestName: item.payload.guestName,
        guestEmail: item.payload.guestEmail,
        adults: item.payload.adults,
        paymentMethod: 'credit_card',
        currency: 'USD',
        specialRequests: [
          `Children: ${item.payload.children}`,
          item.payload.dateFrom ? `Date from: ${item.payload.dateFrom}` : null,
          item.payload.dateTo ? `Date to: ${item.payload.dateTo}` : null,
          `Travel style: ${item.payload.travelStyle}`,
          item.payload.specialRequests ? `Notes: ${item.payload.specialRequests}` : null,
        ]
          .filter(Boolean)
          .join('\n'),
      });

      return {
        id: item.id,
        title: item.title,
        confirmation: (booking as { confirmationCode?: string }).confirmationCode ?? 'Pending',
        status: 'confirmed',
      };
    }

    if (item.kind === 'flight') {
      const booking = await bookFlight(item.payload);
      return {
        id: item.id,
        title: item.title,
        confirmation: booking.confirmationCode,
        status: booking.status,
      };
    }

    if (item.kind === 'hotel') {
      const booking = await bookHotel(item.payload);
      return {
        id: item.id,
        title: item.title,
        confirmation: booking.confirmationCode,
        status: booking.status,
      };
    }

    const checkout = await checkoutTravelEssentials(item.payload);
    return {
      id: item.id,
      title: item.title,
      confirmation: checkout.confirmationCode,
      status: checkout.status,
    };
  }

  async function handleUnifiedCheckout() {
    if (!items.length) {
      Alert.alert('Your cart is empty', 'Add booking products or travel essentials first.');
      return;
    }

    try {
      setIsSubmitting(true);
      const confirmations: CheckoutResult[] = [];

      for (const item of items) {
        const result = await processItem(item);
        confirmations.push(result);
      }

      setResults(confirmations);
      clearCart();
      Alert.alert('Unified checkout complete', `${confirmations.length} item(s) processed successfully.`);
    } catch (error) {
      Alert.alert('Unified checkout failed', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Screen
      title="Unified checkout"
      subtitle="One cart for packages, flights, hotels, visa assistance, eSIM activation, and insurance issuance.">
      <SectionCard>
        <Text style={screenStyles.label}>Cart overview</Text>
        <Text style={styles.heroTitle}>Review everything once, then process the trip in a single checkout pass.</Text>
        <Text style={screenStyles.body}>
          Travel products remain separated operationally behind the scenes, but the app now lets the user manage them from one premium basket.
        </Text>
        <View style={styles.metricsRow}>
          <Metric label="Total items" value={String(items.length)} />
          <Metric label="Bookings" value={String(groupedCounts.booking)} />
          <Metric label="Essentials" value={String(groupedCounts.essentials)} />
        </View>
      </SectionCard>

      {items.length ? (
        <View style={styles.stack}>
          {items.map(item => (
            <SectionCard key={item.id}>
              {item.imageUrl ? <Image source={{ uri: item.imageUrl }} style={styles.image} /> : null}
              <View style={styles.cardTopRow}>
                <Text style={screenStyles.label}>{item.kind === 'essential' ? item.category : item.kind}</Text>
                <Text style={styles.price}>{item.price}</Text>
              </View>
              <Text style={screenStyles.sectionTitle}>{item.title}</Text>
              <Text style={screenStyles.body}>{item.subtitle}</Text>
              <Pressable style={styles.secondaryButton} onPress={() => removeItem(item.id)}>
                <Text style={styles.secondaryButtonText}>Remove from cart</Text>
              </Pressable>
            </SectionCard>
          ))}
        </View>
      ) : (
        <SectionCard>
          <Text style={screenStyles.sectionTitle}>Cart is empty</Text>
          <Text style={screenStyles.body}>Add booking products or travel essentials first, then return here to process everything together.</Text>
          <View style={styles.emptyActions}>
            <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate('Booking')}>
              <Text style={styles.secondaryButtonText}>Open booking hub</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate('TravelEssentials')}>
              <Text style={styles.secondaryButtonText}>Open travel essentials</Text>
            </Pressable>
          </View>
        </SectionCard>
      )}

      <SectionCard>
        <Text style={screenStyles.sectionTitle}>Process checkout</Text>
        <Text style={screenStyles.body}>The app will submit each cart item to its owning backend in sequence and return confirmations in one place.</Text>
        <Pressable style={styles.primaryButton} onPress={handleUnifiedCheckout} disabled={isSubmitting || !items.length}>
          <Text style={styles.primaryButtonText}>{isSubmitting ? 'Processing...' : 'Run unified checkout'}</Text>
        </Pressable>
      </SectionCard>

      {results.length ? (
        <SectionCard>
          <Text style={screenStyles.sectionTitle}>Latest confirmations</Text>
          <View style={styles.stack}>
            {results.map(result => (
              <View key={result.id} style={styles.resultCard}>
                <Text style={styles.resultTitle}>{result.title}</Text>
                <Text style={styles.resultMeta}>Confirmation: {result.confirmation}</Text>
                <Text style={styles.resultMeta}>Status: {result.status}</Text>
              </View>
            ))}
          </View>
        </SectionCard>
      ) : null}
    </Screen>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  heroTitle: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 29,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
  },
  metricValue: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: '800',
  },
  metricLabel: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  stack: {
    gap: 12,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 16,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  price: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryButton: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
    paddingVertical: 12,
  },
  secondaryButtonText: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  emptyActions: {
    gap: 10,
  },
  primaryButton: {
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: colors.primary,
    paddingVertical: 14,
  },
  primaryButtonText: {
    color: colors.background,
    fontWeight: '800',
  },
  resultCard: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 4,
  },
  resultTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  resultMeta: {
    color: colors.textSecondary,
    fontSize: 13,
  },
});