import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import DocumentPicker, { isCancel, types } from 'react-native-document-picker';
import { SupportActionStrip } from '../../components/SupportActionStrip';
import { Screen, SectionCard, screenStyles } from '../../components/Screen';
import { companyContent } from '../../content/companyContent';
import {
  checkoutTravelEssentials,
  getTravelEssentials,
  uploadVisaDocument,
  type TravelEssentialCategory,
  type TravelEssentialItem,
} from '../../services/travelBooking';
import { colors } from '../../theme/colors';

const categories: Array<TravelEssentialCategory | 'All'> = ['All', 'Visa', 'eSIM', 'Insurance'];

export function TravelEssentialsScreen() {
  const [selectedCategory, setSelectedCategory] = useState<TravelEssentialCategory | 'All'>('All');
  const [selectedItemId, setSelectedItemId] = useState(companyContent.travelEssentials[0]?.id ?? '');
  const [items, setItems] = useState<TravelEssentialItem[]>(companyContent.travelEssentials.map(item => ({ ...item, highlights: [...item.highlights] })));
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [travelerName, setTravelerName] = useState('');
  const [email, setEmail] = useState('');
  const [countryOfResidence, setCountryOfResidence] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [passportExpiry, setPassportExpiry] = useState('');
  const [visaSelectedFiles, setVisaSelectedFiles] = useState<Array<{ uri: string; name: string; type: string | null }>>([]);
  const [visaUploadedFiles, setVisaUploadedFiles] = useState<Array<{ fileId: string; fileName: string; fileSize: number }>>([]);
  const [isUploadingVisaFiles, setIsUploadingVisaFiles] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [activationDevice, setActivationDevice] = useState('iPhone / Android');
  const [destination, setDestination] = useState('Egypt');
  const [coverageStart, setCoverageStart] = useState('');
  const [coverageEnd, setCoverageEnd] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setIsLoading(true);
        const response = await getTravelEssentials(selectedCategory === 'All' ? undefined : selectedCategory);
        if (!cancelled) {
          setItems(response);
          setSelectedItemId(current => current || response[0]?.id || '');
        }
      } catch (error) {
        if (!cancelled) {
          Alert.alert('Travel essentials unavailable', error instanceof Error ? error.message : 'Please try again.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [selectedCategory]);

  const groupedCount = useMemo(() => ({
    Visa: items.filter(item => item.category === 'Visa').length,
    eSIM: items.filter(item => item.category === 'eSIM').length,
    Insurance: items.filter(item => item.category === 'Insurance').length,
  }), [items]);

  const selectedItem = items.find(item => item.id === selectedItemId) ?? items[0];

  function resetFormForCategory(category: TravelEssentialCategory | undefined) {
    if (category === 'Visa') {
      setPhoneNumber('');
      setActivationDevice('iPhone / Android');
      setDestination('Egypt');
    }
    if (category === 'eSIM') {
      setCountryOfResidence('');
      setPassportNumber('');
      setPassportExpiry('');
      setDestination('Egypt');
    }
    if (category === 'Insurance') {
      setActivationDevice('iPhone / Android');
      setPhoneNumber('');
    }
  }

  async function handleCheckout() {
    if (!selectedItem) {
      Alert.alert('Select a service', 'Pick Visa, eSIM, or Insurance first.');
      return;
    }

    try {
      setIsCheckingOut(true);

      if (selectedItem.category === 'Visa' && visaUploadedFiles.length === 0) {
        throw new Error('Upload at least one visa document before checkout.');
      }

      const response = await checkoutTravelEssentials({
        category: selectedItem.category,
        itemId: selectedItem.id,
        travelerName,
        email,
        countryOfResidence,
        passportNumber,
        passportExpiry,
        uploadedDocumentIds: visaUploadedFiles.map(file => file.fileId),
        phoneNumber,
        activationDevice,
        destination,
        coverageStart,
        coverageEnd,
        emergencyContact,
        notes,
      });

      const message = [
        `Confirmation: ${response.confirmationCode}`,
        response.visaCaseNumber ? `Visa case: ${response.visaCaseNumber}` : null,
        response.activationCode ? `eSIM activation: ${response.activationCode}` : null,
        response.policyNumber ? `Policy number: ${response.policyNumber}` : null,
      ].filter(Boolean).join('\n');

      Alert.alert('Travel essential purchased', message);
    } catch (error) {
      Alert.alert('Checkout failed', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  }

  async function handlePickVisaFiles() {
    try {
      const picked = await DocumentPicker.pick({
        type: [types.images, types.pdf],
        allowMultiSelection: true,
      });

      const normalized = picked.map(file => ({
        uri: file.uri,
        name: file.name ?? 'visa-document',
        type: file.type ?? null,
      }));

      setVisaSelectedFiles(current => [...current, ...normalized]);
    } catch (error) {
      if (isCancel(error)) {
        return;
      }
      Alert.alert('Document picker error', error instanceof Error ? error.message : 'Unable to pick files.');
    }
  }

  async function handleUploadVisaFiles() {
    if (visaSelectedFiles.length === 0) {
      Alert.alert('No files selected', 'Pick visa files first.');
      return;
    }

    try {
      setIsUploadingVisaFiles(true);
      const uploads: Array<{ fileId: string; fileName: string; fileSize: number }> = [];
      for (const file of visaSelectedFiles) {
        const response = await uploadVisaDocument(file);
        uploads.push({ fileId: response.fileId, fileName: response.fileName, fileSize: response.fileSize });
      }
      setVisaUploadedFiles(current => [...current, ...uploads]);
      setVisaSelectedFiles([]);
      Alert.alert('Upload complete', `${uploads.length} visa file(s) uploaded.`);
    } catch (error) {
      Alert.alert('Upload failed', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setIsUploadingVisaFiles(false);
    }
  }

  return (
    <Screen title="Travel essentials" subtitle="Organized extras for visa support, eSIM activation, and travel insurance inside the same app flow." actions={<SupportActionStrip focus="contact" />}>
      <SectionCard>
        <Text style={screenStyles.sectionTitle}>Before you fly</Text>
        <Text style={screenStyles.body}>These essentials are organized as booking-adjacent services so the user can complete paperwork, connectivity, and protection before departure.</Text>
        <View style={styles.metricsRow}>
          <Metric label="Visa" value={groupedCount.Visa} />
          <Metric label="eSIM" value={groupedCount.eSIM} />
          <Metric label="Insurance" value={groupedCount.Insurance} />
        </View>
      </SectionCard>

      <View style={styles.filterRow}>
        {categories.map(category => (
          <Pressable key={category} style={[styles.filterChip, selectedCategory === category && styles.filterChipActive]} onPress={() => { setSelectedCategory(category); resetFormForCategory(category === 'All' ? undefined : category); }}>
            <Text style={[styles.filterText, selectedCategory === category && styles.filterTextActive]}>{category}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.stack}>
        {items.map(item => (
          <Pressable key={item.id} onPress={() => { setSelectedItemId(item.id); setSelectedCategory(item.category); resetFormForCategory(item.category); }}>
          <SectionCard>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <Text style={screenStyles.label}>{item.category}</Text>
            <Text style={screenStyles.sectionTitle}>{item.title}</Text>
            <Text style={styles.provider}>{item.provider}</Text>
            <Text style={screenStyles.body}>{item.summary}</Text>
            <Text style={styles.price}>{item.price}</Text>
            <View style={styles.highlightsRow}>
              {item.highlights.map(highlight => (
                <View key={highlight} style={styles.highlightChip}>
                  <Text style={styles.highlightText}>{highlight}</Text>
                </View>
              ))}
            </View>
          </SectionCard>
          </Pressable>
        ))}
      </View>

      {selectedItem ? (
        <SectionCard>
          <Text style={screenStyles.sectionTitle}>Checkout & activation</Text>
          <Text style={screenStyles.body}>Selected: {selectedItem.title}</Text>
          <TextInput style={styles.input} value={travelerName} onChangeText={setTravelerName} placeholder="Traveler name" placeholderTextColor={colors.textMuted} />
          <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email address" placeholderTextColor={colors.textMuted} autoCapitalize="none" keyboardType="email-address" />

          {selectedItem.category === 'Visa' ? (
            <>
              <TextInput style={styles.input} value={countryOfResidence} onChangeText={setCountryOfResidence} placeholder="Country of residence" placeholderTextColor={colors.textMuted} />
              <TextInput style={styles.input} value={passportNumber} onChangeText={setPassportNumber} placeholder="Passport number" placeholderTextColor={colors.textMuted} />
              <TextInput style={styles.input} value={passportExpiry} onChangeText={setPassportExpiry} placeholder="Passport expiry date" placeholderTextColor={colors.textMuted} />

              <View style={styles.uploadCard}>
                <Text style={styles.uploadTitle}>Visa documents</Text>
                <Text style={styles.uploadSubtitle}>Select passport scans or supporting PDFs, then upload them before checkout.</Text>

                <View style={styles.uploadActionsRow}>
                  <Pressable style={[styles.secondaryButton, styles.flexButton]} onPress={handlePickVisaFiles}>
                    <Text style={styles.secondaryButtonText}>Pick files</Text>
                  </Pressable>
                  <Pressable style={[styles.secondaryButton, styles.flexButton]} onPress={handleUploadVisaFiles} disabled={isUploadingVisaFiles}>
                    <Text style={styles.secondaryButtonText}>{isUploadingVisaFiles ? 'Uploading...' : 'Upload files'}</Text>
                  </Pressable>
                </View>

                {visaSelectedFiles.length > 0 ? (
                  <View style={styles.fileList}>
                    {visaSelectedFiles.map(file => (
                      <Text key={`${file.uri}-${file.name}`} style={styles.fileLine}>Pending: {file.name}</Text>
                    ))}
                  </View>
                ) : null}

                {visaUploadedFiles.length > 0 ? (
                  <View style={styles.fileList}>
                    {visaUploadedFiles.map(file => (
                      <Text key={file.fileId} style={styles.fileLine}>Uploaded: {file.fileName} ({Math.max(1, Math.round(file.fileSize / 1024))} KB)</Text>
                    ))}
                  </View>
                ) : null}
              </View>
            </>
          ) : null}

          {selectedItem.category === 'eSIM' ? (
            <>
              <TextInput style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} placeholder="Phone number" placeholderTextColor={colors.textMuted} keyboardType="phone-pad" />
              <TextInput style={styles.input} value={activationDevice} onChangeText={setActivationDevice} placeholder="Device name" placeholderTextColor={colors.textMuted} />
              <TextInput style={styles.input} value={destination} onChangeText={setDestination} placeholder="Destination country" placeholderTextColor={colors.textMuted} />
              <TextInput style={[styles.input, styles.textArea]} value={notes} onChangeText={setNotes} placeholder="Activation notes" placeholderTextColor={colors.textMuted} multiline />
            </>
          ) : null}

          {selectedItem.category === 'Insurance' ? (
            <>
              <TextInput style={styles.input} value={destination} onChangeText={setDestination} placeholder="Destination" placeholderTextColor={colors.textMuted} />
              <View style={styles.dualRow}>
                <TextInput style={[styles.input, styles.dualInput]} value={coverageStart} onChangeText={setCoverageStart} placeholder="Coverage start" placeholderTextColor={colors.textMuted} />
                <TextInput style={[styles.input, styles.dualInput]} value={coverageEnd} onChangeText={setCoverageEnd} placeholder="Coverage end" placeholderTextColor={colors.textMuted} />
              </View>
              <TextInput style={styles.input} value={emergencyContact} onChangeText={setEmergencyContact} placeholder="Emergency contact" placeholderTextColor={colors.textMuted} />
              <TextInput style={[styles.input, styles.textArea]} value={notes} onChangeText={setNotes} placeholder="Medical / baggage / cancellation notes" placeholderTextColor={colors.textMuted} multiline />
            </>
          ) : null}

          <Pressable style={styles.button} onPress={handleCheckout} disabled={isCheckingOut}>
            <Text style={styles.buttonText}>{isCheckingOut ? 'Processing...' : selectedItem.category === 'eSIM' ? 'Activate eSIM' : 'Checkout now'}</Text>
          </Pressable>
        </SectionCard>
      ) : null}

      {isLoading ? <Text style={styles.loadingText}>Refreshing essentials…</Text> : null}
    </Screen>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  metricsRow: { flexDirection: 'row', gap: 10 },
  metricCard: { flex: 1, backgroundColor: colors.surfaceAlt, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 12 },
  metricValue: { color: colors.primary, fontSize: 22, fontWeight: '700' },
  metricLabel: { color: colors.textSecondary, fontSize: 12 },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  filterChip: { borderWidth: 1, borderColor: colors.border, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: colors.surfaceAlt },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { color: colors.textSecondary, fontWeight: '600' },
  filterTextActive: { color: colors.background },
  stack: { gap: 12 },
  image: { width: '100%', height: 200, borderRadius: 18 },
  provider: { color: colors.primarySoft, fontWeight: '600' },
  price: { color: colors.primary, fontSize: 16, fontWeight: '700' },
  input: { backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border, borderRadius: 12, color: colors.textPrimary, paddingHorizontal: 14, paddingVertical: 12 },
  dualRow: { flexDirection: 'row', gap: 10 },
  dualInput: { flex: 1 },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  button: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 14 },
  buttonText: { color: colors.background, fontWeight: '700' },
  uploadCard: { backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 12, gap: 10 },
  uploadTitle: { color: colors.textPrimary, fontWeight: '700' },
  uploadSubtitle: { color: colors.textSecondary, fontSize: 12, lineHeight: 18 },
  uploadActionsRow: { flexDirection: 'row', gap: 10 },
  flexButton: { flex: 1 },
  secondaryButton: { alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingVertical: 10, backgroundColor: colors.background },
  secondaryButtonText: { color: colors.textPrimary, fontWeight: '600' },
  fileList: { gap: 6 },
  fileLine: { color: colors.textSecondary, fontSize: 12 },
  highlightsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  highlightChip: { borderRadius: 999, backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 12, paddingVertical: 8 },
  highlightText: { color: colors.textSecondary, fontSize: 12 },
  loadingText: { color: colors.textMuted, textAlign: 'center' },
});