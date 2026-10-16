# AZ Appverse

**Website for AZ software projects by Azeem.** A responsive, dark-blue, technology-themed app showcase.

## Live website

After enabling GitHub Pages, open: **https://mhd-azeem.github.io/WebsiteOfAll/**

The repository name is WebsiteOfAll, so its Pages URL includes /WebsiteOfAll/.

## Publish (one-time setup)

1. Open this repository on GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Select **main** and **/(root)**, then **Save**.
5. Wait for the site to show as published, then open the URL above.

## Features

- Responsive blue-glass design for phones, tablets, and desktops.
- Search, filter, and sort across 10 projects.
- Verified fallback download links directly to published GitHub Release assets.
- Dynamic release checking via the public GitHub REST API (app.js), cached in the browser for six hours; fallback links remain visible if the API is rate-limited or unavailable.
- App details, release status, publication dates, and platform-specific downloads.
- Accurate labels for preview builds, private projects, and source-only projects.
- No backend, accounts, analytics, or paid hosting required.

## Private and source-only projects

- AZ Launcher is currently private. Public visitors cannot download releases from the private repository. Its card displays no public download link. Make a release publicly accessible before adding a link.
- WebToApp Builder currently has a public source repository but no independently verified standalone WebToApp release. It is source-only. The same repository contains AZ Car 3D release files; the website treats that game as a separate project.
- Preview/debug releases may be unstable; always test binaries before public distribution.
- Revisit fallback release versions after new published releases if you want accurate fallback links for visitors whose GitHub API requests fail.

## Add an application

1. Open app.js.
2. Add a definition to the apps array with a name, repo, filters, details, features and verified fallback release if available.
3. For repositories hosting multiple apps, extend relevantRelease filtering to avoid cross-linking releases.
4. Commit to main; GitHub Pages will redeploy automatically once enabled.

## Repository files

- index.html — structure and SEO metadata.
- styles.css — futuristic blue responsive interface.
- app.js — catalog, filters, release refresh and application details.
- favicon.svg and og-cover.svg — project branding.

Built with HTML, CSS and vanilla JavaScript. No build step is necessary.
