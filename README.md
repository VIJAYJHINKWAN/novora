<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/2b1119c6-09b2-4529-9b1d-17865e303453

## Run Locally

**Prerequisites:**

- [Node.js](https://nodejs.org/) (LTS)
- [Android Studio](https://developer.android.com/studio) (for the Android SDK/emulator, and for local Android builds)
- The [Expo Go](https://expo.dev/go) app on your phone (only usable if the app has no custom native modules — see note below)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a file named `.env` in the project directory and set `GEMINI_API_KEY` in it to your Gemini API key (see `.env.example` for the expected format).

### 3. Run the app

This project uses `react-native-maps`, which is a custom native module **not supported by the plain Expo Go app**. You must run it through a development build instead of Expo Go.

**Option A — Local development build (requires Android Studio / SDK set up, and a connected device or emulator):**

```bash
npx expo run:android
```

This builds the dev client and installs it on the connected device/emulator automatically. After the first install, for subsequent runs you can just start the dev server:

```bash
npx expo start --dev-client
```

and reopen the app already installed on the device — it will connect automatically.

**Option B — Cloud build with EAS (no local Android SDK needed):**

```bash
npx eas build --profile development --platform android
```

Download and install the resulting APK on your phone, then run:

```bash
npx expo start --dev-client
```

and scan the QR code shown in the terminal using the camera app (this opens your installed dev-client build, not Expo Go).

### Troubleshooting

- **"Something went wrong" when scanning the QR code:** usually means the phone and computer aren't on the same Wi-Fi network (try `npx expo start --tunnel`), or you scanned with plain Expo Go instead of a dev-client build.
- **Stale bundler errors after upgrading packages:** clear the Metro cache with `npx expo start -c`.
- **Dependency/version mismatches:** run `npx expo install --check` to verify all packages match the installed Expo SDK version.
