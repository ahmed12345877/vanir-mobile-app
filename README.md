# Vanir Mobile

React Native mobile shell for the existing VANIR web platform.

## What is included

- React Native app scaffold for Android and iOS
- React Navigation tab + stack setup
- Firebase Auth wiring with React Native Firebase
- Session sync against the existing Node/Firebase backend
- Core mobile screens for home, gallery, offers, blog, booking, reviews, and profile
- Shared tRPC + React Query client for the current backend

## Firebase setup

This mobile app targets the same Firebase project already used by the web app:

- Project ID: `gen-lang-client-0364375301`
- Auth domain: `gen-lang-client-0364375301.firebaseapp.com`
- Storage bucket: `gen-lang-client-0364375301.firebasestorage.app`
- Messaging sender ID: `1001729880037`
- App ID: `1:1001729880037:web:0cf4200a2a48e96547090c`

Before running the app:

1. Download `google-services.json` for Android from the same Firebase project and place it at `mobile/android/app/google-services.json`.
2. Download `GoogleService-Info.plist` for iOS from the same Firebase project and place it in `mobile/ios/VanirMobile/GoogleService-Info.plist`.
3. Set the Google web client ID in `src/config/appConfig.ts` if you want mobile Google sign-in enabled.

## Install

```bash
cd mobile
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
/Users/zaad_1/Library/Android/sdk
```

Project local SDK config is set in `android/local.properties`:

```properties
sdk.dir=/Users/zaad_1/Library/Android/sdk
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

## API base URL

Development defaults are defined in `src/config/appConfig.ts`:

- Android emulator: `http://10.0.2.2:3000`
- iOS simulator: `http://localhost:3000`
- Production: `https://vanirgroup.com`

Update these values if your backend is hosted elsewhere.
