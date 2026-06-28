import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import { postJson } from '../services/api';

export type PermissionStatus = 'granted' | 'denied' | 'undetermined';

export interface PushNotificationState {
  fcmToken: string | null;
  permissionStatus: PermissionStatus;
  isRegistering: boolean;
  error: string | null;
}

export interface RemoteMessage {
  messageId?: string;
  notification?: {
    title?: string;
    body?: string;
  };
  data?: Record<string, string>;
}

/** Persists the FCM device token to the backend so the server can target this device. */
async function syncTokenToServer(token: string): Promise<void> {
  await postJson('/api/notifications/register-device', { fcmToken: token });
}

/** Resolves the current FCM permission status without prompting the user. */
async function resolveCurrentPermission(): Promise<PermissionStatus> {
  const status = await messaging().hasPermission();
  if (status === messaging.AuthorizationStatus.AUTHORIZED) return 'granted';
  if (status === messaging.AuthorizationStatus.PROVISIONAL) return 'granted';
  if (status === messaging.AuthorizationStatus.DENIED) return 'denied';
  return 'undetermined';
}

/**
 * Requests FCM push notification permission, retrieves the device token, keeps
 * it refreshed, and syncs it to the Vanir Group backend for targeted delivery.
 *
 * Usage: call this once inside a component that is mounted after the user signs
 * in (e.g. the authenticated shell). The returned `fcmToken` can also be saved
 * into the Supabase `users` table directly from the returned state if you
 * prefer bypassing the backend REST call.
 *
 * @param autoRequest - When true (default) the hook immediately requests
 *   permission when it mounts. Pass `false` to defer until you call
 *   `requestPermission()` explicitly (e.g. after showing a rationale modal).
 */
export function usePushNotifications(autoRequest = true): PushNotificationState & {
  requestPermission: () => Promise<void>;
} {
  const [state, setState] = useState<PushNotificationState>({
    fcmToken: null,
    permissionStatus: 'undetermined',
    isRegistering: false,
    error: null,
  });

  const appState = useRef<AppStateStatus>(AppState.currentState);
  const tokenRefreshUnsubscribe = useRef<(() => void) | null>(null);
  const foregroundUnsubscribe = useRef<(() => void) | null>(null);
  const registeredToken = useRef<string | null>(null);

  const registerToken = useCallback(async (token: string) => {
    if (registeredToken.current === token) return;
    registeredToken.current = token;
    setState(s => ({ ...s, fcmToken: token }));
    try {
      await syncTokenToServer(token);
    } catch {
      // Non-fatal — token is still available locally; server sync will retry
      // next time the hook mounts or the token rotates.
    }
  }, []);

  const requestPermission = useCallback(async () => {
    setState(s => ({ ...s, isRegistering: true, error: null }));

    try {
      // On Android < 13 this is a no-op and always returns AUTHORIZED.
      const authStatus = await messaging().requestPermission({
        sound: true,
        announcement: true,
        badge: true,
        alert: true,
      });

      const granted =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!granted) {
        setState(s => ({
          ...s,
          permissionStatus: 'denied',
          isRegistering: false,
        }));
        return;
      }

      setState(s => ({ ...s, permissionStatus: 'granted' }));

      // Android devices require the app to explicitly call getToken() after
      // permission is granted; iOS tokens are available immediately.
      const token = await messaging().getToken();
      await registerToken(token);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to register for push notifications.';
      setState(s => ({ ...s, error: message }));
    } finally {
      setState(s => ({ ...s, isRegistering: false }));
    }
  }, [registerToken]);

  // Subscribe to foreground messages so the app can display an in-app banner
  // (the OS suppresses the notification shade when the app is active).
  const handleForegroundMessage = useCallback(
    (message: FirebaseMessagingTypes.RemoteMessage) => {
      // Consumers can extend this hook or use a global event emitter to surface
      // the message in the UI. Intentionally kept side-effect free here.
      void message;
    },
    [],
  );

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      const current = await resolveCurrentPermission();

      if (cancelled) return;

      setState(s => ({ ...s, permissionStatus: current }));

      if (current === 'granted') {
        // Already authorized — fetch the current token immediately.
        const token = await messaging().getToken();
        if (!cancelled) await registerToken(token);
      } else if (autoRequest) {
        await requestPermission();
      }
    };

    void init();

    // Refresh token whenever FCM rotates it (e.g. after app restore).
    tokenRefreshUnsubscribe.current = messaging().onTokenRefresh(async newToken => {
      await registerToken(newToken);
    });

    // Listen for foreground messages.
    foregroundUnsubscribe.current = messaging().onMessage(handleForegroundMessage);

    // Re-check permission when the user returns to the app from Settings.
    const appStateSub = AppState.addEventListener('change', async next => {
      if (appState.current.match(/inactive|background/) && next === 'active') {
        const refreshed = await resolveCurrentPermission();
        setState(s => ({ ...s, permissionStatus: refreshed }));
      }
      appState.current = next;
    });

    return () => {
      cancelled = true;
      tokenRefreshUnsubscribe.current?.();
      foregroundUnsubscribe.current?.();
      appStateSub.remove();
    };
  }, [autoRequest, handleForegroundMessage, registerToken, requestPermission]);

  // iOS requires the app to register background handlers at the module level
  // (outside React). Wire this up in index.js with:
  //   messaging().setBackgroundMessageHandler(async msg => { ... });

  return { ...state, requestPermission };
}

/**
 * Call this once at app startup (before the React tree mounts) so FCM can
 * deliver notification-opened events to the app even when it was killed.
 *
 * Place in index.js:
 *   import { registerBackgroundMessageHandler } from './src/hooks/usePushNotifications';
 *   registerBackgroundMessageHandler();
 */
export function registerBackgroundMessageHandler(): void {
  messaging().setBackgroundMessageHandler(async (_message: FirebaseMessagingTypes.RemoteMessage) => {
    // Background messages are handled silently — the OS displays the
    // notification from the `notification` payload automatically.
    // Add any custom data-only message handling here.
  });

  // Android: handle notification tap when app was completely killed.
  messaging()
    .getInitialNotification()
    .then((remoteMessage: FirebaseMessagingTypes.RemoteMessage | null) => {
      if (remoteMessage) {
        // Navigate to a deep link based on remoteMessage.data if needed.
        void remoteMessage;
      }
    });
}

// Re-export the RemoteMessage type for consumers.
export type { FirebaseMessagingTypes };
