import React, { useMemo, useState } from 'react';
import { Alert, Linking, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { Screen, SectionCard, screenStyles } from '../../components/Screen';
import { SupportActionStrip } from '../../components/SupportActionStrip';
import { companyContent } from '../../content/companyContent';
import type { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';

export function ContactScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'Contact'>>();
  const initialChannel = route.params?.channel ?? 'booking';
  const [channel, setChannel] = useState(initialChannel);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const presetMessage = useMemo(() => {
    const channelLabel = channel === 'whatsapp' ? 'WhatsApp' : channel === 'call' ? 'call' : channel === 'email' ? 'email' : 'booking';
    return `Hi VANIR GROUP, I would like help via ${channelLabel}.`;
  }, [channel]);

  async function openWhatsApp() {
    const url = `https://wa.me/${companyContent.contact.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message || presetMessage)}`;
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      Alert.alert('WhatsApp unavailable', 'Please install WhatsApp or contact us by phone/email.');
      return;
    }
    await Linking.openURL(url);
  }

  async function callDesk() {
    const url = `tel:${companyContent.contact.phone}`;
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      Alert.alert('Calling unavailable', companyContent.contact.phone);
      return;
    }
    await Linking.openURL(url);
  }

  async function sendEmail() {
    const subject = encodeURIComponent('VANIR travel request');
    const body = encodeURIComponent(message || presetMessage);
    const url = `mailto:${companyContent.contact.email}?subject=${subject}&body=${body}`;
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      Alert.alert('Email unavailable', companyContent.contact.email);
      return;
    }
    await Linking.openURL(url);
  }

  return (
    <Screen
      title="Travel desk"
      subtitle="Keep booking, questions, and messaging inside the app until you choose the final contact action."
      actions={<SupportActionStrip focus={channel === 'whatsapp' ? 'whatsapp' : channel === 'booking' ? 'book' : 'contact'} />}>
      <SectionCard>
        <Text style={screenStyles.label}>Fast support</Text>
        <Text style={screenStyles.sectionTitle}>Choose how you want VANIR to respond</Text>
        <View style={styles.channelRow}>
          {[
            { key: 'booking', label: 'Booking help' },
            { key: 'call', label: 'Call me back' },
            { key: 'whatsapp', label: 'WhatsApp' },
            { key: 'email', label: 'Email reply' },
          ].map(option => (
            <Pressable
              key={option.key}
              style={[styles.channelChip, channel === option.key && styles.channelChipActive]}
              onPress={() => setChannel(option.key as typeof channel)}>
              <Text style={[styles.channelText, channel === option.key && styles.channelTextActive]}>{option.label}</Text>
            </Pressable>
          ))}
        </View>
      </SectionCard>

      <SectionCard>
        <Text style={screenStyles.sectionTitle}>Send a request</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Your name" placeholderTextColor={colors.textMuted} />
        <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email address" placeholderTextColor={colors.textMuted} autoCapitalize="none" keyboardType="email-address" />
        <TextInput
          style={[styles.input, styles.textArea]}
          value={message}
          onChangeText={setMessage}
          placeholder={presetMessage}
          placeholderTextColor={colors.textMuted}
          multiline
        />
        <Pressable
          style={styles.primaryButton}
          onPress={() => Alert.alert('Request prepared', 'Use WhatsApp, call, or email below to finish the request.')}>
          <Text style={styles.primaryButtonText}>Prepare request</Text>
        </Pressable>
      </SectionCard>

      <SectionCard>
        <Text style={screenStyles.sectionTitle}>Direct contact</Text>
        <Text style={screenStyles.body}>{companyContent.contact.address}</Text>
        <Text style={screenStyles.body}>{companyContent.contact.email}</Text>
        <Text style={screenStyles.body}>{companyContent.contact.phone}</Text>
        <View style={styles.contactActions}>
          <Pressable style={styles.secondaryButton} onPress={callDesk}>
            <Text style={styles.secondaryButtonText}>Call</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={openWhatsApp}>
            <Text style={styles.secondaryButtonText}>WhatsApp</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={sendEmail}>
            <Text style={styles.secondaryButtonText}>Email</Text>
          </Pressable>
        </View>
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  channelRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  channelChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.surfaceAlt,
  },
  channelChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  channelText: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  channelTextActive: {
    color: colors.background,
  },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    color: colors.textPrimary,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
  },
  primaryButtonText: {
    color: colors.background,
    fontWeight: '700',
  },
  contactActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  secondaryButton: {
    flexGrow: 1,
    flexBasis: '30%',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
    backgroundColor: colors.surfaceAlt,
  },
  secondaryButtonText: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
});