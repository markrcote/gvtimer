# GVTimer — Claude Notes

## Project overview

Android app (Kotlin + Jetpack Compose) that wraps a self-contained HTML/CSS/JS timer in a WebView. All app logic lives in `app/src/main/assets/index.html`.

## Key files

- `app/src/main/assets/index.html` — the entire UI and timer logic
- `app/src/main/java/com/markrcote/gvtimer/MainActivity.kt` — loads the web app in a WebView
- `app/build.gradle.kts` — dependencies and version info

## Build

```bash
./gradlew assembleDebug     # debug build
./gradlew assembleRelease   # release build
```

Requires Android Studio or a local Android SDK installation.

## Architecture notes

The app intentionally avoids native Android UI. The WebView loads `file:///android_asset/index.html` with JavaScript enabled. There is no network access; everything is local.

`configChanges="orientation|screenSize|keyboardHidden"` on the activity prevents recreation on rotation, preserving timer state without needing to save/restore it explicitly.
