import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

type ActionTone = 'book' | 'contact' | 'whatsapp';

type SupportActionStripProps = {
  focus?: ActionTone;
};

const actions: Array<{
  key: ActionTone;
  label: string;
  subtitle: string;
  onPress: (navigation: NativeStackNavigationProp<RootStackParamList>) => void;
}> = [
  {
    key: 'book',
    label: 'Book',
    subtitle: 'Start a booking',
    onPress: navigation => navigation.navigate('Booking'),
  },
  {
    key: 'contact',
    label: 'Contact',
    subtitle: 'Open travel desk',
    onPress: navigation => navigation.navigate('Contact'),
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    subtitle: 'Chat with support',
    onPress: navigation => navigation.navigate('Contact', { channel: 'whatsapp' }),
  },
];

export function SupportActionStrip({ focus }: SupportActionStripProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.row}>
      {actions.map(action => {
        const active = focus === action.key;
        return (
          <Pressable
            key={action.key}
            style={[styles.actionCard, active && styles.actionCardActive]}
            onPress={() => action.onPress(navigation)}>
            <Text style={[styles.actionLabel, active && styles.actionLabelActive]}>{action.label}</Text>
            <Text style={[styles.actionSubtitle, active && styles.actionSubtitleActive]}>{action.subtitle}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  actionCard: {
    flexGrow: 1,
    flexBasis: '31%',
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 4,
  },
  actionCardActive: {
    backgroundColor: '#2a2313',
    borderColor: colors.primary,
  },
  actionLabel: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  actionLabelActive: {
    color: colors.primary,
  },
  actionSubtitle: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 16,
  },
  actionSubtitleActive: {
    color: colors.primarySoft,
  },
});