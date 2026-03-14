# GVTimer — Claude Notes

## Project overview

Android app (Kotlin + Jetpack Compose) that wraps a self-contained HTML/CSS/JS timer in a WebView. All app logic lives in `app/src/main/assets/index.html`.

## Key files

- `app/src/main/assets/index.html` — the entire UI and timer logic
- `app/src/main/java/com/markrcote/gvtimer/MainActivity.kt` — loads the web app in a WebView
- `app/build.gradle.kts` — dependencies and version info (current: versionName `"1.3"`, versionCode `3`)
- `RELEASING.md` — step-by-step Play Store release instructions

## Build

```bash
./gradlew assembleDebug     # debug build
./gradlew assembleRelease   # release build
./gradlew bundleRelease     # Play Store bundle (.aab)
```

Requires Android Studio or a local Android SDK installation.

## Releasing

See `RELEASING.md` for the full Play Store release process. Summary:
1. Increment `versionCode` and `versionName` in `app/build.gradle.kts`
2. Commit, tag (`v<version>`), and push
3. `./gradlew bundleRelease` — output at `app/build/outputs/bundle/release/app-release.aab`
4. Upload `.aab` to Google Play Console

Signing requires `keystore.properties` in the project root (not committed).

## Architecture notes

The app intentionally avoids native Android UI. The WebView loads `file:///android_asset/index.html` with JavaScript enabled. There is no network access; everything is local.

`configChanges="orientation|screenSize|keyboardHidden"` on the activity prevents recreation on rotation, preserving timer state without needing to save/restore it explicitly.
