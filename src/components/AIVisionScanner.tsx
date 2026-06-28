/**
 * AIVisionScanner — real-time camera component for the VANIR AI Vision mode.
 *
 * Uses react-native-vision-camera v5 (Nitro Modules architecture):
 *   - usePhotoOutput()        →  creates a CameraPhotoOutput for still capture
 *   - photoOutput.capturePhotoToFile()  →  returns PhotoFile { filePath }
 *   - FormData multipart POST →  uploads JPEG to /api/ai/vision
 *
 * AndroidManifest.xml must declare android.permission.CAMERA.
 */

import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  usePhotoOutput,
} from 'react-native-vision-camera';
import type { CameraRef } from 'react-native-vision-camera';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import { GlassCard } from './GlassCard';
import { GoldButton } from './GoldButton';
import { PremiumBadge } from './PremiumBadge';
import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';
import { apiUrl } from '../services/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface VisionResult {
  type: 'landmark' | 'translation' | 'general';
  title: string;
  content: string;
  confidence?: number;
}

interface AIVisionScannerProps {
  /**
   * Called after a successful Vision API response.
   * Receives a user-facing prompt string and the AI analysis string.
   * AIStudioScreen uses this to push both into the shared chat message list.
   */
  onAnalysis: (userPrompt: string, aiResult: string) => void;
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AIVisionScanner({ onAnalysis }: AIVisionScannerProps) {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const photoOutput = usePhotoOutput({ quality: 0.85 });

  const cameraRef = React.useRef<CameraRef>(null);

  const [isCapturing, setIsCapturing] = useState(false);
  const [lastResult, setLastResult] = useState<VisionResult | null>(null);
  const [captureError, setCaptureError] = useState<string | null>(null);

  // ── Permission gate ───────────────────────────────────────────────────────

  if (!hasPermission) {
    return <PermissionPrompt onRequest={requestPermission} />;
  }

  if (!device) {
    return (
      <View style={styles.centred}>
        <Text style={styles.infoText}>No rear camera detected on this device.</Text>
      </View>
    );
  }

  // ── Capture & analyse ─────────────────────────────────────────────────────

  const handleCapture = async () => {
    if (isCapturing) return;

    setIsCapturing(true);
    setCaptureError(null);
    setLastResult(null);

    analytics()
      .logEvent('ai_vision_capture_tapped', {})
      .catch(() => undefined);

    let filePath: string | null = null;

    try {
      const photoFile = await photoOutput.capturePhotoToFile({ flashMode: 'off' }, {});
      filePath = photoFile.filePath;
    } catch (err) {
      const e = err instanceof Error ? err : new Error('Camera capture failed');
      try { crashlytics().recordError(e, 'AIVisionScanner/capturePhotoToFile'); } catch { /* noop */ }
      setCaptureError('Failed to capture image. Please try again.');
      setIsCapturing(false);
      return;
    }

    try {
      // React Native FormData supports file URIs as Blob-like objects
      const form = new FormData();
      form.append('image', {
        uri: `file://${filePath}`,
        type: 'image/jpeg',
        name: 'vanir_vision_scan.jpg',
      } as unknown as Blob);

      const response = await fetch(apiUrl('/api/ai/vision'), {
        method: 'POST',
        body: form,
        credentials: 'include',
        // Do NOT set Content-Type manually — fetch sets the multipart boundary automatically
      });

      if (!response.ok) {
        const text = await response.text().catch(() => String(response.status));
        throw new Error(`Vision API ${response.status}: ${text}`);
      }

      const json = (await response.json()) as VisionResult;
      setLastResult(json);

      analytics()
        .logEvent('ai_vision_capture_success', {
          result_type: json.type,
          confidence: json.confidence ?? 0,
        })
        .catch(() => undefined);

      // Push the result into the shared messages list in AIStudioScreen
      onAnalysis(
        '📷 Image captured for analysis',
        `**${json.title}**\n\n${json.content}`,
      );
    } catch (err) {
      const e = err instanceof Error ? err : new Error('Vision API error');
      try { crashlytics().recordError(e, 'AIVisionScanner/apiCall'); } catch { /* noop */ }
      setCaptureError('Analysis failed. Please ensure you have a clear view and try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Live camera preview */}
      <View style={styles.previewWrapper}>
        <Camera
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive
          outputs={[photoOutput]}
        />

        {/* Art Deco viewfinder overlay */}
        <ViewfinderOverlay />

        {/* Scan label */}
        <View style={styles.scanLabel}>
          <Text style={styles.scanLabelText}>
            {isCapturing ? 'ANALYSING…' : 'TAP TO SCAN'}
          </Text>
        </View>

        {/* Capture button */}
        <View style={styles.captureRow}>
          <Pressable
            onPress={handleCapture}
            disabled={isCapturing}
            style={({ pressed }) => [
              styles.captureBtn,
              pressed && styles.captureBtnPressed,
              isCapturing && styles.captureBtnBusy,
            ]}>
            {isCapturing ? (
              <ActivityIndicator color={colors.textOnGold} size="small" />
            ) : (
              <Text style={styles.captureBtnIcon}>◉</Text>
            )}
          </Pressable>
        </View>
      </View>

      {/* Latest result card */}
      {lastResult && (
        <GlassCard goldBorder style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <PremiumBadge
              label={
                lastResult.type === 'landmark'
                  ? 'Landmark'
                  : lastResult.type === 'translation'
                  ? 'Translation'
                  : 'Analysis'
              }
              variant="gold"
            />
            {lastResult.confidence !== undefined && (
              <Text style={styles.confidenceText}>
                {Math.round(lastResult.confidence * 100)}% confidence
              </Text>
            )}
          </View>
          <Text style={styles.resultTitle}>{lastResult.title}</Text>
          <Text style={styles.resultContent}>{lastResult.content}</Text>
        </GlassCard>
      )}

      {/* Error state */}
      {captureError && (
        <GlassCard style={styles.errorCard}>
          <Text style={styles.errorText}>{captureError}</Text>
          <GoldButton
            label="Retry"
            variant="outline"
            size="sm"
            onPress={handleCapture}
            style={{ alignSelf: 'flex-end', marginTop: spacing[3] }}
          />
        </GlassCard>
      )}
    </View>
  );
}

// ─── Permission prompt ────────────────────────────────────────────────────────

function PermissionPrompt({ onRequest }: { onRequest: () => Promise<boolean> }) {
  const [requesting, setRequesting] = useState(false);

  const handleRequest = useCallback(async () => {
    setRequesting(true);
    await onRequest().catch(() => undefined);
    setRequesting(false);
  }, [onRequest]);

  return (
    <View style={styles.permContainer}>
      <GlassCard goldBorder style={styles.permCard}>
        <Text style={styles.permIcon}>◎</Text>
        <Text style={styles.permTitle}>CAMERA ACCESS REQUIRED</Text>
        <Text style={styles.permBody}>
          VANIR Vision needs camera access to identify landmarks and translate
          text in real time. Your images are processed securely and never stored.
        </Text>
        <GoldButton
          label="Grant Camera Access"
          onPress={handleRequest}
          loading={requesting}
          fullWidth
        />
      </GlassCard>
    </View>
  );
}

// ─── Viewfinder overlay ───────────────────────────────────────────────────────

function ViewfinderOverlay() {
  const gold = colors.primary;
  return (
    <View style={vf.overlay} pointerEvents="none">
      {/* Art Deco corner brackets */}
      <View style={[vf.corner, vf.tl, { borderColor: gold }]} />
      <View style={[vf.corner, vf.tr, { borderColor: gold }]} />
      <View style={[vf.corner, vf.bl, { borderColor: gold }]} />
      <View style={[vf.corner, vf.br, { borderColor: gold }]} />
      {/* Center crosshair */}
      <View style={vf.cross}>
        <View style={[vf.crossH, { backgroundColor: gold }]} />
        <View style={[vf.crossV, { backgroundColor: gold }]} />
      </View>
    </View>
  );
}

const CORNER = 22;
const THICKNESS = 2;

const vf = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: CORNER,
    height: CORNER,
    borderWidth: THICKNESS,
    backgroundColor: 'transparent',
  },
  tl: { top: spacing[5], left: spacing[5], borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 4 },
  tr: { top: spacing[5], right: spacing[5], borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 4 },
  bl: { bottom: spacing[16], left: spacing[5], borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 4 },
  br: { bottom: spacing[16], right: spacing[5], borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 4 },
  cross: { width: 20, height: 20, justifyContent: 'center', alignItems: 'center', opacity: 0.5 },
  crossH: { position: 'absolute', width: 14, height: 1 },
  crossV: { position: 'absolute', width: 1, height: 14 },
});

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  centred: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[6],
  },
  infoText: { fontSize: 14, color: colors.textMuted, textAlign: 'center' },

  // Camera preview
  previewWrapper: {
    height: 270,
    backgroundColor: colors.backgroundDeep,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    marginHorizontal: spacing[4],
    marginTop: spacing[3],
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    position: 'relative',
  },

  // Scan label
  scanLabel: {
    position: 'absolute',
    top: spacing[3],
    alignSelf: 'center',
    backgroundColor: 'rgba(8,8,16,0.72)',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[1],
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  scanLabelText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 2.5,
  },

  // Capture button
  captureRow: {
    position: 'absolute',
    bottom: spacing[4],
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureBtn: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.primaryLight,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 14,
    elevation: 14,
  },
  captureBtnPressed: { opacity: 0.78, transform: [{ scale: 0.95 }] },
  captureBtnBusy: { opacity: 0.5 },
  captureBtnIcon: { fontSize: 26, color: colors.textOnGold, fontWeight: '700' },

  // Result card
  resultCard: {
    margin: spacing[4],
    marginTop: spacing[3],
    gap: spacing[2],
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confidenceText: { fontSize: 11, color: colors.textMuted },
  resultTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 0.2,
  },
  resultContent: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  // Error card
  errorCard: { margin: spacing[4], marginTop: spacing[3] },
  errorText: { fontSize: 14, color: colors.danger, lineHeight: 20 },

  // Permission prompt
  permContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing[6],
  },
  permCard: { gap: spacing[4], alignItems: 'center' },
  permIcon: { fontSize: 48, color: colors.primary },
  permTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: 2,
    textAlign: 'center',
  },
  permBody: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
  },
});
