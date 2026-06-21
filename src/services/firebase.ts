import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { appConfig, isGoogleSignInConfigured } from '../config/appConfig';
import { postJson } from './api';

let googleConfigured = false;

function configureGoogleSignin() {
  if (googleConfigured) {
    return;
  }

  if (!isGoogleSignInConfigured) {
    return;
  }

  GoogleSignin.configure({
    webClientId: appConfig.firebase.googleWebClientId,
    offlineAccess: false,
  });

  googleConfigured = true;
}

async function syncServerSession(user: FirebaseAuthTypes.User) {
  const idToken = await user.getIdToken();
  await postJson('/api/auth/user-login', { idToken });
}

export const firebaseProjectConfig = appConfig.firebase;

export const firebaseAuth = auth;

export async function signInWithEmail(email: string, password: string) {
  const credential = await auth().signInWithEmailAndPassword(email.trim(), password);
  await syncServerSession(credential.user);
  return credential.user;
}

export async function signUpWithEmail(
  email: string,
  password: string,
  displayName?: string,
) {
  const credential = await auth().createUserWithEmailAndPassword(email.trim(), password);

  if (displayName?.trim()) {
    await credential.user.updateProfile({ displayName: displayName.trim() });
  }

  await syncServerSession(credential.user);
  return credential.user;
}

export async function signInWithGoogle() {
  configureGoogleSignin();

  if (!isGoogleSignInConfigured) {
    throw new Error('Set firebase.googleWebClientId in src/config/appConfig.ts to enable Google sign-in.');
  }

  await GoogleSignin.hasPlayServices();
  const result = (await GoogleSignin.signIn()) as { data?: { idToken?: string }; idToken?: string };
  const idToken = result.data?.idToken ?? result.idToken;

  if (!idToken) {
    throw new Error('Google sign-in did not return an ID token.');
  }

  const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  const credential = await auth().signInWithCredential(googleCredential);
  await syncServerSession(credential.user);
  return credential.user;
}

export async function restoreServerSession(user: FirebaseAuthTypes.User) {
  await syncServerSession(user);
}

export async function signOutEverywhere() {
  await GoogleSignin.signOut().catch(() => undefined);
  await auth().signOut();
}
