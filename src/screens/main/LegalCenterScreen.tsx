import React from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen, SectionCard, screenStyles } from '../../components/Screen';
import { companyContent } from '../../content/companyContent';
import { colors } from '../../theme/colors';

function openLink(url: string) {
  Linking.openURL(url).catch(() => undefined);
}

export function LegalCenterScreen() {
  return (
    <Screen
      title="Legal center"
      subtitle="Terms, privacy, account deletion, and Play compliance references in one place.">
      <SectionCard>
        <Text style={screenStyles.sectionTitle}>Policy documents</Text>
        <Text style={screenStyles.body}>Review the latest legal policies. This section helps users and Play reviewers find policy links quickly.</Text>
        <View style={styles.actions}>
          <Pressable style={styles.button} onPress={() => openLink(companyContent.contact.termsOfService)}>
            <Text style={styles.buttonText}>Open Terms of Service</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={() => openLink(companyContent.contact.privacyPolicy)}>
            <Text style={styles.buttonText}>Open Privacy Policy</Text>
          </Pressable>
        </View>
      </SectionCard>

      <SectionCard>
        <Text style={screenStyles.sectionTitle}>Account controls</Text>
        <Text style={screenStyles.body}>Users can request account deletion directly through support email.</Text>
        <Pressable style={styles.button} onPress={() => openLink(`mailto:${companyContent.contact.email}?subject=Delete%20My%20Account`)}>
          <Text style={styles.buttonText}>Request Account Deletion</Text>
        </Pressable>
      </SectionCard>

      <SectionCard>
        <Text style={screenStyles.sectionTitle}>Language support</Text>
        <Text style={screenStyles.body}>English and Arabic legal documents are maintained in the repository for consistency with store listings and customer support.</Text>
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: 10,
  },
  button: {
    marginTop: 8,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
    backgroundColor: colors.surfaceAlt,
  },
  buttonText: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
});