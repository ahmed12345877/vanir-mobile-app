# Vanir Mobile

React Native mobile shell for the existing VANIR web platform.

## CI/CD (GitHub Actions)

This repository includes:

- `android-ci.yml`: Builds Android debug APK on push/PR.
- `firebase-distribution.yml`: Manual workflow to build Android release APK and upload it to Firebase App Distribution.

### Required GitHub Secrets

Add the following repository secrets in:
`Settings > Secrets and variables > Actions`

1. `FIREBASE_SERVICE_ACCOUNT_JSON`
   - Full JSON content of Firebase service account key.
2. `FIREBASE_APP_ID_ANDROID`
   - Firebase Android App ID (example: `1:1234567890:android:abcdef...`).

### Trigger Firebase distribution

Go to:
`Actions > Firebase App Distribution (Android) > Run workflow`
and optionally add release notes.

## Prerequisites

- Node.js `22.11.0` (see `.nvmrc`)
- npm `10+`
- JDK `17`
- Android SDK / Android Studio

### Use the project Node version

```bash
nvm use
node -v
```

If `nvm use` fails, install the version first:

```bash
nvm install 22.11.0
nvm use 22.11.0
```

## Firebase setup

This mobile app targets the same Firebase project already used by the web app:

- Project ID: `gen-lang-client-0364375301`
- Auth domain: `gen-lang-client-0364375301.firebaseapp.com`
- Storage bucket: `gen-lang-client-0364375301.firebasestorage.app`
- Messaging sender ID: `1001729880037`
- App ID: `1:1001729880037:web:0cf4200a2a48e96547090c`

Before running the app:

1. Download `google-services.json` for Android from the same Firebase project and place it at `android/app/google-services.json`.
2. Download `GoogleService-Info.plist` for iOS from the same Firebase project and place it in `ios/VanirMobile/GoogleService-Info.plist`.
3. Set the Google web client ID in `src/config/appConfig.ts` if you want mobile Google sign-in enabled.

## Install

Run from the repository root:

```bash
npm install
```

## Android Build Setup (macOS)

If Android Studio or Gradle cannot find Android SDK, complete this setup first.

### 1) Required versions

- Node.js: 22.11.0 or newer (project uses `.nvmrc` and `engines.node >= 22.11.0`)
- JDK: 17
- Android Studio with Android SDK installed

### 2) Use Node 22

```bash
nvm install 22.11.0
nvm use 22.11.0
node -v
```

### 3) Install and select JDK 17

```bash
brew install --cask temurin@17
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
java -version
```

### 4) Android SDK path

Default macOS SDK path is:

```text
$HOME/Library/Android/sdk
```

Project local SDK config is set in `android/local.properties`, which is local to each machine and should not be shared verbatim:

```properties
sdk.dir=/Users/<your-username>/Library/Android/sdk
```

If your SDK is installed elsewhere, update the path in `android/local.properties`.

### 5) Install required Android SDK packages

From Android Studio SDK Manager, make sure these are installed:

- Android SDK Platform 36
- Android SDK Build-Tools 36.0.0
- Android SDK Command-line Tools (latest)
- Android Emulator
- Android SDK Platform-Tools

### 6) Build clean + run

```bash
cd android
./gradlew clean
cd ..
npm install
npm run android
```

## Run

```bash
npm run android
npm run ios
```

## Android clean build checklist

If Android build fails, run this sequence from the repository root:

```bash
nvm use
node -v
npm install
cd android
./gradlew clean
./gradlew assembleDebug --stacktrace
```

## Local Travel Booking API

Flights and hotels now use a dedicated local travel booking backend on port `3001` during development.

Start it in a separate terminal:

```bash
npm run travel-api
```

If you are testing on a physical Android device, forward the port as well:

```bash
adb reverse tcp:3001 tcp:3001
```

Available development endpoints:

- `POST /api/mobile/flights/search`
- `POST /api/mobile/flights/book`
- `POST /api/mobile/hotels/search`
- `POST /api/mobile/hotels/book`
- `GET /health`
## API base URL

Development defaults are defined in `src/config/appConfig.ts`:

- Android/iOS development LAN API: `http://10.118.239.83:3000`
- Android/iOS development LAN travel API: `http://10.118.239.83:3001`
- Production: `https://vanirgroup.com`

Update these values if your backend is hosted elsewhere.

If the IP does not open from your phone browser, verify all of the following:

- Phone and laptop are on the same Wi-Fi network.
- Local API process is running (`npm run travel-api` for `3001`).
- The service binds to LAN, not only loopback.
- macOS Firewall is not blocking incoming Node.js connections.

### One-command LAN dev mode

If you do not want to edit the IP manually, use:

```bash
npm run dev:lan
```

This starts Metro and the local travel API using the current Wi-Fi IP automatically.

## Android release signing and AAB output

Release signing is configured in `android/app/build.gradle` and expects your private values from one of these sources:

- `android/keystore.properties` (recommended for local builds)
- Gradle properties
- Environment variables

Required keys:

- `VANIR_UPLOAD_STORE_FILE`
- `VANIR_UPLOAD_STORE_PASSWORD`
- `VANIR_UPLOAD_KEY_ALIAS`
- `VANIR_UPLOAD_KEY_PASSWORD`

### 1) Create local signing config

```bash
cp android/keystore.properties.example android/keystore.properties
```

Then edit `android/keystore.properties` with your real keystore path and passwords.

### 2) Generate a release keystore (once)

```bash
keytool -genkeypair -v \
   -storetype PKCS12 \
   -keystore android/app/vanir-release-key.keystore \
   -alias vanir-key \
   -keyalg RSA -keysize 2048 -validity 10000
```

### 3) Build Google Play bundle (AAB)

```bash
cd android
./gradlew :app:bundleRelease --console=plain
```

Output path:

- `android/app/build/outputs/bundle/release/app-release.aab`

If signing values are missing, Gradle intentionally fails fast with a clear error message.

## Legal and Google Play readiness

- Privacy policy draft: `PRIVACY_POLICY.md`
- Privacy policy (Arabic): `PRIVACY_POLICY.ar.md`
- Terms of service draft: `TERMS_OF_SERVICE.md`
- Terms of service (Arabic): `TERMS_OF_SERVICE.ar.md`
- Play release checklist: `docs/GOOGLE_PLAY_RELEASE_CHECKLIST.md`
- PR template draft: `docs/PR_DESCRIPTION.md`

These files are included to speed up Play Console compliance reviews and keep legal/content declarations synchronized with app behavior.
