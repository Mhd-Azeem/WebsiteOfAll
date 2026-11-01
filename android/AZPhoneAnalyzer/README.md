# AZ Phone Analyzer — Phase 1

Native Kotlin Android app, minSdk 29, targetSdk 35. Offline, read-only MediaStore inventory of accessible photos, videos and audio; SHA-256 exact duplicate groups; JSON report export through Android document picker.

## Build
Open this directory in Android Studio (JDK 17) or use the GitHub Actions workflow `AZ Phone Analyzer APK`. The debug APK is uploaded as an Actions artifact; it is not a GitHub Release.

## Security and scope
No INTERNET permission, no deletions, no file modifications, no backend. Android 14+ partial photo access can limit the inventory. This phase does not read arbitrary documents, private app data, or Android/data, and it does not perform face detection or face identification. These features require subsequent implementation and testing. Hashing every file can take time and battery; scanning currently runs in an activity-bound executor rather than a resilient foreground service. Test on a device before relying on results.

## Next phases
1. Room persistence, paging, scan progress, cancellation, resumable foreground worker.
2. Storage Access Framework user-selected folders, document indexing, safe deduplication.
3. Bundled on-device face detector and independently validated embedding model, opt-in identity enrollment, video frame sampling, threshold calibration, manual review.
4. Gallery UI, CSV reports, error/scope transparency, instrumented Android 15 testing.
