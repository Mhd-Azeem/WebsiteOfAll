/* AZ Appverse — public GitHub release catalogue.
   Verified fallback links work even if GitHub's public API is unavailable.
   Public release metadata is refreshed in the browser, cached for six hours. */
(function () {
  'use strict';

  const OWNER = 'Mhd-Azeem';
  const SIX_HOURS = 6 * 60 * 60 * 1000;
  const CACHE_KEY = 'az-appverse-public-releases-v1';
  const fallback = (repo, tag, date, isPreview, assetNames) => ({
    tag: tag,
    date: date,
    prerelease: isPreview,
    releaseUrl: 'https://github.com/' + OWNER + '/' + repo + '/releases/tag/' + encodeURIComponent(tag),
    assets: assetNames.map(function (name) {
      return { name: name, url: 'https://github.com/' + OWNER + '/' + repo + '/releases/download/' + encodeURIComponent(tag) + '/' + encodeURIComponent(name) };
    })
  });

  const apps = [
    {
      id: 'remote', name: 'AZ Remote Connect', repo: 'AZ-RemoteConnect', tone: 'blue',
      symbol: 'RC', label: 'CONNECTIVITY', category: 'Remote access', filters: ['android', 'windows', 'tools'],
      short: 'Remote access that makes your devices feel closer, wherever you are.',
      description: 'An evolving remote connectivity app for viewing and controlling a Windows computer from an Android phone, with multi-platform builds.',
      features: ['Remote screen viewing', 'Android controller', 'Windows host', 'Touchpad control'],
      release: fallback('AZ-RemoteConnect', 'v0.4.0-blue-dashboard.8', '2026-10-16T05:12:54Z', true, ['AZ-RemoteConnect-Viewer-debug.apk', 'AZ-RemoteConnect-Windows-x64.exe'])
    },
    {
      id: 'music', name: 'AzMusic', repo: 'music-app-azeem', tone: 'purple',
      symbol: '♫', label: 'AUDIO', category: 'Music player', filters: ['android', 'tools'],
      short: 'A personal music world, designed around the songs you love.',
      description: 'A music listening experience focused on discovery, artists, playlists and an expressive player interface.',
      features: ['Music discovery', 'Artists and playlists', 'Personal listening', 'Android player'],
      release: fallback('music-app-azeem', 'latest', '2026-07-05T19:53:17Z', false, ['AzMusic.apk'])
    },
    {
      id: 'attendance', name: 'School Attendance', repo: 'School-Attendance', tone: 'cyan',
      symbol: 'SA', label: 'EDUCATION', category: 'School management', filters: ['android', 'education', 'tools'],
      short: 'Make school attendance faster, clearer, and easier to manage.',
      description: 'A digital attendance system with an Android app, reporting workflows and school administration features.',
      features: ['Attendance tracking', 'Reporting', 'School workflow', 'Signed Android build'],
      release: fallback('School-Attendance', 'apk-v0.2.279-build-279', '2026-10-07T06:34:31Z', false, ['School-Attendance-INSTALL.apk'])
    },
    {
      id: 'car', name: 'AZ Car 3D', repo: 'WebToApp', tone: 'orange',
      symbol: '3D', label: 'GAMING', category: 'Driving game', filters: ['android', 'windows', 'games'],
      releaseFilter: 'car',
      short: 'Take the wheel in a driving world inspired by Sri Lankan roads.',
      description: 'An experimental open-world driving game project featuring Akurana and both Android and Windows builds.',
      features: ['3D driving', 'Akurana setting', 'Android build', 'Windows build'],
      release: fallback('WebToApp', 'car3d-akurana', '2026-10-13T04:28:54Z', false, ['AZ-Car-3D-Akurana.apk', 'AZCar3D-Akurana-Windows-x64.zip'])
    },
    {
      id: 'jarvis', name: 'Jarvis', repo: 'Jarvis', tone: 'teal',
      symbol: 'J', label: 'UTILITY', category: 'Productivity tool', filters: ['android', 'windows', 'tools'],
      short: 'A cross-device software experiment for smarter everyday workflows.',
      description: 'A personal software project with downloadable Android and Windows releases and update-focused builds.',
      features: ['Android app', 'Windows app', 'Release updates', 'Cross-platform project'],
      release: fallback('Jarvis', 'build-21', '2026-09-12T17:20:44Z', false, ['Jarvis-installable.apk', 'Jarvis-Windows.exe'])
    },
    {
      id: 'neon', name: 'Neon Coast', repo: 'games', tone: 'pink',
      symbol: 'NC', label: 'GAMING', category: 'Arcade game', filters: ['android', 'windows', 'games'],
      releaseFilter: 'coast',
      short: 'Neon-lit gaming energy, packaged for Android and Windows.',
      description: 'A game prototype from the AZ games collection, distributed as Android and Windows test builds.',
      features: ['Game prototype', 'Android build', 'Windows build', 'Preview release'],
      release: fallback('games', 'coast-build-2', '2026-09-20T19:57:05Z', true, ['NeonCoast.apk', 'NeonCoast.exe'])
    },
    {
      id: 'editor', name: "Azeem's Editor", repo: 'Photoeditor', tone: 'indigo',
      symbol: 'ED', label: 'CREATIVE', category: 'Photo editor', filters: ['android', 'tools'],
      short: 'Creative tools for turning everyday photos into something new.',
      description: 'A mobile photo-editing application project with a published Android APK.',
      features: ['Image editing', 'Mobile creative tools', 'Android APK', 'Photo workflows'],
      release: fallback('Photoeditor', 'latest', '2026-09-16T12:59:22Z', false, ['Azeems-Editor.apk'])
    },
    {
      id: 'maestro', name: 'Team Maestro Exam', repo: 'team-maestro', tone: 'green',
      symbol: 'TM', label: 'EDUCATION', category: 'Exam tool', filters: ['android', 'education'],
      short: 'A digital companion for learning, practice and exam workflows.',
      description: 'An education-focused examination application with public Android release packages.',
      features: ['Exam workflows', 'Education tools', 'Android release', 'Student-focused'],
      release: fallback('team-maestro', 'v1.1.0', '2026-07-10T07:18:25Z', false, ['TeamMaestroExam-v1.1.0.apk'])
    },
    {
      id: 'launcher', name: 'AZ Launcher', repo: 'AZ-Launcher', tone: 'indigo',
      symbol: 'AZ', label: 'PERSONALIZATION', category: 'Android launcher', filters: ['android', 'tools'],
      short: 'A customizable Android home screen with its own AZ design language.',
      description: 'A launcher project focused on personalization, panels, gestures, widgets and a distinctive Android interface.',
      features: ['Home screen design', 'Widgets', 'Personalization', 'Android 15 focus'],
      private: true
    },
    {
      id: 'webtoapp', name: 'WebToApp Builder', repo: 'WebToApp', tone: 'blue',
      symbol: '</>', label: 'DEVELOPER TOOLS', category: 'App builder', filters: ['android', 'tools'],
      short: 'Convert websites into Android app projects, from an idea to a build.',
      description: 'The original website-to-Android app builder source project. No public standalone WebToApp download has been verified yet.',
      features: ['Web-to-Android project', 'GitHub-based development', 'Developer tools', 'Source repository'],
      sourceOnly: true
    }
  ];

  var filter = 'all';
  var search = '';
  var sort = 'featured';
  var lastFocus = null;
  var sourceStatus = 'Verified GitHub releases';
  var grid = document.getElementById('apps-grid');
  var modal = document.getElementById('app-modal');
  var modalContent = document.getElementById('modal-content');
  var modalDialog = modal.querySelector('.modal-dialog');

  function escapeHTML(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return {'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c];
    });
  }
  function githubUrl(url) {
    try {
      var u = new URL(url);
      return u.protocol === 'https:' && u.hostname === 'github.com' && u.pathname.toLowerCase().startsWith('/mhd-azeem/') ? u.href : '';
    } catch (_) { return ''; }
  }
  function platformOf(file) {
    var n = (file.name || '').toLowerCase();
    if (n.endsWith('.apk')) return 'Android';
    if (n.endsWith('.exe') || n.endsWith('.msi')) return 'Windows';
    if (n.endsWith('.zip') && /windows|win64|win32|x64|x86|desktop/.test(n)) return 'Windows';
    return '';
  }
  function downloadsFor(app) {
    if (!app.release || app.private || app.sourceOnly) return [];
    var files = app.release.assets.filter(function (file) { return platformOf(file) && githubUrl(file.url); });
    var platforms = ['Android', 'Windows'];
    return platforms.map(function (platform) {
      var options = files.filter(function (f) { return platformOf(f) === platform; });
      options.sort(function (a, b) {
        var nameA = a.name.toLowerCase();
        var nameB = b.name.toLowerCase();
        var rank = function (name) {
          return (name.includes('full') || name.includes('signed') || name.includes('installable') ? 10 : 0) +
            (name.includes('preview') || name.includes('debug') || name.includes('unsigned') ? -4 : 0) +
            (name.endsWith('.exe') ? 3 : 0);
        };
        return rank(nameB) - rank(nameA);
      });
      return options.length ? { platform: platform, file: options[0] } : null;
    }).filter(Boolean);
  }
  function dateText(date) {
    if (!date || Number.isNaN(new Date(date).getTime())) return 'Date not available';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  function labelFor(app) {
    if (app.private) return '<span class="release-label locked">Private</span>';
    if (app.sourceOnly) return '<span class="release-label locked">Source only</span>';
    if (!app.release) return '<span class="release-label locked">No release</span>';
    return app.release.prerelease ? '<span class="release-label preview">Preview build</span>' : '<span class="release-label">Published</span>';
  }
  function cardFor(app, index) {
    var options = downloadsFor(app);
    var pills = options.map(function (d) { return '<span class="platform-pill">' + escapeHTML(d.platform) + '</span>'; }).join('');
    if (!pills) pills = '<span class="platform-pill unavailable">' + (app.private ? 'Private project' : 'Source project') + '</span>';
    var actions = options.map(function (d, n) {
      return '<a class="download-action' + (n > 0 ? ' is-secondary' : '') + '" href="' + escapeHTML(githubUrl(d.file.url)) +
        '" target="_blank" rel="noopener noreferrer" aria-label="Download ' + escapeHTML(app.name + ' for ' + d.platform) + '">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 3v13m-5-5 5 5 5-5M4 17v4h16v-4"/></svg>' + escapeHTML(d.platform) + '</a>';
    }).join('');
    if (!actions) {
      if (app.sourceOnly) {
        actions = '<a class="card-source-action" target="_blank" rel="noopener noreferrer" href="' + escapeHTML(githubUrl('https://github.com/' + OWNER + '/' + app.repo)) + '">View source repository ↗</a>';
      } else {
        actions = '<button class="card-source-action" type="button" data-details="' + escapeHTML(app.id) + '">View project details ↗</button>';
      }
    } else {
      actions += '<button class="details-action" type="button" data-details="' + escapeHTML(app.id) + '" aria-label="Details for ' + escapeHTML(app.name) + '">Details ↗</button>';
    }
    return '<article class="app-card" aria-label="' + escapeHTML(app.name) + '">' +
      '<div class="app-poster tone-' + escapeHTML(app.tone) + '"><span class="poster-topline">AZ / ' + String(index + 1).padStart(2, '0') + '</span>' +
      '<span class="poster-symbol" aria-hidden="true">' + escapeHTML(app.symbol) + '</span><span class="poster-flare" aria-hidden="true"></span>' +
      '<span class="poster-bottomline">' + escapeHTML(app.label) + ' ↗</span></div>' +
      '<div class="card-body"><div class="card-overline"><span class="category-label">' + escapeHTML(app.category) + '</span>' + labelFor(app) + '</div>' +
      '<h3 class="card-title">' + escapeHTML(app.name) + '</h3><p class="card-desc">' + escapeHTML(app.short) + '</p>' +
      '<div class="platform-row">' + pills + '</div><div class="card-divider"></div><div class="card-actions">' + actions + '</div></div></article>';
  }
  function render() {
    var list = apps.filter(function (app) {
      if (filter !== 'all' && app.filters.indexOf(filter) < 0) return false;
      var haystack = [app.name, app.short, app.category, app.label, app.description, app.features.join(' ')].join(' ').toLowerCase();
      return !search || haystack.includes(search);
    });
    if (sort === 'az') list.sort(function (a, b) { return a.name.localeCompare(b.name); });
    if (sort === 'latest') list.sort(function (a, b) {
      return (new Date(b.release && b.release.date || 0).getTime() || 0) - (new Date(a.release && a.release.date || 0).getTime() || 0);
    });
    grid.innerHTML = list.map(cardFor).join('');
    document.getElementById('empty-state').hidden = list.length !== 0;
    document.getElementById('result-count').textContent = 'Showing ' + list.length + ' of ' + apps.length + ' projects';
    document.getElementById('sync-status').textContent = sourceStatus;
    document.getElementById('stat-apps').textContent = apps.length;
    document.getElementById('total-app-count').textContent = apps.length;
    document.getElementById('panel-count').textContent = String(apps.length).padStart(3, '0');
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
  }
  function modalHtml(app) {
    var downloads = downloadsFor(app);
    var meta = app.release ?
      '<div class="release-box"><div class="release-box-top"><span>' + escapeHTML(app.release.tag) + '</span>' + labelFor(app) + '</div><p>Published ' + escapeHTML(dateText(app.release.date)) + ' · Original files on GitHub Releases</p></div>' :
      '<div class="release-box"><div class="release-box-top"><span>' + (app.private ? 'Private repository' : 'Source available') + '</span>' + labelFor(app) + '</div><p>' + (app.private ? 'Public downloads are not available from this private repository.' : 'No public standalone app download has been verified for this project.') + '</p></div>';
    var btns = downloads.map(function (d) {
      return '<a target="_blank" rel="noopener noreferrer" href="' + escapeHTML(githubUrl(d.file.url)) + '"><span>↓ ' + escapeHTML(d.platform) +
        '<br><small>' + escapeHTML(d.file.name) + '</small></span><span>↗</span></a>';
    }).join('');
    var status = app.private ? '<p class="modal-locked">This GitHub repository is private. Visitors need a public release download before this app can be installed from the website.</p>' :
      app.sourceOnly ? '<p class="modal-locked">This project has public source code, but no verified standalone WebToApp download yet.</p>' : '';
    return '<div class="modal-icon">' + escapeHTML(app.symbol) + '</div>' +
      '<span class="modal-eyebrow">' + escapeHTML(app.label) + ' / AZ APPVERSE</span>' +
      '<h2 id="modal-title">' + escapeHTML(app.name) + '</h2>' +
      '<p class="modal-summary">' + escapeHTML(app.description) + '</p>' +
      '<div class="modal-heading">HIGHLIGHTS</div><div class="feature-list">' + app.features.map(function (f) {
        return '<span class="feature-item">' + escapeHTML(f) + '</span>';
      }).join('') + '</div>' + meta + status +
      (btns ? '<div class="modal-heading">AVAILABLE DOWNLOADS</div><div class="modal-downloads">' + btns + '</div>' +
        '<p class="modal-note">' + (app.release.prerelease ? 'This is a preview build and may be unstable. ' : '') +
        'Android APKs require Android installation permission; Windows files must be opened on a compatible PC.</p>' : '') +
      (!app.private ? '<a class="modal-source-link" href="' + escapeHTML(githubUrl('https://github.com/' + OWNER + '/' + app.repo)) +
        '" target="_blank" rel="noopener noreferrer">View project on GitHub <span>↗</span></a>' : '');
  }
  function openModal(id) {
    var app = apps.find(function (item) { return item.id === id; });
    if (!app) return;
    lastFocus = document.activeElement;
    modalContent.innerHTML = modalHtml(app);
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    modalDialog.scrollTop = 0;
    modal.querySelector('.modal-close').focus();
  }
  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  }
  function getCached() {
    try { return JSON.parse(localStorage.getItem(CACHE_KEY) || 'null'); } catch (_) { return null; }
  }
  function setCached(data) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ time: Date.now(), values: data })); } catch (_) { /* storage unavailable */ }
  }
  function relevantRelease(app, release) {
    if (!release || release.draft || !release.assets || !release.assets.length) return false;
    if (app.releaseFilter === 'car' && !/car3d|azcar|az.car/i.test(release.tag_name + ' ' + release.name)) return false;
    if (app.releaseFilter === 'coast' && !/coast/i.test(release.tag_name + ' ' + release.name)) return false;
    return release.assets.some(function (asset) { return platformOf({ name: asset.name }); });
  }
  function extractRelease(app, data) {
    if (!Array.isArray(data)) return null;
    var candidates = data.filter(function (release) { return relevantRelease(app, release); });
    candidates.sort(function (a, b) { return new Date(b.published_at || 0).getTime() - new Date(a.published_at || 0).getTime(); });
    var release = candidates[0];
    if (!release) return null;
    var assets = release.assets.map(function (a) { return { name: a.name, url: a.browser_download_url }; })
      .filter(function (a) { return !!platformOf(a) && !!githubUrl(a.url); });
    if (!assets.length) return null;
    return {
      tag: release.tag_name,
      date: release.published_at,
      prerelease: !!release.prerelease,
      releaseUrl: githubUrl(release.html_url || ''),
      assets: assets
    };
  }
  async function refreshReleases() {
    var cached = getCached();
    if (cached && cached.values && cached.time && Date.now() - cached.time < SIX_HOURS) {
      apps.forEach(function (a) { if (cached.values[a.id]) a.release = cached.values[a.id]; });
      sourceStatus = 'Release data cached · refreshes every 6h';
      render();
      return;
    }
    var publicApps = apps.filter(function (a) { return !a.private && !a.sourceOnly; });
    var updated = {};
    var synced = 0;
    await Promise.all(publicApps.map(async function (app) {
      try {
        var response = await fetch('https://api.github.com/repos/' + OWNER + '/' + app.repo + '/releases?per_page=50', {
          headers: { Accept: 'application/vnd.github+json' },
          signal: AbortSignal.timeout ? AbortSignal.timeout(9000) : undefined
        });
        if (!response.ok) throw new Error('GitHub API response ' + response.status);
        var live = extractRelease(app, await response.json());
        if (live) { app.release = live; synced++; }
      } catch (_) { /* verified published fallback links remain visible */ }
      if (app.release) updated[app.id] = app.release;
    }));
    if (synced) {
      sourceStatus = synced === publicApps.length ? 'Live GitHub release data' : 'Live + verified GitHub releases';
      setCached(updated);
    } else {
      sourceStatus = 'Verified release links · live check unavailable';
    }
    render();
  }

  document.getElementById('app-search').addEventListener('input', function (e) {
    search = e.target.value.trim().toLowerCase();
    render();
  });
  document.getElementById('sort-select').addEventListener('change', function (e) {
    sort = e.target.value;
    render();
  });
  document.getElementById('filter-list').addEventListener('click', function (e) {
    var btn = e.target.closest('[data-filter]');
    if (!btn) return;
    filter = btn.getAttribute('data-filter');
    document.querySelectorAll('[data-filter]').forEach(function (item) {
      var active = item === btn;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    render();
  });
  document.getElementById('reset-filters').addEventListener('click', function () {
    search = '';
    filter = 'all';
    sort = 'featured';
    document.getElementById('app-search').value = '';
    document.getElementById('sort-select').value = 'featured';
    document.querySelectorAll('[data-filter]').forEach(function (item) {
      var active = item.getAttribute('data-filter') === 'all';
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    render();
    document.getElementById('app-search').focus();
  });
  grid.addEventListener('click', function (e) {
    var detail = e.target.closest('[data-details]');
    if (detail) openModal(detail.getAttribute('data-details'));
  });
  modal.addEventListener('click', function (e) {
    if (e.target.closest('[data-close-modal]')) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (!modal.classList.contains('is-open')) return;
    if (e.key === 'Escape') { closeModal(); return; }
    if (e.key !== 'Tab') return;
    var interactive = Array.from(modalDialog.querySelectorAll('a[href],button:not([disabled])'));
    if (!interactive.length) return;
    if (e.shiftKey && document.activeElement === interactive[0]) { e.preventDefault(); interactive[interactive.length - 1].focus(); }
    if (!e.shiftKey && document.activeElement === interactive[interactive.length - 1]) { e.preventDefault(); interactive[0].focus(); }
  });
  render();
  refreshReleases();
}());