import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen, SectionCard, screenStyles } from '../../components/Screen';
import { companyContent } from '../../content/companyContent';
import type { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';

const offerCards = [
  {
    id: 'summer',
    title: 'Summer Early Bird',
    subtitle: 'Save on premium Egypt departures',
    badge: '20% OFF',
    code: 'SUMMER20',
    imageUrl: companyContent.packages[1]?.imageUrl,
    body: 'Reserve early for private transfers, luxury stays, and exclusive seasonal pricing before inventory closes.',
  },
  {
    id: 'nile',
    title: 'Luxury Nile Signature',
    subtitle: 'Curated cruise and temple access',
    badge: 'VIP',
    code: 'NILEVIP',
    imageUrl: companyContent.packages[0]?.imageUrl,
    body: 'Priority availability on one of our highest-demand Nile itineraries with premium cabins and concierge handling.',
  },
  {
    id: 'siwa',
    title: 'Wellness Escape',
    subtitle: 'Siwa and desert serenity package',
    badge: '10% OFF',
    code: 'WELLNESS',
    imageUrl: companyContent.packages[3]?.imageUrl,
    body: 'An elevated retreat with eco-lodge accommodation, curated wellness sessions, and private desert experiences.',
  },
];

export function OffersScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Screen
      title="Offers That Feel Premium"
      subtitle="Real visuals, clearer hierarchy, and direct booking actions instead of empty promotional blocks.">
      <SectionCard>
        <Text style={screenStyles.sectionTitle}>Current Highlights</Text>
        <Text style={screenStyles.body}>
          These offers are designed to move users directly into the booking funnel without sending them out to the website.
        </Text>
      </SectionCard>

      <View style={styles.offerList}>
        {offerCards.map(card => (
          <Pressable key={card.id} style={styles.offerCard} onPress={() => navigation.navigate('Booking')}>
            <Image source={{ uri: card.imageUrl }} style={styles.offerImage} />
            <View style={styles.offerBody}>
              <View style={styles.offerTopRow}>
                <Text style={styles.offerBadge}>{card.badge}</Text>
                <Text style={styles.offerCode}>{card.code}</Text>
              </View>
              <Text style={styles.offerTitle}>{card.title}</Text>
              <Text style={styles.offerSubtitle}>{card.subtitle}</Text>
              <Text style={styles.offerText}>{card.body}</Text>
              <View style={styles.offerActionRow}>
                <Text style={styles.offerAction}>Book now</Text>
                <Text style={styles.offerArrow}>→</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </View>

      <SectionCard>
        <Text style={screenStyles.sectionTitle}>Why this is better</Text>
        <Text style={screenStyles.body}>Each offer now has a visual anchor, a clear value proposition, and a direct route into booking.</Text>
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  offerList: {
    gap: 14,
  },
  offerCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  offerImage: {
    width: '100%',
    height: 210,
  },
  offerBody: {
    padding: 16,
    gap: 8,
  },
  offerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  offerBadge: {
    backgroundColor: colors.primary,
    color: colors.background,
    fontWeight: '800',
    fontSize: 11,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    overflow: 'hidden',
  },
  offerCode: {
    color: colors.primarySoft,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  offerTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
  },
  offerSubtitle: {
    color: colors.primarySoft,
    fontSize: 13,
    fontWeight: '600',
  },
  offerText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },
  offerActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  offerAction: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '800',
  },
  offerArrow: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '800',
  },
});
