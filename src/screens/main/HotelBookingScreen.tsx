import React, { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CounterInput } from '../../components/CounterInput';
import { InlineCalendarField } from '../../components/InlineCalendarField';
import { SupportActionStrip } from '../../components/SupportActionStrip';
import { Screen, SectionCard, screenStyles } from '../../components/Screen';
import { useCart } from '../../context/CartContext';
import type { RootStackParamList } from '../../navigation/types';
import { searchHotels, type HotelOffer } from '../../services/travelBooking';
import { colors } from '../../theme/colors';

export function HotelBookingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { addItem } = useCart();
  const [city, setCity] = useState('Cairo');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [roomType, setRoomType] = useState('Deluxe King');
  const [mealPlan, setMealPlan] = useState('Breakfast included');
  const [offers, setOffers] = useState<HotelOffer[]>([]);
  const [selectedOfferId, setSelectedOfferId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const selectedOffer = offers.find(offer => offer.id === selectedOfferId) ?? offers[0];

  async function handleSearch() {
    try {
      setIsSearching(true);
      const nextOffers = await searchHotels({ city, checkIn, checkOut, rooms, adults, children });
      setOffers(nextOffers);
      setSelectedOfferId(nextOffers[0]?.id ?? '');
      setRoomType(nextOffers[0]?.roomTypes[0] ?? 'Deluxe King');
      setMealPlan(nextOffers[0]?.mealPlans[0] ?? 'Breakfast included');
    } catch (error) {
      Alert.alert('Search failed', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setIsSearching(false);
    }
  }

  function handleBooking() {
    if (!selectedOfferId) {
      Alert.alert('Select a hotel', 'Search first and choose one hotel offer.');
      return;
    }

    addItem({
      id: `hotel-${selectedOfferId}`,
      kind: 'hotel',
      title: selectedOffer?.name ?? 'Hotel booking',
      subtitle: selectedOffer?.location ?? city,
      price: selectedOffer?.nightlyRate ?? 'Hotel pricing',
      imageUrl: selectedOffer?.imageUrl,
      payload: {
        offerId: selectedOfferId,
        guestName,
        guestEmail,
        adults,
        children,
        dates: { from: checkIn, to: checkOut },
        details: { city, rooms, roomType, mealPlan },
        specialRequests,
      },
    });

    Alert.alert('Added to cart', 'Hotel selection was saved in unified checkout.');
    navigation.navigate('UnifiedCheckout');
  }

  return (
    <Screen title="Hotels" subtitle="Search and confirm hotels against the dedicated hotel booking API." actions={<SupportActionStrip focus="book" />}>
      <SectionCard>
        <Text style={screenStyles.sectionTitle}>Hotel search</Text>
        <TextInput style={styles.input} value={city} onChangeText={setCity} placeholder="City" placeholderTextColor={colors.textMuted} />
        <View style={styles.row}>
          <InlineCalendarField label="Check-in" value={checkIn} onChange={setCheckIn} />
          <InlineCalendarField label="Check-out" value={checkOut} onChange={setCheckOut} />
        </View>
        <View style={styles.row}>
          <CounterInput label="Rooms" value={rooms} onChange={setRooms} min={1} />
          <CounterInput label="Adults" value={adults} onChange={setAdults} min={1} />
          <CounterInput label="Children" value={children} onChange={setChildren} />
        </View>
        <Pressable style={styles.button} onPress={handleSearch} disabled={isSearching}>
          <Text style={styles.buttonText}>{isSearching ? 'Searching...' : 'Search hotels'}</Text>
        </Pressable>
      </SectionCard>

      {offers.length ? (
        <SectionCard>
          <Text style={screenStyles.sectionTitle}>Available stays</Text>
          <View style={styles.stack}>
            {offers.map(offer => (
              <Pressable key={offer.id} style={[styles.offerCard, selectedOfferId === offer.id && styles.offerCardActive]} onPress={() => setSelectedOfferId(offer.id)}>
                <Image source={{ uri: offer.imageUrl }} style={styles.offerImage} />
                <View style={styles.offerBody}>
                  <Text style={styles.offerTitle}>{offer.name}</Text>
                  <Text style={styles.offerMeta}>{offer.location} · {offer.stars}</Text>
                  <Text style={screenStyles.body}>{offer.highlights.join(' · ')}</Text>
                  <Text style={styles.offerMeta}>{offer.boardType}</Text>
                  <Text style={styles.offerMeta}>Room types: {offer.roomTypes.join(' · ')}</Text>
                  <Text style={styles.offerPrice}>{offer.nightlyRate}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </SectionCard>
      ) : null}

      {selectedOffer ? (
        <SectionCard>
          <Text style={screenStyles.sectionTitle}>Guest confirmation</Text>
          <Image source={{ uri: selectedOffer.imageUrl }} style={styles.heroImage} />
          <Text style={styles.offerPrice}>{selectedOffer.nightlyRate}</Text>
          <View style={styles.optionRow}>
            {selectedOffer.roomTypes.map(option => (
              <Pressable key={option} style={[styles.optionChip, roomType === option && styles.optionChipActive]} onPress={() => setRoomType(option)}>
                <Text style={[styles.optionText, roomType === option && styles.optionTextActive]}>{option}</Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.optionRow}>
            {selectedOffer.mealPlans.map(option => (
              <Pressable key={option} style={[styles.optionChip, mealPlan === option && styles.optionChipActive]} onPress={() => setMealPlan(option)}>
                <Text style={[styles.optionText, mealPlan === option && styles.optionTextActive]}>{option}</Text>
              </Pressable>
            ))}
          </View>
          <TextInput style={styles.input} value={guestName} onChangeText={setGuestName} placeholder="Guest name" placeholderTextColor={colors.textMuted} />
          <TextInput style={styles.input} value={guestEmail} onChangeText={setGuestEmail} placeholder="Guest email" placeholderTextColor={colors.textMuted} autoCapitalize="none" keyboardType="email-address" />
          <TextInput style={[styles.input, styles.textArea]} value={specialRequests} onChangeText={setSpecialRequests} placeholder="Special requests" placeholderTextColor={colors.textMuted} multiline />
          <Pressable style={styles.button} onPress={handleBooking}>
            <Text style={styles.buttonText}>Add hotel to cart</Text>
          </Pressable>
        </SectionCard>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10 },
  stack: { gap: 12 },
  input: { backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border, borderRadius: 12, color: colors.textPrimary, paddingHorizontal: 14, paddingVertical: 12 },
  button: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 14 },
  buttonText: { color: colors.background, fontWeight: '700' },
  offerCard: { borderRadius: 18, overflow: 'hidden', backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border },
  offerCardActive: { borderColor: colors.primary },
  offerImage: { width: '100%', height: 180 },
  offerBody: { padding: 14, gap: 6 },
  offerTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: '700' },
  offerMeta: { color: colors.textSecondary, lineHeight: 20 },
  offerPrice: { color: colors.primary, fontSize: 16, fontWeight: '700' },
  heroImage: { width: '100%', height: 220, borderRadius: 18 },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionChip: { borderWidth: 1, borderColor: colors.border, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: colors.surfaceAlt },
  optionChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  optionText: { color: colors.textSecondary, fontSize: 12, fontWeight: '600' },
  optionTextActive: { color: colors.background },
});