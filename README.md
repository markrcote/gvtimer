# GVTimer

A simple app to track German Volume Training (10x10) sessions.

Built with Flutter for cross-platform support on Android and iOS.

## Features

- Track sets (0-10) for German Volume Training
- Automatic 60-second rest timer between sets
- Audio notification when rest period is complete
- Dark mode support
- Clean, simple interface

## Prerequisites

- [Flutter SDK](https://flutter.dev/docs/get-started/install) (3.0.0 or higher)
- For Android development:
  - Android Studio or Android SDK
  - Android device or emulator
- For iOS development (macOS only):
  - Xcode 14.0 or higher
  - CocoaPods
  - iOS device or simulator

## Building and Running

### Install Dependencies

```bash
flutter pub get
```

### Run on Android

```bash
flutter run -d android
```

### Run on iOS (macOS only)

```bash
cd ios
pod install
cd ..
flutter run -d ios
```

### Build for Release

#### Android APK
```bash
flutter build apk --release
```

The APK will be available at: `build/app/outputs/flutter-apk/app-release.apk`

#### Android App Bundle (for Play Store)
```bash
flutter build appbundle --release
```

The bundle will be available at: `build/app/outputs/bundle/release/app-release.aab`

#### iOS (macOS only)
```bash
flutter build ios --release
```

Then open the project in Xcode to archive and distribute:
```bash
open ios/Runner.xcworkspace
```

## Development

### Run in Debug Mode

```bash
flutter run
```

### Run Tests

```bash
flutter test
```

### Check for Issues

```bash
flutter doctor
```

## License

See LICENSE file for details.