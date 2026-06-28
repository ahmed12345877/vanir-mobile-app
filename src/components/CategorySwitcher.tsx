import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';

export type BookingCategory = 'stays' | 'flights' | 'cars' | 'ai-studio';

interface Category {
  id: BookingCategory;
  label: string;
  icon: string;
}

const CATEGORIES: Category[] = [
  { id: 'stays', label: 'Stays', icon: '🏨' },
  { id: 'flights', label: 'Flights', icon: '✈️' },
  { id: 'cars', label: 'Luxury Cars', icon: '🚗' },
  { id: 'ai-studio', label: 'AI Studio', icon: '✦' },
];

interface CategorySwitcherProps {
  active: BookingCategory;
  onChange: (cat: BookingCategory) => void;
}

export function CategorySwitcher({ active, onChange }: CategorySwitcherProps) {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {CATEGORIES.map(cat => {
          const isActive = cat.id === active;
          return (
            <Pressable
              key={cat.id}
              onPress={() => onChange(cat.id)}
              style={[styles.tab, isActive && styles.tabActive]}>
              <Text style={styles.icon}>{cat.icon}</Text>
              <Text style={[styles.label, isActive && styles.labelActive]}>{cat.label}</Text>
              {isActive && <View style={styles.activeLine} />}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  scrollContent: {
    paddingHorizontal: spacing[5],
    gap: spacing[1],
  },
  tab: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    alignItems: 'center',
    gap: spacing[1],
    position: 'relative',
    minWidth: 72,
  },
  tabActive: {},
  icon: {
    fontSize: 18,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  labelActive: {
    color: colors.primary,
  },
  activeLine: {
    position: 'absolute',
    bottom: -1,
    left: spacing[3],
    right: spacing[3],
    height: 2,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
});
