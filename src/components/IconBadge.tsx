import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

const glyphs: Record<string, string> = {
  Home: '⌂',
  Gallery: '◫',
  Offers: '✦',
  Blog: '⌘',
  Profile: '◉',
  booking: '✈',
  reviews: '★',
  signIn: '→',
  imageOff: '⊘',
};

type IconBadgeProps = {
  name: keyof typeof glyphs;
  size?: number;
  active?: boolean;
};

export function IconBadge({ name, size = 22, active = false }: IconBadgeProps) {
  return (
    <View style={[styles.badge, active && styles.badgeActive, { width: size + 12, height: size + 12, borderRadius: (size + 12) / 2 }]}>
      <Text style={[styles.glyph, { fontSize: size }, active && styles.glyphActive]}>{glyphs[name]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
  },
  badgeActive: {
    borderColor: colors.primary,
    backgroundColor: '#2a2313',
  },
  glyph: {
    color: colors.textSecondary,
    fontWeight: '700',
    lineHeight: 24,
  },
  glyphActive: {
    color: colors.primary,
  },
});