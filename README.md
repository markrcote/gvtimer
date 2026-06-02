# GVTimer

An Android app for tracking [German Volume Training](https://www.t-nation.com/training/german-volume-training-program/) (GVT) sessions. GVT is a strength-training method that has you perform 10 sets of 10 reps for a given exercise, with 60-second rest periods between sets.

## Features

- Tracks sets completed out of 10
- 60-second rest timer that starts automatically after each set
- System notification when the rest period ends, even if you've switched to another app
- Distinct audio tones when the rest period ends and when all 10 sets are complete; the rest-end tone is suppressed when returning from background (the notification already alerted you)
- Resets for the next exercise once all 10 sets are done
- Supports light and dark themes

## Requirements

- Android 7.0 (API 24) or higher

## Local Development

### Prerequisites

- [Android Studio](https://developer.android.com/studio) (recommended), or Android SDK with command-line tools
- JDK 17–21 (Java 22+ is not supported by the current Kotlin/Gradle tooling)

  On Arch/Manjaro, install Java 21 and set it as the default:
  ```bash
  sudo pacman -S jdk21-openjdk
  sudo archlinux-java set java-21-openjdk
  ```

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/markrcote/gvtimer.git
   cd gvtimer
   ```

2. Open in Android Studio (**File > Open**), or use the command line directly.

### Building

```bash
./gradlew assembleDebug     # debug build
./gradlew assembleRelease   # release build
./gradlew bundleRelease     # Play Store bundle (.aab)
```

### Running on a device or emulator

**Android Studio:** Select a device (or create an emulator via **Device Manager**) and click **Run**.

**Command line — start an emulator:**

The Android SDK tools are not always on `PATH`. If `emulator` is not found, use the full path (typically `$ANDROID_HOME/emulator/emulator`):

```bash
# List available AVDs
$ANDROID_HOME/emulator/emulator -list-avds

# Start one (replace <avd-name> with an AVD from the list above)
$ANDROID_HOME/emulator/emulator -avd <avd-name> &

# Wait for the emulator to finish booting before installing
$ANDROID_HOME/platform-tools/adb wait-for-device
```

**Command line — install and run:**
```bash
./gradlew installDebug      # installs debug build on connected device/emulator
```

### Making UI changes

Timer logic lives in `app/src/main/assets/timer.js`; the UI shell and event-listener wiring live in `app/src/main/assets/index.html`. Both files can be edited in any text editor — no Android-specific tooling required. After editing, rebuild and reinstall to see changes.

### Running JS tests

```bash
npm ci      # first time only
npm test    # runs Jest suite in tests/
```

Tests cover `formatTime`, timer state transitions, and wall-clock behaviour (rest expiry, foreground chime, background-chime suppression). CI runs the same suite on every push and pull request.

## Releasing

See [RELEASING.md](RELEASING.md) for Play Store release instructions.

## Architecture

The app is a thin Android wrapper (Kotlin + Jetpack Compose) around a self-contained HTML/CSS/JavaScript web app loaded from the local assets. The web app handles all timer logic and UI.

The rest timer uses `Date.now()` as its reference so the displayed countdown stays accurate even if Android throttles the JavaScript interval while the app is in the background. When a rest period starts, the web app calls into native Kotlin code via a `JavascriptInterface` to schedule an exact `AlarmManager` alarm; a `BroadcastReceiver` fires the system notification when the alarm triggers. On Android 13 and above the app requests the `POST_NOTIFICATIONS` permission on first launch.

## Privacy

GVTimer does not collect, store, or transmit any personal data. See [PRIVACY.md](PRIVACY.md) for details.

## License

Copyright (c) Mark Côté. All rights reserved.
