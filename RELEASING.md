# Releasing GVTimer to the Play Store

## Prerequisites

- Access to the [Google Play Console](https://play.google.com/console) for the GVTimer app
- The release keystore file and its credentials

## Steps

### 1. Update version numbers

In `app/build.gradle.kts`, increment:

- `versionCode` — must be a higher integer than the previous release (Play Store requires this)
- `versionName` — human-readable version shown to users (e.g. `"1.2"`)

```kotlin
versionCode = 2        // increment by 1 each release
versionName = "1.2"   // update as appropriate
```

Commit this change:

```bash
git add app/build.gradle.kts
git commit -m "Bump version to 1.2 (versionCode 2)"
git tag v1.2
git push origin main --tags
```

### 2. Configure signing

The Play Store requires a signed release build. Configure signing in `app/build.gradle.kts` by adding a `signingConfigs` block, or pass the credentials on the command line.

**Option A — `keystore.properties` file (recommended, keep out of version control):**

Create `keystore.properties` in the project root (already in `.gitignore`):

```properties
storeFile=/path/to/release.keystore
storePassword=...
keyAlias=...
keyPassword=...
```

Then add to `app/build.gradle.kts`:

```kotlin
val keystoreProperties = java.util.Properties().apply {
    load(rootProject.file("keystore.properties").inputStream())
}

android {
    signingConfigs {
        create("release") {
            storeFile = file(keystoreProperties["storeFile"] as String)
            storePassword = keystoreProperties["storePassword"] as String
            keyAlias = keystoreProperties["keyAlias"] as String
            keyPassword = keystoreProperties["keyPassword"] as String
        }
    }
    buildTypes {
        release {
            signingConfig = signingConfigs.getByName("release")
            // ...existing config...
        }
    }
}
```

**Option B — command-line flags:**

```bash
./gradlew bundleRelease \
  -Pandroid.injected.signing.store.file=/path/to/release.keystore \
  -Pandroid.injected.signing.store.password=... \
  -Pandroid.injected.signing.key.alias=... \
  -Pandroid.injected.signing.key.password=...
```

### 3. Build the release bundle

The Play Store requires an Android App Bundle (`.aab`), not an APK:

```bash
./gradlew bundleRelease
```

The output file will be at:

```
app/build/outputs/bundle/release/app-release.aab
```

### 4. Upload to Play Store

1. Go to [Google Play Console](https://play.google.com/console) and open GVTimer.
2. Navigate to **Release > Production** (or Testing track if doing a staged rollout).
3. Click **Create new release**.
4. Upload `app-release.aab`.
5. Fill in the **Release notes** (what's new in this version).
6. Click **Save**, then **Review release**, then **Start rollout to Production**.

### 5. Monitor the rollout

- Play Store review typically takes a few hours to a few days.
- Check **Release > Production** for rollout status and any policy issues.
- Monitor **Android Vitals** for crash reports after the release goes live.

## Notes

- `versionCode` must always increase; you cannot reuse or skip codes.
- The `.aab` file should not be committed to the repository.
- Keep the keystore and `keystore.properties` file backed up securely — losing the keystore means you cannot publish updates to the existing app listing.
