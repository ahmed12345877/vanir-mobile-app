import React, { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { CounterInput } from '../../components/CounterInput';
import { InlineCalendarField } from '../../components/InlineCalendarField';
import { SupportActionStrip } from '../../components/SupportActionStrip';
import { Screen, SectionCard, screenStyles } from '../../components/Screen';
import { companyContent } from '../../content/companyContent';
import { trpc } from '../../lib/trpc';
import { colors } from '../../theme/colors';

export function PackageBookingScreen() {
  const createBooking = trpc.bookings.create.useMutation();
  const [selectedPackage, setSelectedPackage] = useState(companyContent.packages[0]?.title ?? '');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [travelStyle, setTravelStyle] = useState('Private luxury');
  const [specialRequests, setSpecialRequests] = useState('');

  const currentPackage = companyContent.packages.find(item => item.title === selectedPackage) ?? companyContent.packages[0];

  async function submit() {
    try {
      const booking = await createBooking.mutateAsync({
        packageName: selectedPackage,
        guestName,
        guestEmail,
        adults,
        paymentMethod: 'credit_card',
        currency: 'USD',
        specialRequests: [
          `Children: ${children}`,
          dateFrom ? `Date from: ${dateFrom}` : null,
          dateTo ? `Date to: ${dateTo}` : null,
          `Travel style: ${travelStyle}`,
          specialRequests ? `Notes: ${specialRequests}` : null,
        ].filter(Boolean).join('\n'),
      });

      Alert.alert('Package booked', `Confirmation code: ${(booking as { confirmationCode?: string }).confirmationCode ?? 'Pending'}`);
    } catch (error) {
      Alert.alert('Booking failed', error instanceof Error ? error.message : 'Please try again.');
    }
  }

  return (
    <Screen title="Packages" subtitle="Book curated VANIR journeys with a dedicated package flow." actions={<SupportActionStrip focus="book" />}>
      <SectionCard>
        <Text style={screenStyles.sectionTitle}>Choose a package</Text>
        <View style={styles.stack}>
          {companyContent.packages.map(item => {
            const selected = item.title === selectedPackage;
            return (
              <Pressable key={item.title} style={[styles.offerCard, selected && styles.offerCardActive]} onPress={() => setSelectedPackage(item.title)}>
                <Image source={{ uri: item.imageUrl }} style={styles.offerImage} />
                <View style={styles.offerBody}>
                  <Text style={styles.offerTitle}>{item.title}</Text>
                  <Text style={styles.offerMeta}>{item.region}</Text>
                  <Text style={screenStyles.body}>{item.summary}</Text>
                  <Text style={styles.offerPrice}>{item.price}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </SectionCard>

      <SectionCard>
        <Text style={screenStyles.sectionTitle}>Travel details</Text>
        <Image source={{ uri: currentPackage.imageUrl }} style={styles.heroImage} />
        <Text style={styles.offerPrice}>{currentPackage.price}</Text>
        <View style={styles.counterRow}>
          <CounterInput label="Adults" value={adults} onChange={setAdults} min={1} />
          <CounterInput label="Children" value={children} onChange={setChildren} />
        </View>
        <View style={styles.counterRow}>
          <InlineCalendarField label="Departure" value={dateFrom} onChange={setDateFrom} />
          <InlineCalendarField label="Return" value={dateTo} onChange={setDateTo} />
        </View>
        <TextInput style={styles.input} value={guestName} onChangeText={setGuestName} placeholder="Guest name" placeholderTextColor={colors.textMuted} />
        <TextInput style={styles.input} value={guestEmail} onChangeText={setGuestEmail} placeholder="Guest email" placeholderTextColor={colors.textMuted} autoCapitalize="none" keyboardType="email-address" />
        <TextInput style={styles.input} value={travelStyle} onChangeText={setTravelStyle} placeholder="Travel style" placeholderTextColor={colors.textMuted} />
        <TextInput style={[styles.input, styles.textArea]} value={specialRequests} onChangeText={setSpecialRequests} placeholder="Special requests" placeholderTextColor={colors.textMuted} multiline />
        <Pressable style={styles.button} onPress={submit} disabled={createBooking.isPending}>
          <Text style={styles.buttonText}>{createBooking.isPending ? 'Submitting...' : 'Confirm package booking'}</Text>
        </Pressable>
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 12 },
  offerCard: { borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceAlt },
  offerCardActive: { borderColor: colors.primary },
  offerImage: { width: '100%', height: 180 },
  offerBody: { padding: 14, gap: 6 },
  offerTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: '700' },
  offerMeta: { color: colors.textSecondary },
  offerPrice: { color: colors.primary, fontSize: 16, fontWeight: '700' },
  heroImage: { width: '100%', height: 210, borderRadius: 18 },
  counterRow: { flexDirection: 'row', gap: 10 },
  input: { backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border, borderRadius: 12, color: colors.textPrimary, paddingHorizontal: 14, paddingVertical: 12 },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  button: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 14 },
  buttonText: { color: colors.background, fontWeight: '700' },
});