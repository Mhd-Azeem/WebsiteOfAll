/* AZ Appverse — public GitHub release catalogue.
   Verified fallback links work even if GitHub's public API is unavailable.
   Public release metadata is refreshed in the browser, cached for five minutes. */
(function () {
  'use strict';

  const OWNER = 'Mhd-Azeem';
  const FIVE_MINUTES = 5 * 60 * 1000;
  const CACHE_KEY = 'az-appverse-public-releases-v3';
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
      symbol: 'RC', icon: './icons/az-remote-connect.jpg', label: 'CONNECTIVITY', category: 'Remote access', filters: ['android', 'windows', 'tools'],
      short: 'Remote access that makes your devices feel closer, wherever you are.',
      description: 'An evolving remote connectivity app for viewing and controlling a Windows computer from an Android phone, with multi-platform builds.',
      features: ['Remote screen viewing', 'Android controller', 'Windows host', 'Touchpad control'],
      comingSoon: true
    },
    {
      id: 'music', name: 'AzMusic', repo: 'music-app-azeem', tone: 'purple',
      symbol: '♫', icon: './icons/azmusic.svg', label: 'AUDIO', category: 'Music player', filters: ['android', 'tools'],
      short: 'A personal music world, designed around the songs you love.',
      description: 'A music listening experience focused on discovery, artists, playlists and an expressive player interface.',
      features: ['Music discovery', 'Artists and playlists', 'Personal listening', 'Android player'],
      release: fallback('music-app-azeem', 'latest', '2026-07-05T19:53:17Z', false, ['AzMusic.apk'])
    },
    {
      id: 'attendance', name: 'ZCM School Attendance', repo: 'School-Attendance', tone: 'cyan',
      symbol: 'SA', icon: './icons/school-attendance.svg', label: 'EDUCATION', category: 'School management', filters: ['android', 'education', 'tools'],
      short: 'Make school attendance faster, clearer, and easier to manage.',
      description: 'A digital attendance system with an Android app, reporting workflows and school administration features.',
      features: ['Attendance tracking', 'Reporting', 'School workflow', 'Signed Android build'],
      release: fallback('School-Attendance', 'apk-v0.2.279-build-279', '2026-10-07T06:34:31Z', false, ['School-Attendance-INSTALL.apk'])
    },
    {
      id: 'maestro', name: 'Team Maestro', repo: 'team-maestro', tone: 'blue',
      symbol: 'TM', icon: './icons/team-maestro.svg', label: 'EDUCATION', category: 'Exam preparation', filters: ['android', 'education', 'tools'],
      short: 'A focused companion for learning and exam preparation.',
      description: 'Team Maestro Exam is an Android app for a streamlined student exam and study experience.',
      features: ['Exam preparation', 'Student-focused tools', 'Android app', 'Release updates'],
      release: fallback('team-maestro', 'v1.1.0', '2026-07-10T07:18:25Z', false, ['TeamMaestroExam-v1.1.0.apk'])
    },
    {
      id: 'universal-attendance', name: 'Universal School Attendance', repo: 'iOS-team-maestro', tone: 'cyan',
      symbol: 'UA', icon: './icons/universal-attendance.svg', label: 'EDUCATION', category: 'Multi-school management', filters: ['android', 'education', 'tools'],
      short: 'Attendance management designed for multiple schools in one platform.',
      description: 'An evolving universal school attendance platform with multi-school support, reports, offline workflows and role-based administration.',
      features: ['Multi-school support', 'Attendance reports', 'Offline workflows', 'Role-based management'],
      comingSoon: true
    },
    {
      id: 'car-akurana', name: 'AZ Car 3D Akurana', repo: 'WebToApp', tone: 'orange',
      symbol: '3D', icon: './icons/az-car-3d.svg', label: 'GAMING', category: 'Driving game', filters: ['android', 'windows', 'games'],
      releaseFilter: 'akurana',
      short: 'Take the wheel in a driving world inspired by Sri Lankan roads.',
      description: 'An experimental open-world driving game project featuring Akurana and both Android and Windows builds.',
      features: ['3D driving', 'Akurana setting', 'Android build', 'Windows build'],
      release: fallback('WebToApp', 'car3d-akurana', '2026-10-13T04:28:54Z', false, ['AZ-Car-3D-Akurana.apk', 'AZCar3D-Akurana-Windows-x64.zip'])
    },
    {
      id: 'car-colombo', name: 'AZ Car 3D Colombo', repo: 'WebToApp', tone: 'orange',
      symbol: '3D', icon: './icons/az-car-3d.svg', label: 'GAMING', category: 'Driving game', filters: ['android', 'windows', 'games'],
      releaseFilter: 'colombo', comingSoon: true,
      short: 'Explore a Colombo-inspired driving world.',
      description: 'The Colombo edition of AZ Car 3D, listed separately from the Akurana edition.',
      features: ['Colombo setting', '3D driving', 'Android release tracking', 'Windows release tracking']
    },
    {
      id: 'jarvis', name: 'Jarvis', repo: 'Jarvis', tone: 'teal',
      symbol: 'J', icon: './icons/jarvis.svg', label: 'UTILITY', category: 'Productivity tool', filters: ['android', 'windows', 'tools'],
      short: 'A cross-device software experiment for smarter everyday workflows.',
      description: 'A personal cross-device productivity assistant currently being prepared for public launch.',
      features: ['Android app', 'Windows app', 'Release updates', 'Cross-platform project'],
      comingSoon: true
    },
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
    if (n.endsWith('.exe') || n.endsWith('.msi') || n.endsWith('.msix')) return 'Windows';
    if (n.endsWith('.zip') && /windows|win64|win32|x64|x86|desktop/.test(n)) return 'Windows';
    return '';
  }
  function downloadsFor(app) {
    if (app.comingSoon || !app.release || app.private || app.sourceOnly) return [];
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
    if (app.comingSoon) return '<span class="release-label coming-soon">Coming soon</span>';
    if (app.private) return '<span class="release-label locked">Private</span>';
    if (app.sourceOnly) return '<span class="release-label locked">Source only</span>';
    if (!app.release) return '<span class="release-label locked">No release</span>';
    return app.release.prerelease ? '<span class="release-label preview">Preview build</span>' : '<span class="release-label">Published</span>';
  }
  function cardFor(app, index) {
    var options = downloadsFor(app);
    var pills = options.map(function (d) { return '<span class="platform-pill">' + escapeHTML(d.platform) + '</span>'; }).join('');
    if (!pills) pills = '<span class="platform-pill unavailable">' + (app.comingSoon ? 'Not yet available' : 'No verified download') + '</span>';
    var actions = options.map(function (d, n) {
      return '<a class="download-action' + (n > 0 ? ' is-secondary' : '') + '" href="' + escapeHTML(githubUrl(d.file.url)) +
        '" target="_blank" rel="noopener noreferrer" aria-label="Download ' + escapeHTML(app.name + ' for ' + d.platform) + '">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 3v13m-5-5 5 5 5-5M4 17v4h16v-4"/></svg>' + escapeHTML(d.platform) + '</a>';
    }).join('');
    if (app.portalUrl && /^https:\/\//.test(app.portalUrl)) actions += '<a class="download-action is-secondary" href="' + escapeHTML(app.portalUrl) + '" target="_blank" rel="noopener noreferrer">🌐 Website</a>';
    if (!actions) {
      if (app.comingSoon) {
        actions = '<button class="card-source-action coming-soon-action" type="button" data-details="' + escapeHTML(app.id) + '">Coming soon · View details ↗</button>';
      } else if (app.sourceOnly) {
        actions = '<a class="card-source-action" target="_blank" rel="noopener noreferrer" href="' + escapeHTML(githubUrl('https://github.com/' + OWNER + '/' + app.repo)) + '">View source repository ↗</a>';
      } else {
        actions = '<button class="card-source-action" type="button" data-details="' + escapeHTML(app.id) + '">View project details ↗</button>';
      }
    } else {
      actions += '<button class="details-action" type="button" data-details="' + escapeHTML(app.id) + '" aria-label="Details for ' + escapeHTML(app.name) + '">Details ↗</button>';
    }
    return '<article class="app-card" aria-label="' + escapeHTML(app.name) + '">' +
      '<div class="app-poster tone-' + escapeHTML(app.tone) + '"><span class="poster-topline">AZ / ' + String(index + 1).padStart(2, '0') + '</span>' +
      '<span class="poster-icon-wrap" aria-hidden="true"><span class="poster-symbol-fallback">' + escapeHTML(app.symbol) + '</span><img class="poster-icon" alt="" loading="lazy" src="' + escapeHTML(app.icon) + '"></span><span class="poster-flare" aria-hidden="true"></span>' +
      '<span class="poster-bottomline">' + escapeHTML(app.label) + ' ↗</span></div>' +
      '<div class="card-body"><div class="card-overline"><span class="category-label">' + escapeHTML(app.category) + '</span>' + labelFor(app) + '</div>' +
      '<h3 class="card-title">' + escapeHTML(app.name) + '</h3><p class="card-desc">' + escapeHTML(app.short) + '</p>' +
      '<div class="platform-row">' + pills + '</div><div class="card-divider"></div><div class="card-actions">' + actions + '</div></div></article>';
  }
  function render() {
    var list = apps.filter(function (app) {
      if (filter !== 'all' && app.filters.indexOf(filter) < 0) {
        if (filter !== 'android' && filter !== 'windows') return false;
        if (!downloadsFor(app).some(function (d) { return d.platform.toLowerCase() === filter; })) return false;
      }
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
    var meta = app.comingSoon ? '<div class="release-box"><div class="release-box-top"><span>Coming soon</span>' + labelFor(app) + '</div><p>Public downloads are not available yet. Watch this space for the launch.</p></div>' : app.release ?
      '<div class="release-box"><div class="release-box-top"><span>' + escapeHTML(app.release.tag) + '</span>' + labelFor(app) + '</div><p>Published ' + escapeHTML(dateText(app.release.date)) + ' · Original files on GitHub Releases</p></div>' :
      '<div class="release-box"><div class="release-box-top"><span>' + (app.private ? 'Private repository' : 'Source available') + '</span>' + labelFor(app) + '</div><p>' + (app.private ? 'Public downloads are not available from this private repository.' : 'No public standalone app download has been verified for this project.') + '</p></div>';
    var btns = downloads.map(function (d) {
      return '<a target="_blank" rel="noopener noreferrer" href="' + escapeHTML(githubUrl(d.file.url)) + '"><span>↓ ' + escapeHTML(d.platform) +
        '<br><small>' + escapeHTML(d.file.name) + (d.file.tag ? ' · ' + escapeHTML(d.file.tag) : '') + '</small></span><span>↗</span></a>';
    }).join('');
    if (app.portalUrl && /^https:\/\//.test(app.portalUrl)) btns += '<a target="_blank" rel="noopener noreferrer" href="' + escapeHTML(app.portalUrl) + '"><span>🌐 Website</span><span>↗</span></a>';
    var status = app.comingSoon ? '<p class="modal-note">This app is marked coming soon. Downloads are disabled until its public launch.</p>' : app.private ? '<p class="modal-locked">This GitHub repository is private. Visitors need a public release download before this app can be installed from the website.</p>' :
      app.sourceOnly ? '<p class="modal-locked">This project has public source code, but no verified standalone WebToApp download yet.</p>' : '';
    return '<div class="modal-icon"><span>' + escapeHTML(app.symbol) + '</span><img class="modal-icon-img" src="' + escapeHTML(app.icon) + '" alt=""></div>' +
      '<span class="modal-eyebrow">' + escapeHTML(app.label) + ' / AZ APPVERSE</span>' +
      '<h2 id="modal-title">' + escapeHTML(app.name) + '</h2>' +
      '<p class="modal-summary">' + escapeHTML(app.description) + '</p>' +
      '<div class="modal-heading">HIGHLIGHTS</div><div class="feature-list">' + app.features.map(function (f) {
        return '<span class="feature-item">' + escapeHTML(f) + '</span>';
      }).join('') + '</div>' + meta + status +
      (btns ? '<div class="modal-heading">AVAILABLE DOWNLOADS</div><div class="modal-downloads">' + btns + '</div>' +
        '<p class="modal-note">' + (app.release.prerelease ? 'This is a preview build and may be unstable. ' : '') +
        'Android APKs require Android installation permission; Windows files must be opened on a compatible PC.</p>' : '') +
      (!app.private && !app.comingSoon ? '<a class="modal-source-link" href="' + escapeHTML(githubUrl('https://github.com/' + OWNER + '/' + app.repo)) +
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
    if (app.releaseFilter === 'akurana' && !(/akurana/i.test(release.tag_name + ' ' + release.name + ' ' + release.assets.map(function(a){return a.name;}).join(' ')) || (/car3d|az.car|azcar/i.test(release.tag_name + ' ' + release.name) && !/colombo/i.test(release.tag_name + ' ' + release.name + ' ' + release.assets.map(function(a){return a.name;}).join(' '))))) return false;
    if (app.releaseFilter === 'colombo' && !/colombo/i.test(release.tag_name + ' ' + release.name + ' ' + release.assets.map(function(a){return a.name;}).join(' '))) return false;
    if (app.releaseFilter === 'coast' && !/coast/i.test(release.tag_name + ' ' + release.name)) return false;
    return release.assets.some(function (asset) { return platformOf({ name: asset.name }); });
  }
  function extractRelease(app, data) {
    if (!Array.isArray(data)) return null;
    var candidates = data.filter(function (release) { return relevantRelease(app, release); });
    // Resolve each platform independently: an APK-only update must not hide a
    // previous Windows build, and vice versa. Prefer stable files for each.
    var selected = ['Android', 'Windows'].map(function (platform) {
      var matching = candidates.filter(function (release) {
        return release.assets.some(function (asset) {
          return platformOf(asset) === platform && githubUrl(asset.browser_download_url);
        });
      });
      var stable = matching.filter(function (r) { return !r.prerelease; });
      var pool = stable.length ? stable : matching;
      pool.sort(function (a, b) {
        return new Date(b.published_at || 0).getTime() - new Date(a.published_at || 0).getTime();
      });
      return pool[0] ? { platform: platform, release: pool[0] } : null;
    }).filter(Boolean);
    if (!selected.length) return null;
    var assets = [];
    selected.forEach(function (item) {
      item.release.assets.forEach(function (a) {
        if (platformOf(a) !== item.platform || !githubUrl(a.browser_download_url)) return;
        assets.push({
          name: a.name,
          url: a.browser_download_url,
          tag: item.release.tag_name,
          prerelease: !!item.release.prerelease
        });
      });
    });
    selected.sort(function (a, b) {
      return new Date(b.release.published_at || 0).getTime() - new Date(a.release.published_at || 0).getTime();
    });
    var lead = selected[0].release;
    return {
      tag: lead.tag_name,
      date: lead.published_at,
      prerelease: selected.some(function (item) { return item.release.prerelease; }),
      releaseUrl: githubUrl(lead.html_url || ''),
      assets: assets
    };
  }
  async function refreshReleases() {
    var cached = getCached();
    if (cached && cached.values && cached.time) {
      apps.forEach(function (a) { if (!a.comingSoon && cached.values[a.id]) a.release = cached.values[a.id]; });
      if (Date.now() - cached.time < FIVE_MINUTES) {
        sourceStatus = 'Auto-updated · checks every 5 minutes';
        render();
        return;
      }
    }

    var publicApps = apps.filter(function (a) { return !a.comingSoon && !a.private && !a.sourceOnly; });
    var updated = {};
    var synced = 0;
    await Promise.all(publicApps.map(async function (app) {
      try {
        var response = await fetch('https://api.github.com/repos/' + OWNER + '/' + app.repo + '/releases?per_page=100', {
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
      sourceStatus = synced === publicApps.length ? 'Auto-updated from GitHub Releases' : 'GitHub releases · backup links available';
      setCached(updated);
    } else {
      sourceStatus = 'Verified release links · GitHub check unavailable';
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
  grid.addEventListener('error', function (e) {
    if (e.target.classList.contains('poster-icon')) e.target.classList.add('is-broken');
  }, true);
  modal.addEventListener('error', function (e) {
    if (e.target.classList.contains('modal-icon-img')) e.target.classList.add('is-broken');
  }, true);
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