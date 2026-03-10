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

## Building

Open the project in Android Studio and build normally, or from the command line:

```bash
./gradlew assembleRelease
```

## Architecture

The app is a thin Android wrapper (Kotlin + Jetpack Compose) around a self-contained HTML/CSS/JavaScript web app loaded from the local assets. The web app handles all timer logic and UI.

## Privacy

GVTimer does not collect, store, or transmit any personal data. See [PRIVACY.md](PRIVACY.md) for details.

## License

Copyright (c) Mark Côté. All rights reserved.
