# GVTimer — Claude Notes

## Project overview

Android app (Kotlin + Jetpack Compose) that wraps a self-contained HTML/CSS/JS timer in a WebView. All app logic lives in `app/src/main/assets/index.html`.

## Key files

- `app/src/main/assets/timer.js` — all timer logic (`formatTime`, `initTimer`); testable in Node via injectable opts (`now`, `onRestEnd`, `onExerciseComplete`)
- `app/src/main/assets/index.html` — UI shell and wiring block that calls `initTimer` and attaches event listeners
- `app/src/main/java/com/markrcote/gvtimer/MainActivity.kt` — loads the web app in a WebView, creates the notification channel, requests `POST_NOTIFICATIONS` permission
- `app/src/main/java/com/markrcote/gvtimer/TimerBridge.kt` — `@JavascriptInterface` that JS calls to schedule/cancel the rest-end alarm via `AlarmManager`
- `app/src/main/java/com/markrcote/gvtimer/TimerNotificationReceiver.kt` — `BroadcastReceiver` that posts the "Rest complete" notification when the alarm fires
- `app/build.gradle.kts` — dependencies and version info (current: versionName `"1.3"`, versionCode `3`)
- `RELEASING.md` — step-by-step Play Store release instructions

## Build

```bash
./gradlew assembleDebug     # debug build
./gradlew assembleRelease   # release build
./gradlew bundleRelease     # Play Store bundle (.aab)
./gradlew installDebug      # install on connected device/emulator (does not launch)
adb shell am start -n com.markrcote.gvtimer/.MainActivity  # launch after install
```

Requires Android Studio or a local Android SDK installation.

## JS tests

Timer logic has Jest unit tests in `tests/timer.test.js`. Run with:

```bash
npm ci   # first time only
npm test
```

CI runs these on every push and PR via `.github/workflows/js-tests.yml`.

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

### Background notification

The rest timer uses `Date.now()` as its reference (stored in `restEndTime`) rather than a decrement counter, so the displayed countdown corrects itself instantly when the user returns from another app.

When a rest period starts, JS calls `Android.scheduleNotification(seconds)` on the `TimerBridge` interface, which schedules an exact `AlarmManager` alarm (`setExactAndAllowWhileIdle`). When the alarm fires, `TimerNotificationReceiver` posts the notification. If the user is still in the app when the timer hits zero, JS calls `Android.cancelNotification()` to suppress the alarm before it fires.

If the user is still in the app when the timer hits zero and the JS interval fires within 2 seconds of `restEndTime`, the rest-end chime plays normally. If the app was backgrounded and the interval resumes late (>2 s past `restEndTime`), the chime is suppressed — the system notification already alerted the user.

Permissions used: `POST_NOTIFICATIONS` (runtime, Android 13+), `USE_EXACT_ALARM` (auto-granted on API 33+ for timer apps), `SCHEDULE_EXACT_ALARM` (fallback for API 31–32).
