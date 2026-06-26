import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export function VanirLogo() {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Image source={require('../assets/logo.png')} style={styles.mark} resizeMode="contain" />
      <View>
        <Pressable onPressIn={() => setIsPressed(true)} onPressOut={() => setIsPressed(false)} style={styles.brandRow}>
          <Text style={[styles.brandWord, isPressed && styles.brandWordActive]}>VANIR</Text>
          <Text style={[styles.brandWord, isPressed && styles.brandWordActive]}>GROUP</Text>
        </Pressable>
        <Text style={styles.caption}>Luxury travel</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mark: {
    width: 48,
    height: 48,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandWord: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 1,
  },
  brandWordActive: {
    color: colors.primary,
  },
  caption: {
    color: colors.primarySoft,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});