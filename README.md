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

- [Flutter SDK](https://flutter.dev/docs/get-started/install) (3.0.0 or higher) - **Required**
  - Follow the [official Flutter installation guide](https://flutter.dev/docs/get-started/install) for your operating system
  - Run `flutter doctor` to verify installation
- For Android development:
  - Android Studio or Android SDK
  - Android device or emulator
- For iOS development (macOS only):
  - Xcode 14.0 or higher
  - CocoaPods
  - iOS device or simulator

## Getting Started

This project has been converted from an Android-only app to a Flutter app. The original HTML/CSS/JS-based timer has been reimplemented as a native Flutter widget.

### Project Structure

```
gvtimer/
├── lib/
│   └── main.dart          # Main Flutter app code
├── android/               # Android-specific files
├── ios/                   # iOS-specific files
├── test/                  # Widget tests
├── pubspec.yaml          # Flutter dependencies
└── README.md
```

## Building and Running

### Install Dependencies

First, ensure Flutter is installed. Then get the project dependencies:

```bash
flutter pub get
```

### Run on Android

```bash
flutter run -d android
```

Or use Android Studio to run the app.

### Run on iOS (macOS only)

First, install CocoaPods dependencies:

```bash
cd ios
pod install
cd ..
flutter run -d ios
```

Or use Xcode to run the app.

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

Press `r` to hot reload, `R` to hot restart.

### Run Tests

```bash
flutter test
```

### Check for Issues

```bash
flutter doctor
```

This will check your Flutter installation and report any issues.

### Analyze Code

```bash
flutter analyze
```

## Migration from Android App

This app was previously an Android-only app that used a WebView to display an HTML/CSS/JS timer. It has been converted to a pure Flutter app with the following changes:

- Removed WebView dependency
- Reimplemented UI using Flutter widgets
- Added cross-platform support for iOS
- Simplified audio notifications using Flutter's SystemSound
- Maintained all original functionality

## License

See LICENSE file for details.