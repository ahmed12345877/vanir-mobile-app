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
import { searchFlights, type FlightOffer } from '../../services/travelBooking';
import { colors } from '../../theme/colors';

export function FlightBookingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { addItem } = useCart();
  const [origin, setOrigin] = useState('London Heathrow');
  const [destination, setDestination] = useState('Cairo');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [cabin, setCabin] = useState('Business Class');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [seatPreference, setSeatPreference] = useState('Window');
  const [baggagePlan, setBaggagePlan] = useState('1 cabin bag');
  const [offers, setOffers] = useState<FlightOffer[]>([]);
  const [selectedOfferId, setSelectedOfferId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const selectedOffer = offers.find(offer => offer.id === selectedOfferId) ?? offers[0];

  async function handleSearch() {
    try {
      setIsSearching(true);
      const nextOffers = await searchFlights({ origin, destination, departureDate, returnDate, adults, children, cabin });
      setOffers(nextOffers);
      setSelectedOfferId(nextOffers[0]?.id ?? '');
      setSeatPreference(nextOffers[0]?.seatOptions[0] ?? 'Window');
      setBaggagePlan(nextOffers[0]?.baggageOptions[0] ?? '1 cabin bag');
    } catch (error) {
      Alert.alert('Search failed', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setIsSearching(false);
    }
  }

  function handleBooking() {
    if (!selectedOfferId) {
      Alert.alert('Select a flight', 'Search first and choose one flight offer.');
      return;
    }

    addItem({
      id: `flight-${selectedOfferId}`,
      kind: 'flight',
      title: selectedOffer?.airline ?? 'Flight booking',
      subtitle: selectedOffer?.route ?? `${origin} to ${destination}`,
      price: selectedOffer?.price ?? 'Flight pricing',
      imageUrl: selectedOffer?.imageUrl,
      payload: {
        offerId: selectedOfferId,
        guestName,
        guestEmail,
        adults,
        children,
        dates: { from: departureDate, to: returnDate },
        details: { origin, destination, cabin, seatPreference, baggagePlan },
        specialRequests,
      },
    });

    Alert.alert('Added to cart', 'Flight selection was saved in unified checkout.');
    navigation.navigate('UnifiedCheckout');
  }

  return (
    <Screen title="Flights" subtitle="Search and book flights against the dedicated travel booking API." actions={<SupportActionStrip focus="book" />}>
      <SectionCard>
        <Text style={screenStyles.sectionTitle}>Flight search</Text>
        <TextInput style={styles.input} value={origin} onChangeText={setOrigin} placeholder="Origin" placeholderTextColor={colors.textMuted} />
        <TextInput style={styles.input} value={destination} onChangeText={setDestination} placeholder="Destination" placeholderTextColor={colors.textMuted} />
        <TextInput style={styles.input} value={cabin} onChangeText={setCabin} placeholder="Cabin" placeholderTextColor={colors.textMuted} />
        <View style={styles.row}>
          <InlineCalendarField label="Departure" value={departureDate} onChange={setDepartureDate} />
          <InlineCalendarField label="Return" value={returnDate} onChange={setReturnDate} />
        </View>
        <View style={styles.row}>
          <CounterInput label="Adults" value={adults} onChange={setAdults} min={1} />
          <CounterInput label="Children" value={children} onChange={setChildren} />
        </View>
        <Pressable style={styles.button} onPress={handleSearch} disabled={isSearching}>
          <Text style={styles.buttonText}>{isSearching ? 'Searching...' : 'Search flights'}</Text>
        </Pressable>
      </SectionCard>

      {offers.length ? (
        <SectionCard>
          <Text style={screenStyles.sectionTitle}>Available flights</Text>
          <View style={styles.stack}>
            {offers.map(offer => (
              <Pressable key={offer.id} style={[styles.offerCard, selectedOfferId === offer.id && styles.offerCardActive]} onPress={() => setSelectedOfferId(offer.id)}>
                <Image source={{ uri: offer.imageUrl }} style={styles.offerImage} />
                <View style={styles.offerBody}>
                  <Text style={styles.offerTitle}>{offer.airline}</Text>
                  <Text style={styles.offerMeta}>{offer.route}</Text>
                  <Text style={screenStyles.body}>{offer.schedule}</Text>
                  <Text style={styles.offerMeta}>{offer.cabin} · {offer.baggage}</Text>
                  <Text style={styles.offerMeta}>Seats: {offer.seatOptions.join(' · ')}</Text>
                  <Text style={styles.offerPrice}>{offer.price}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </SectionCard>
      ) : null}

      {selectedOffer ? (
        <SectionCard>
          <Text style={screenStyles.sectionTitle}>Traveler confirmation</Text>
          <Image source={{ uri: selectedOffer.imageUrl }} style={styles.heroImage} />
          <Text style={styles.offerPrice}>{selectedOffer.price}</Text>
          <View style={styles.optionRow}>
            {selectedOffer.cabinOptions.map(option => (
              <Pressable key={option} style={[styles.optionChip, cabin === option && styles.optionChipActive]} onPress={() => setCabin(option)}>
                <Text style={[styles.optionText, cabin === option && styles.optionTextActive]}>{option}</Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.optionRow}>
            {selectedOffer.seatOptions.map(option => (
              <Pressable key={option} style={[styles.optionChip, seatPreference === option && styles.optionChipActive]} onPress={() => setSeatPreference(option)}>
                <Text style={[styles.optionText, seatPreference === option && styles.optionTextActive]}>{option}</Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.optionRow}>
            {selectedOffer.baggageOptions.map(option => (
              <Pressable key={option} style={[styles.optionChip, baggagePlan === option && styles.optionChipActive]} onPress={() => setBaggagePlan(option)}>
                <Text style={[styles.optionText, baggagePlan === option && styles.optionTextActive]}>{option}</Text>
              </Pressable>
            ))}
          </View>
          <TextInput style={styles.input} value={guestName} onChangeText={setGuestName} placeholder="Guest name" placeholderTextColor={colors.textMuted} />
          <TextInput style={styles.input} value={guestEmail} onChangeText={setGuestEmail} placeholder="Guest email" placeholderTextColor={colors.textMuted} autoCapitalize="none" keyboardType="email-address" />
          <TextInput style={[styles.input, styles.textArea]} value={specialRequests} onChangeText={setSpecialRequests} placeholder="Special requests" placeholderTextColor={colors.textMuted} multiline />
          <Pressable style={styles.button} onPress={handleBooking}>
            <Text style={styles.buttonText}>Add flight to cart</Text>
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