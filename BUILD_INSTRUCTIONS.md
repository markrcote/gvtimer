# Build Instructions for GVTimer

This document provides detailed instructions for building and deploying the GVTimer Flutter app on both Android and iOS platforms.

## Prerequisites Setup

### 1. Install Flutter

#### Windows
```bash
# Download Flutter SDK
# Extract to C:\src\flutter
# Add to PATH: C:\src\flutter\bin
```

#### macOS
```bash
# Using git
git clone https://github.com/flutter/flutter.git -b stable
export PATH="$PATH:`pwd`/flutter/bin"

# Or using Homebrew
brew install --cask flutter
```

#### Linux
```bash
# Download Flutter SDK
cd ~/development
wget https://storage.googleapis.com/flutter_infra_release/releases/stable/linux/flutter_linux_3.24.5-stable.tar.xz
tar xf flutter_linux_3.24.5-stable.tar.xz
export PATH="$PATH:$HOME/development/flutter/bin"
```

### 2. Verify Flutter Installation

```bash
flutter doctor
```

This will check for:
- Flutter SDK
- Android toolchain
- Xcode (macOS only)
- VS Code or Android Studio
- Connected devices

### 3. Install Platform-Specific Tools

#### For Android Development

1. **Install Android Studio**
   - Download from https://developer.android.com/studio
   - Install Android SDK
   - Install Android SDK Command-line Tools
   - Accept Android licenses: `flutter doctor --android-licenses`

2. **Set up Android Emulator**
   - Open Android Studio
   - Tools > Device Manager
   - Create a new virtual device

#### For iOS Development (macOS only)

1. **Install Xcode**
   ```bash
   xcode-select --install
   sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
   sudo xcodebuild -runFirstLaunch
   ```

2. **Install CocoaPods**
   ```bash
   sudo gem install cocoapods
   ```

3. **Set up iOS Simulator**
   ```bash
   open -a Simulator
   ```

## Building the App

### Setup Project

1. **Clone the repository**
   ```bash
   git clone https://github.com/markrcote/gvtimer.git
   cd gvtimer
   ```

2. **Get dependencies**
   ```bash
   flutter pub get
   ```

### Development Builds

#### Run on Android

```bash
# List available devices
flutter devices

# Run on specific Android device/emulator
flutter run -d <device-id>

# Or simply
flutter run -d android
```

#### Run on iOS (macOS only)

```bash
# Install iOS dependencies
cd ios
pod install
cd ..

# Run on iOS simulator
flutter run -d ios

# Run on specific iOS device
flutter run -d <device-id>
```

### Production Builds

#### Android APK (for testing)

```bash
# Build release APK
flutter build apk --release

# Output: build/app/outputs/flutter-apk/app-release.apk
```

To install on device:
```bash
flutter install
```

#### Android App Bundle (for Google Play Store)

```bash
# Build release app bundle
flutter build appbundle --release

# Output: build/app/outputs/bundle/release/app-release.aab
```

**Note:** You need to sign the app bundle before uploading to Play Store. See [Android signing documentation](https://docs.flutter.dev/deployment/android#signing-the-app).

#### iOS Release Build (macOS only)

```bash
# Build release iOS app
flutter build ios --release

# Or build for archiving
flutter build ios --release --no-codesign
```

Then:
1. Open `ios/Runner.xcworkspace` in Xcode
2. Select Product > Archive
3. Follow Xcode's distribution wizard to upload to App Store

**Note:** You need an Apple Developer account and proper signing certificates.

## Signing Configuration

### Android Signing

1. **Generate a keystore**
   ```bash
   keytool -genkey -v -keystore ~/gvtimer-release.keystore -alias gvtimer -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Create `android/key.properties`**
   ```properties
   storePassword=<password>
   keyPassword=<password>
   keyAlias=gvtimer
   storeFile=<path-to-keystore>
   ```

3. **Update `android/app/build.gradle`**
   ```gradle
   def keystoreProperties = new Properties()
   def keystorePropertiesFile = rootProject.file('key.properties')
   if (keystorePropertiesFile.exists()) {
       keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
   }

   android {
       ...
       signingConfigs {
           release {
               keyAlias keystoreProperties['keyAlias']
               keyPassword keystoreProperties['keyPassword']
               storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
               storePassword keystoreProperties['storePassword']
           }
       }
       buildTypes {
           release {
               signingConfig signingConfigs.release
           }
       }
   }
   ```

### iOS Signing

1. Open `ios/Runner.xcworkspace` in Xcode
2. Select the Runner project
3. Select the Runner target
4. Go to "Signing & Capabilities"
5. Select your Team
6. Xcode will automatically manage provisioning profiles

## Testing

### Run Tests

```bash
# Run all tests
flutter test

# Run specific test file
flutter test test/widget_test.dart

# Run tests with coverage
flutter test --coverage
```

### Integration Tests

```bash
# Run integration tests on connected device
flutter test integration_test
```

## Troubleshooting

### Common Issues

1. **"Flutter SDK not found"**
   - Ensure Flutter is in your PATH
   - Run `flutter doctor` to verify

2. **"Android licenses not accepted"**
   ```bash
   flutter doctor --android-licenses
   ```

3. **iOS build fails**
   - Clean build: `flutter clean`
   - Update pods: `cd ios && pod update && cd ..`
   - Run `flutter doctor` to check Xcode setup

4. **Gradle build fails**
   - Clear Gradle cache: `cd android && ./gradlew clean`
   - Ensure Android SDK is up to date

### Performance Optimization

For production builds, consider:

```bash
# Build with optimizations
flutter build apk --release --obfuscate --split-debug-info=build/debug-info

# Build for specific architecture (smaller APK)
flutter build apk --release --target-platform android-arm64
```

## Continuous Integration

Example GitHub Actions workflow:

```yaml
name: Build and Test
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.24.5'
      - run: flutter pub get
      - run: flutter test
      - run: flutter build apk --release
```

## Additional Resources

- [Flutter Documentation](https://flutter.dev/docs)
- [Flutter Deployment Guide](https://docs.flutter.dev/deployment)
- [Android Deployment](https://docs.flutter.dev/deployment/android)
- [iOS Deployment](https://docs.flutter.dev/deployment/ios)
