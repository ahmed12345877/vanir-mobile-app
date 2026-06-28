import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface ArtDecoHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export function ArtDecoHeader({ title, subtitle, centered = false }: ArtDecoHeaderProps) {
  return (
    <View style={[styles.container, centered && styles.centered]}>
      {/* Top geometric line ornament */}
      <View style={[styles.ornamentRow, centered && styles.ornamentCentered]}>
        <View style={styles.ornamentLine} />
        <View style={styles.ornamentDiamond} />
        <View style={styles.ornamentLine} />
      </View>

      <Text style={[styles.title, centered && styles.textCenter]}>{title}</Text>

      {subtitle && (
        <Text style={[styles.subtitle, centered && styles.textCenter]}>{subtitle}</Text>
      )}

      {/* Bottom thin gold rule */}
      <View style={[styles.bottomRule, centered && styles.bottomRuleCentered]} />
    </View>
  );
}

/** Compact version for section headings */
export function SectionHeading({ label }: { label: string }) {
  return (
    <View style={styles.sectionRow}>
      <View style={styles.sectionDot} />
      <Text style={styles.sectionLabel}>{label}</Text>
      <View style={styles.sectionLineRight} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing[2],
  },
  centered: {
    alignItems: 'center',
  },
  ornamentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  ornamentCentered: {
    alignSelf: 'center',
    width: 120,
  },
  ornamentLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.primaryBorder,
  },
  ornamentDiamond: {
    width: 6,
    height: 6,
    backgroundColor: colors.primary,
    transform: [{ rotate: '45deg' }],
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontFamily: 'Georgia',
  },
  textCenter: {
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  bottomRule: {
    height: 1,
    backgroundColor: colors.primaryBorder,
    marginTop: spacing[1],
  },
  bottomRuleCentered: {
    width: 80,
    alignSelf: 'center',
  },
  // Section heading
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  sectionDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  sectionLineRight: {
    flex: 1,
    height: 1,
    backgroundColor: colors.primaryBorder,
  },
});
