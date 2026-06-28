import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { GoldButton } from './GoldButton';
import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';
import type { BookingCategory } from './CategorySwitcher';

interface SearchCardProps {
  category: BookingCategory;
  onSearch: (params: SearchParams) => void;
}

export interface SearchParams {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  category: BookingCategory;
}

export function SearchCard({ category, onSearch }: SearchCardProps) {
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  const isFlights = category === 'flights';
  const isCars = category === 'cars';
  const isAI = category === 'ai-studio';

  const destPlaceholder = isFlights
    ? 'From → To (e.g. Cairo → Dubai)'
    : isCars
    ? 'Pick-up location'
    : isAI
    ? 'Where would you like to go?'
    : 'Destination or property';

  return (
    <View style={styles.card}>
      {/* Destination */}
      <View style={styles.field}>
        <Text style={styles.fieldIcon}>{isFlights ? '✈' : isCars ? '🚗' : isAI ? '✦' : '📍'}</Text>
        <TextInput
          style={styles.input}
          value={destination}
          onChangeText={setDestination}
          placeholder={destPlaceholder}
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.primary}
        />
      </View>

      {!isAI && (
        <>
          <View style={styles.divider} />

          {/* Date row */}
          <View style={styles.dateRow}>
            <View style={[styles.field, styles.flex1]}>
              <Text style={styles.fieldIcon}>📅</Text>
              <TextInput
                style={styles.input}
                value={checkIn}
                onChangeText={setCheckIn}
                placeholder={isFlights ? 'Departure' : isCars ? 'Pick-up date' : 'Check-in'}
                placeholderTextColor={colors.textMuted}
                selectionColor={colors.primary}
              />
            </View>

            <View style={styles.dateSeparator}>
              <View style={styles.dateSeparatorLine} />
              <Text style={styles.dateSeparatorArrow}>→</Text>
              <View style={styles.dateSeparatorLine} />
            </View>

            <View style={[styles.field, styles.flex1]}>
              <TextInput
                style={styles.input}
                value={checkOut}
                onChangeText={setCheckOut}
                placeholder={isFlights ? 'Return' : isCars ? 'Drop-off date' : 'Check-out'}
                placeholderTextColor={colors.textMuted}
                selectionColor={colors.primary}
              />
            </View>
          </View>

          <View style={styles.divider} />

          {/* Guests */}
          <View style={styles.guestsRow}>
            <Text style={styles.fieldIcon}>👤</Text>
            <Text style={styles.guestsLabel}>
              {isFlights ? 'Passengers' : isCars ? 'Drivers' : 'Guests'}
            </Text>
            <View style={styles.guestCounter}>
              <Pressable
                onPress={() => setGuests(g => Math.max(1, g - 1))}
                style={styles.counterBtn}>
                <Text style={styles.counterBtnText}>−</Text>
              </Pressable>
              <Text style={styles.counterValue}>{guests}</Text>
              <Pressable
                onPress={() => setGuests(g => Math.min(20, g + 1))}
                style={styles.counterBtn}>
                <Text style={styles.counterBtnText}>+</Text>
              </Pressable>
            </View>
          </View>
        </>
      )}

      <GoldButton
        label={isAI ? 'Ask AI Concierge' : 'Search'}
        onPress={() =>
          onSearch({ destination, checkIn, checkOut, guests, category })
        }
        fullWidth
        size="lg"
        style={styles.searchBtn}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius['2xl'],
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    overflow: 'hidden',
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    gap: spacing[3],
  },
  fieldIcon: {
    fontSize: 16,
    width: 22,
    textAlign: 'center',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing[4],
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flex1: { flex: 1 },
  dateSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing[2],
  },
  dateSeparatorLine: {
    width: 8,
    height: 1,
    backgroundColor: colors.primaryBorder,
  },
  dateSeparatorArrow: {
    color: colors.primary,
    fontSize: 12,
  },
  guestsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    gap: spacing[3],
  },
  guestsLabel: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  guestCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  counterBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBtnText: {
    color: colors.primary,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '700',
  },
  counterValue: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    minWidth: 24,
    textAlign: 'center',
  },
  searchBtn: {
    margin: spacing[4],
    marginTop: spacing[4],
  },
});
