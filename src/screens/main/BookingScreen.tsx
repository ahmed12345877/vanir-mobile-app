import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput } from 'react-native';
import { Screen, SectionCard, screenStyles } from '../../components/Screen';
import { trpc } from '../../lib/trpc';
import { colors } from '../../theme/colors';

export function BookingScreen() {
  const createBooking = trpc.bookings.create.useMutation();
  const [packageName, setPackageName] = useState('Luxury Egypt Escape');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [adults, setAdults] = useState('2');
  const [specialRequests, setSpecialRequests] = useState('');

  async function submit() {
    try {
      const booking = await createBooking.mutateAsync({
        packageName,
        guestName,
        guestEmail,
        adults: Number(adults) || 1,
        specialRequests,
        paymentMethod: 'credit_card',
        currency: 'USD',
      });

      Alert.alert('Booking created', `Confirmation code: ${(booking as { confirmationCode?: string }).confirmationCode ?? 'Pending'}`);
      setSpecialRequests('');
    } catch (error) {
      Alert.alert('Booking failed', error instanceof Error ? error.message : 'Please try again.');
    }
  }

  return (
    <Screen title="Booking" subtitle="This screen mirrors the website’s booking mutation with a mobile-friendly form.">
      <SectionCard>
        <Text style={screenStyles.label}>Travel package</Text>
        <TextInput style={styles.input} value={packageName} onChangeText={setPackageName} placeholder="Package name" placeholderTextColor={colors.textMuted} />
        <TextInput style={styles.input} value={guestName} onChangeText={setGuestName} placeholder="Guest name" placeholderTextColor={colors.textMuted} />
        <TextInput
          style={styles.input}
          value={guestEmail}
          onChangeText={setGuestEmail}
          placeholder="Guest email"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={colors.textMuted}
        />
        <TextInput
          style={styles.input}
          value={adults}
          onChangeText={setAdults}
          placeholder="Adults"
          keyboardType="number-pad"
          placeholderTextColor={colors.textMuted}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          value={specialRequests}
          onChangeText={setSpecialRequests}
          placeholder="Special requests"
          placeholderTextColor={colors.textMuted}
          multiline
        />

        <Pressable style={styles.button} onPress={submit} disabled={createBooking.isPending}>
          <Text style={styles.buttonText}>{createBooking.isPending ? 'Submitting…' : 'Create booking'}</Text>
        </Pressable>
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    color: colors.textPrimary,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
  },
  buttonText: {
    color: colors.background,
    fontWeight: '700',
  },
});
