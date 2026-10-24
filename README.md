# AZ Appverse

Responsive, dark-blue app showcase for software made by Azeem.

**Public website:** https://mhd-azeem.github.io/WebsiteOfAll/

## Published catalog

The live catalog is defined in `app.js` and currently includes eight app cards:

1. AZ Remote Connect — Coming Soon.
2. AzMusic — Android APK; Windows EXE/MSI/MSIX/ZIP when a verified release exists.
3. ZCM School Attendance — Android APK; web portal link once a public URL is verified.
4. Team Maestro — Android APK.
5. Universal School Attendance — Coming Soon; web/PWA source exists, public portal URL not yet verified.
6. AZ Car 3D Akurana — Android APK and Windows bundle, tracked independently.
7. AZ Car 3D Colombo — tracked independently; download shown only when a matching public release exists.
8. Jarvis — Coming Soon.

Web portal buttons require an explicitly verified HTTPS `portalUrl` in the corresponding app entry. Never guess portal URLs. Windows setup files (.exe, .msi, .msix) and Windows ZIP bundles are recognized from published GitHub Releases.

The website intentionally excludes WebToApp Builder, AZ Launcher, Azeem's Editor, and Neon Coast. Do not re-add these without approval.

## How automatic release updates work

- The public website calls the GitHub Releases API for each downloadable project's source repository.
- It independently selects the **newest stable Android APK** and the **newest stable Windows EXE/ZIP**, including when those files belong to different releases. If no stable build exists for a platform, the latest prerelease for that platform is used. A prerelease won't silently supersede an existing stable download.
- For AZ Car 3D, only releases matching the relevant city (Akurana or Colombo) are considered from the shared WebToApp repository. This prevents WebToApp release assets from appearing as AZ Car downloads.
- The app-card download buttons, detail modal, visible release tag, and published date update automatically on the page after the GitHub API call succeeds.
- Successful metadata is cached in each visitor's browser for at most **five minutes**. Refresh the page after that interval to fetch new releases. It is not a background push notification.
- If GitHub's public API is unavailable or rate-limited, the last cached result or verified fallback links remain visible. That may delay a newly released build for affected visitors until their next successful refresh.
- A release must be **public and have the correct downloadable asset** (e.g. APK, Windows EXE, or Windows ZIP) to appear. A GitHub Actions build artifact without a release is not sufficient.
- No redeployment or manual website code edit is normally needed to show a new published release. The original versioned fallback links can be updated occasionally for offline reliability.

**Important:** These checks update the **website's displayed download links**, not the installed Android or Windows apps. Apps need their own update-checking logic to install future builds.

## App icons

- `icons/az-remote-connect.jpg` — original AZ Remote Connect artwork from its branding source.
- `icons/azmusic.svg` — SVG adapted from AzMusic's classic Android launcher vector.
- `icons/school-attendance.svg` — original School Attendance public web icon.
- `icons/az-car-3d.svg` — original AZ Car 3D Godot project icon.
- `icons/jarvis.svg` — custom website icon (no original source icon identified).

Icons live directly in this repository and do not rely on the source repositories remaining publicly accessible. CSS letter-symbol fallbacks appear if an icon does not load.

## Maintain the catalog

- Edit `app.js` to change app titles, descriptions, filters or icon paths.
- For an app moved to a new GitHub repository, update its `repo` and `fallback(...)` values.
- To launch Remote Connect later, remove its `comingSoon` property and add a verified release fallback.
- If multiple applications share a source repository, add a release filter to `relevantRelease()`.
- Check Pages under **Settings → Pages**; deployment source should be `main` with `/(root)`.

## Technology

Pure HTML (`index.html`), CSS (`styles.css`), SVG/JPEG assets, and vanilla JavaScript (`app.js`). The site runs on GitHub Pages without a build step, backend or paid hosting.
