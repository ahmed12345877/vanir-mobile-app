import { Platform } from 'react-native';

const developmentLanHost = '192.168.0.71';

function buildDevelopmentUrl(port: number) {
  return `http://${developmentLanHost}:${port}`;
}

const developmentApiUrl = Platform.select({
  android: buildDevelopmentUrl(3000),
  ios: buildDevelopmentUrl(3000),
  default: buildDevelopmentUrl(3000),
});
const googleWebClientId: string =
  '1001729880037-9cuaiu287imvbp33jquv93dbv450nmud.apps.googleusercontent.com';

export const appConfig = {
  apiBaseUrl: __DEV__ ? developmentApiUrl ?? buildDevelopmentUrl(3000) : 'https://vanirgroup.com',
  travelApiBaseUrl: __DEV__ ? buildDevelopmentUrl(3001) : 'https://vanirgroup.com',
  companyWebsiteUrl: 'https://vanirgroup.com',
  firebase: {
    apiKey: 'AIzaSyAszyNw2a7_bv02cf0FBXiPXwt3E2-CXdY',
    authDomain: 'gen-lang-client-0364375301.firebaseapp.com',
    projectId: 'gen-lang-client-0364375301',
    storageBucket: 'gen-lang-client-0364375301.firebasestorage.app',
    messagingSenderId: '1001729880037',
    appId: '1:1001729880037:web:0cf4200a2a48e96547090c',
    measurementId: 'G-5ETHDXPS4L',
    googleWebClientId,
  },
} as const;

export const isGoogleSignInConfigured =
  appConfig.firebase.googleWebClientId !== 'REPLACE_WITH_FIREBASE_WEB_CLIENT_ID';
