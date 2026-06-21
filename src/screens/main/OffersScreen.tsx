import React from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import { Screen, SectionCard, screenStyles } from '../../components/Screen';
import { trpc } from '../../lib/trpc';
import { colors } from '../../theme/colors';

type Offer = {
  id?: number;
  title?: string;
  description?: string;
  discountType?: 'percentage' | 'fixed';
  discountValue?: string;
  promoCode?: string;
  endDate?: number;
};

export function OffersScreen() {
  const offersQuery = trpc.offers.listActive.useQuery();
  const offers = (offersQuery.data ?? []) as Offer[];

  return (
    <Screen title="Offers" subtitle="The same active promotions can be surfaced on mobile and applied during booking.">
      <FlatList
        data={offers}
        keyExtractor={(item, index) => String(item.id ?? index)}
        scrollEnabled={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <SectionCard>
            <Text style={screenStyles.label}>{item.promoCode ?? 'Active offer'}</Text>
            <Text style={screenStyles.sectionTitle}>{item.title ?? 'Seasonal package'}</Text>
            <Text style={screenStyles.body}>{item.description ?? 'Offer details are managed by the existing backend.'}</Text>
            <Text style={styles.discountText}>
              {item.discountType === 'percentage' ? `${item.discountValue}% off` : `${item.discountValue} off`}
            </Text>
          </SectionCard>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No active offers are available right now.</Text>}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
  discountText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  emptyText: {
    color: colors.textSecondary,
  },
});
