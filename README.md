# GVTimer

An Android app for tracking [German Volume Training](https://www.t-nation.com/training/german-volume-training-program/) (GVT) sessions. GVT is a strength-training method that has you perform 10 sets of 10 reps for a given exercise, with 60-second rest periods between sets.

## Features

- Tracks sets completed out of 10
- 60-second rest timer that starts automatically after each set
- Audio beep when the rest period ends and the next set is ready
- Resets for the next exercise once all 10 sets are done
- Supports light and dark themes

## Requirements

- Android 7.0 (API 24) or higher

## Local Development

### Prerequisites

- [Android Studio](https://developer.android.com/studio) (recommended), or Android SDK with command-line tools
- JDK 17 or higher

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
```

### Running on a device or emulator

**Android Studio:** Select a device (or create an emulator via **Device Manager**) and click **Run**.

**Command line — start an emulator:**
```bash
# List available AVDs
emulator -list-avds

# Start one (replace <avd-name> with an AVD from the list above)
emulator -avd <avd-name> &
```

**Command line — install and run:**
```bash
./gradlew installDebug      # installs debug build on connected device/emulator
```

### Making UI changes

All timer logic and UI lives in a single file: `app/src/main/assets/index.html`. You can edit this file directly in any text editor — no Android-specific tooling required. After editing, rebuild and reinstall to see changes.

## Architecture

The app is a thin Android wrapper (Kotlin + Jetpack Compose) around a self-contained HTML/CSS/JavaScript web app loaded from the local assets. The web app handles all timer logic and UI.

## Privacy

GVTimer does not collect, store, or transmit any personal data. See [PRIVACY.md](PRIVACY.md) for details.

## License

Copyright (c) Mark Côté. All rights reserved.
