// Firebase native modules cannot run in a plain Node/Jest environment.
// These manual mocks satisfy imports without loading any native code.

jest.mock('@react-native-firebase/app', () => ({
  default: {
    apps: [],
    initializeApp: jest.fn(),
  },
}));

jest.mock('@react-native-firebase/auth', () => () => ({
  currentUser: null,
  onAuthStateChanged: jest.fn(cb => {
    cb(null);
    return jest.fn();
  }),
  signInWithCredential: jest.fn().mockResolvedValue({ user: { uid: 'test-uid' } }),
  signOut: jest.fn().mockResolvedValue(undefined),
  createUserWithEmailAndPassword: jest.fn().mockResolvedValue({ user: { uid: 'test-uid' } }),
  signInWithEmailAndPassword: jest.fn().mockResolvedValue({ user: { uid: 'test-uid' } }),
}));

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn().mockResolvedValue(true),
    signIn: jest.fn().mockResolvedValue({ idToken: 'mock-id-token' }),
    signOut: jest.fn().mockResolvedValue(undefined),
    isSignedIn: jest.fn().mockReturnValue(false),
    getTokens: jest.fn().mockResolvedValue({ idToken: 'mock-id-token', accessToken: 'mock-access-token' }),
  },
  statusCodes: {
    SIGN_IN_CANCELLED: '12',
    IN_PROGRESS: '10',
    PLAY_SERVICES_NOT_AVAILABLE: '9',
  },
}));
