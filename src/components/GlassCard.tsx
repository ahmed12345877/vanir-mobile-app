import React, { PropsWithChildren } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { borderRadius, shadow, spacing } from '../theme/spacing';

interface GlassCardProps extends PropsWithChildren {
  style?: ViewStyle;
  elevated?: boolean;
  goldBorder?: boolean;
  padding?: number;
  noPadding?: boolean;
}

export function GlassCard({
  children,
  style,
  elevated = false,
  goldBorder = false,
  padding,
  noPadding = false,
}: GlassCardProps) {
  return (
    <View
      style={[
        styles.card,
        elevated && styles.elevated,
        goldBorder && styles.goldBorder,
        !noPadding && { padding: padding ?? spacing[4] },
        style,
      ]}>
      {/* Top sheen line — Art Deco accent */}
      {goldBorder && <View style={styles.topSheen} />}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.glass,
    borderRadius: borderRadius['2xl'],
    borderWidth: 1,
    borderColor: colors.glassBorder,
    overflow: 'hidden',
    ...shadow.card,
  },
  elevated: {
    backgroundColor: colors.surfaceElevated,
    ...shadow.goldGlow,
  },
  goldBorder: {
    borderColor: colors.primaryBorder,
  },
  topSheen: {
    position: 'absolute',
    top: 0,
    left: spacing[6],
    right: spacing[6],
    height: 1,
    backgroundColor: colors.primaryBorderStrong,
    borderRadius: borderRadius.full,
  },
});
