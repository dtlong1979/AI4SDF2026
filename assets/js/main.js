/* =====================================================================
   AI4SDF 2026 — interaction layer
   No dependencies. Everything degrades gracefully without JS.
   ===================================================================== */
(function () {
  'use strict';

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     CONFIGURATION — edit these when the schedule changes
     ------------------------------------------------------------------ */
  var CONFERENCE_START = '2026-12-12T08:30:00+07:00';

  /* ------------------------------------------------------------------
     1. Sticky nav, mobile menu, scroll progress, scroll-spy
     ------------------------------------------------------------------ */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var navLinks = document.getElementById('nav-links');
  var progress = document.getElementById('nav-progress');
  var links = navLinks ? Array.prototype.slice.call(navLinks.querySelectorAll('a')) : [];
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  function closeMenu() {
    if (!navLinks) return;
    navLinks.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
  }

  if (burger) {
    burger.addEventListener('click', function () {
      var open = navLinks.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    links.forEach(function (a) { a.addEventListener('click', closeMenu); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1080) closeMenu();
    });
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      var y = window.scrollY || window.pageYOffset;

      if (nav) nav.classList.toggle('is-stuck', y > 24);

      if (progress) {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = (max > 0 ? Math.min(1, y / max) * 100 : 0) + '%';
      }

      // scroll-spy: the section whose top has most recently passed the nav line
      var line = y + (nav ? nav.offsetHeight : 0) + 80;
      var current = null;
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].offsetTop <= line) current = sections[i];
      }
      // last section wins when the page is scrolled to the very bottom
      if (y + window.innerHeight >= document.documentElement.scrollHeight - 4) {
        current = sections[sections.length - 1] || current;
      }
      links.forEach(function (a) {
        a.classList.toggle('is-active', !!current && a.getAttribute('href') === '#' + current.id);
      });

      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------------------------------
     2. Reveal on scroll
     ------------------------------------------------------------------ */
  var revealables = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window) || REDUCED) {
    Array.prototype.forEach.call(revealables, function (el) { el.classList.add('is-in'); });
  } else {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.style.transitionDelay = Math.min(i * 70, 280) + 'ms';
        el.classList.add('is-in');
        revealer.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    Array.prototype.forEach.call(revealables, function (el) { revealer.observe(el); });

    // Safety net: content must never stay invisible. If the observer has not
    // reported anything shortly after load, reveal whatever is already on screen.
    window.setTimeout(function () {
      Array.prototype.forEach.call(revealables, function (el) {
        if (el.classList.contains('is-in')) return;
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add('is-in');
          revealer.unobserve(el);
        }
      });
    }, 1600);
  }

  /* ------------------------------------------------------------------
     3. Countdown to the opening session
     ------------------------------------------------------------------ */
  var countdown = document.getElementById('countdown');
  if (countdown) {
    var target = new Date(CONFERENCE_START).getTime();
    var fields = {
      d: countdown.querySelector('[data-cd="d"]'),
      h: countdown.querySelector('[data-cd="h"]'),
      m: countdown.querySelector('[data-cd="m"]'),
      s: countdown.querySelector('[data-cd="s"]')
    };
    var note = countdown.querySelector('.countdown__note');

    var pad = function (n) { return (n < 10 ? '0' : '') + n; };

    var tick = function () {
      var diff = target - Date.now();
      if (diff <= 0) {
        fields.d.textContent = fields.h.textContent = fields.m.textContent = fields.s.textContent = '00';
        countdown.classList.add('is-past');
        if (note) note.textContent = 'The conference is under way — welcome to AI4SDF 2026';
        clearInterval(timer);
        return;
      }
      var s = Math.floor(diff / 1000);
      fields.d.textContent = pad(Math.floor(s / 86400));
      fields.h.textContent = pad(Math.floor(s / 3600) % 24);
      fields.m.textContent = pad(Math.floor(s / 60) % 60);
      fields.s.textContent = pad(s % 60);
    };
    tick();
    var timer = setInterval(tick, 1000);
  }

  /* ------------------------------------------------------------------
     4. Timeline status — mark past milestones and the next one
     ------------------------------------------------------------------ */
  var milestones = Array.prototype.slice.call(document.querySelectorAll('.tl[data-date]'));
  if (milestones.length) {
    var now = Date.now();
    var nextFound = false;
    milestones.forEach(function (li) {
      var when = new Date(li.getAttribute('data-date')).getTime();
      var badge = li.querySelector('.tl__badge');
      if (when < now) {
        li.classList.add('is-past');
        if (badge) badge.innerHTML = '<span class="b-past">Closed</span>';
      } else if (!nextFound) {
        nextFound = true;
        li.classList.add('is-next');
        var days = Math.ceil((when - now) / 86400000);
        if (badge) {
          badge.innerHTML = '<span class="b-next">Next · ' +
            (days > 1 ? days + ' days left' : days === 1 ? '1 day left' : 'today') + '</span>';
        }
      }
    });
  }

  /* ------------------------------------------------------------------
     5. Count-up for the statistics block
     ------------------------------------------------------------------ */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window && !REDUCED) {
    var countObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var to = parseInt(el.getAttribute('data-count'), 10);
        var started = null;
        var DURATION = 1400;
        var step = function (t) {
          if (started === null) started = t;
          var p = Math.min(1, (t - started) / DURATION);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = String(Math.round(to * eased));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        countObs.unobserve(el);
      });
    }, { threshold: 0.5 });
    Array.prototype.forEach.call(counters, function (el) { countObs.observe(el); });
  }

  /* ------------------------------------------------------------------
     6. Shared canvas helpers
     ------------------------------------------------------------------ */
  var HERO = document.querySelector('.hero');
  var AURORA = [[34, 211, 238], [52, 211, 153], [139, 124, 246]];

  // Position along the cyan -> emerald -> violet ramp, 0..1.
  function tint(t) {
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    var seg = t < 0.5 ? 0 : 1;
    var local = t < 0.5 ? t / 0.5 : (t - 0.5) / 0.5;
    var a = AURORA[seg], b = AURORA[seg + 1];
    return [
      Math.round(a[0] + (b[0] - a[0]) * local),
      Math.round(a[1] + (b[1] - a[1]) * local),
      Math.round(a[2] + (b[2] - a[2]) * local)
    ];
  }
  function rgba(c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }

  // Keeps a canvas backing store in step with its CSS box. Layout is not always
  // settled on the first run (web fonts, hidden tab), so a zero-sized box retries
  // rather than being locked in.
  function fitCanvas(canvas, onResize) {
    var ctx = canvas.getContext('2d');
    var state = { ctx: ctx, w: 0, h: 0, dpr: 1 };
    function apply() {
      var r = canvas.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) {
        // Hidden by CSS (the focal object is display:none on narrow screens):
        // wait for the observer to report a box instead of spinning on rAF.
        if (canvas.offsetParent !== null) requestAnimationFrame(apply);
        return;
      }
      state.dpr = Math.min(window.devicePixelRatio || 1, 2);
      state.w = r.width;
      state.h = r.height;
      canvas.width = Math.round(state.w * state.dpr);
      canvas.height = Math.round(state.h * state.dpr);
      ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
      if (onResize) onResize(state);
    }
    var timer;
    function schedule() { clearTimeout(timer); timer = setTimeout(apply, 160); }
    window.addEventListener('resize', schedule);
    window.addEventListener('load', schedule);
    if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(canvas);
    // Deferred by one frame: callers assign the returned state to a variable that
    // onResize closes over, so it must exist before the first callback fires.
    requestAnimationFrame(apply);
    return state;
  }

  // Runs `step` every frame, but only while the hero is on screen and the tab is
  // visible — an animation nobody is looking at is wasted battery.
  function runWhileVisible(step) {
    if (REDUCED) return;
    var id = null, running = false;
    function frame() { step(); id = requestAnimationFrame(frame); }
    function start() { if (!running) { running = true; id = requestAnimationFrame(frame); } }
    function stop() { if (running) { running = false; cancelAnimationFrame(id); } }

    if ('IntersectionObserver' in window && HERO) {
      new IntersectionObserver(function (entries) {
        entries[0].isIntersecting ? start() : stop();
      }, { threshold: 0 }).observe(HERO);
    }
    document.addEventListener('visibilitychange', function () {
      document.hidden ? stop() : start();
    });
    start();
  }

  /* ------------------------------------------------------------------
     6a. Hero background — drifting node network with an aurora tint
     ------------------------------------------------------------------ */
  var canvas = document.getElementById('neural');
  if (canvas && canvas.getContext) {
    var N = fitCanvas(canvas, seed);
    var nctx = N.ctx;
    var nodes = [];
    var LINK_DIST = 150;
    var pointer = { x: -9999, y: -9999, active: false };

    function seed() {
      LINK_DIST = N.w < 640 ? 110 : 150;
      var count = Math.max(28, Math.min(96, Math.round(N.w * N.h / 17000)));
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * N.w,
          y: Math.random() * N.h,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          r: Math.random() * 1.5 + 0.7
        });
      }
      drawNeural();
    }

    function drawNeural() {
      nctx.clearRect(0, 0, N.w, N.h);

      // links first, so nodes sit on top
      for (var i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++) {
          var dx = nodes[i].x - nodes[j].x;
          var dy = nodes[i].y - nodes[j].y;
          var d2 = dx * dx + dy * dy;
          if (d2 > LINK_DIST * LINK_DIST) continue;
          var d = Math.sqrt(d2);
          var c = tint(((nodes[i].x + nodes[j].x) / 2) / N.w);
          nctx.strokeStyle = rgba(c, ((1 - d / LINK_DIST) * 0.3).toFixed(3));
          nctx.lineWidth = 0.7;
          nctx.beginPath();
          nctx.moveTo(nodes[i].x, nodes[i].y);
          nctx.lineTo(nodes[j].x, nodes[j].y);
          nctx.stroke();
        }
      }

      for (var k = 0; k < nodes.length; k++) {
        var p = nodes[k];
        nctx.fillStyle = rgba(tint(p.x / N.w), 0.8);
        nctx.beginPath();
        nctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        nctx.fill();
      }
    }

    if (!REDUCED) {
      window.addEventListener('pointermove', function (e) {
        if (!HERO) return;
        var rect = HERO.getBoundingClientRect();
        pointer.active = e.clientY >= rect.top && e.clientY <= rect.bottom;
        pointer.x = e.clientX - rect.left;
        pointer.y = e.clientY - rect.top;
      }, { passive: true });
      window.addEventListener('pointerleave', function () { pointer.active = false; });
    }

    runWhileVisible(function () {
      for (var i = 0; i < nodes.length; i++) {
        var p = nodes[i];
        p.x += p.vx;
        p.y += p.vy;

        if (pointer.active) {
          var dx = p.x - pointer.x;
          var dy = p.y - pointer.y;
          var d2 = dx * dx + dy * dy;
          if (d2 < 16000 && d2 > 0.5) {
            var f = (1 - d2 / 16000) * 0.5;
            var d = Math.sqrt(d2);
            p.x += (dx / d) * f;
            p.y += (dy / d) * f;
          }
        }

        if (p.x < -20) p.x = N.w + 20;
        if (p.x > N.w + 20) p.x = -20;
        if (p.y < -20) p.y = N.h + 20;
        if (p.y > N.h + 20) p.y = -20;
      }
      drawNeural();
    });
  }

  /* ------------------------------------------------------------------
     6b. Hero focal object — a slowly rotating wireframe globe with data
         arcs radiating from Hanoi. Says "international conference" in a
         picture. Decorative only; the markup carries aria-hidden.
     ------------------------------------------------------------------ */
  var globeEl = document.getElementById('globe');
  if (globeEl && globeEl.getContext) {

    // [latitude, longitude] — Hanoi first; the arcs all start there.
    var CITIES = [
      [21.03, 105.85],  [14.60, 120.98], [3.14, 101.69],  [1.35, 103.82],
      [13.75, 100.50],  [-6.21, 106.85], [35.68, 139.69], [37.57, 126.98],
      [39.90, 116.41],  [28.61, 77.21],  [25.20, 55.27],  [41.01, 28.98],
      [55.76, 37.62],   [52.52, 13.40],  [48.86, 2.35],   [51.51, -0.13],
      [30.04, 31.24],   [-1.29, 36.82],  [-26.20, 28.05], [40.71, -74.01],
      [43.65, -79.38],  [37.77, -122.42],[19.43, -99.13], [-23.55, -46.63],
      [-34.60, -58.38], [-33.87, 151.21]
    ];
    var ARC_TO = [1, 2, 6, 9, 13, 15, 17, 19, 21, 23, 25];

    var G = fitCanvas(globeEl, build);
    var gctx = G.ctx;
    var R = 0, CX = 0, CY = 0, CAM = 0, ramp = null;
    var wireLines = [], orbit = [], marks = [], arcs = [];
    var badge = { x: 0, y: 0, r: 0 }, fsName = 0, fsSub = 0;

    var yaw = -105.85 * Math.PI / 180;   // opens with Hanoi facing the reader
    var TILT = -0.42;
    var tick = 0;

    var houLogo = new Image();
    var houReady = false;
    houLogo.onload = function () { houReady = true; draw(); };
    houLogo.src = 'assets/img/hou-logo.png';

    function sph(latDeg, lonDeg) {
      var la = latDeg * Math.PI / 180, lo = lonDeg * Math.PI / 180;
      return { x: Math.cos(la) * Math.sin(lo), y: -Math.sin(la), z: Math.cos(la) * Math.cos(lo) };
    }

    // Great-circle path between two unit vectors, lifted off the surface so the
    // arc reads as a connection rather than a border.
    function greatCircle(a, b, steps) {
      var dot = Math.max(-1, Math.min(1, a.x * b.x + a.y * b.y + a.z * b.z));
      var omega = Math.acos(dot), so = Math.sin(omega);
      var pts = [];
      for (var i = 0; i <= steps; i++) {
        var t = i / steps;
        var w1 = so < 1e-6 ? 1 - t : Math.sin((1 - t) * omega) / so;
        var w2 = so < 1e-6 ? t : Math.sin(t * omega) / so;
        var lift = 1 + 0.34 * Math.sin(Math.PI * t) * (omega / Math.PI);
        pts.push({
          x: (a.x * w1 + b.x * w2) * lift,
          y: (a.y * w1 + b.y * w2) * lift,
          z: (a.z * w1 + b.z * w2) * lift
        });
      }
      return pts;
    }

    function build() {
      var size = Math.min(G.w, G.h);
      R = size * 0.315;
      CX = G.w / 2;
      CY = G.h * 0.42;        // lifted, leaving the foot of the box for the badge
      CAM = R * 3.4;

      // The host lockup floats at the centre of the globe. It cannot ride the
      // Hanoi node itself: with the globe turning, that node swings to the far
      // side and takes the label with it — and pinning the spin axis at Hanoi to
      // hold it still would reduce the rotation to a flat 2D spin of the image.
      badge.r = Math.max(26, size * 0.112);
      badge.x = CX;
      badge.y = CY - size * 0.045;
      fsName = Math.max(13, size * 0.038);
      fsSub = Math.max(8.5, size * 0.022);

      ramp = gctx.createLinearGradient(CX - R, CY - R, CX + R, CY + R);
      ramp.addColorStop(0, 'rgb(34,211,238)');
      ramp.addColorStop(0.5, 'rgb(52,211,153)');
      ramp.addColorStop(1, 'rgb(139,124,246)');

      wireLines = [];
      for (var lat = -60; lat <= 60; lat += 20) {
        var ring = [];
        for (var lon = 0; lon <= 360; lon += 7.5) ring.push(sph(lat, lon));
        wireLines.push(ring);
      }
      for (var lon2 = 0; lon2 < 360; lon2 += 30) {
        var mer = [];
        for (var la2 = -90; la2 <= 90; la2 += 7.5) mer.push(sph(la2, lon2));
        wireLines.push(mer);
      }

      var inc = 0.55;
      orbit = [];
      for (var a = 0; a <= 360; a += 4) {
        var t = a * Math.PI / 180;
        orbit.push({
          x: Math.cos(t) * 1.32,
          y: Math.sin(t) * 1.32 * Math.sin(inc),
          z: Math.sin(t) * 1.32 * Math.cos(inc)
        });
      }

      marks = CITIES.map(function (c) { return sph(c[0], c[1]); });
      arcs = ARC_TO.map(function (i) { return greatCircle(marks[0], marks[i], 46); });

      draw();
      // canvas text falls back until the web fonts land, so draw once more after
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
    }

    // A small Vietnamese flag planted on the host city. It turns away with the
    // globe, which is fine — this is a marker on the map, not a label.
    function drawFlag(p, depth) {
      var size = Math.min(G.w, G.h);
      // Hanoi projects almost exactly onto the centre of the disc when it is
      // facing us, so the flag also fades as it closes on the host lockup.
      var byDepth = Math.max(0, Math.min(1, (depth - 0.34) / 0.16));
      var gap = Math.sqrt((p.x - badge.x) * (p.x - badge.x) + (p.y - badge.y) * (p.y - badge.y));
      var byGap = Math.max(0, Math.min(1, (gap - badge.r - size * 0.02) / (size * 0.05)));
      var vis = byDepth * byGap;
      if (vis <= 0.01) return;

      var h = size * 0.036 * (0.86 + 0.14 * depth);   // a touch bigger up close
      var w = h * 1.5;                                 // the flag is 3:2
      var fx = p.x - w / 2, fy = p.y - h / 2;          // centred on the node

      gctx.globalAlpha = vis;
      gctx.fillStyle = '#DA251D';
      gctx.fillRect(fx, fy, w, h);
      gctx.strokeStyle = 'rgba(255,255,255,.45)';      // lifts it off the wireframe
      gctx.lineWidth = 1;
      gctx.strokeRect(fx + 0.5, fy + 0.5, w - 1, h - 1);

      var cx = fx + w / 2, cy = fy + h / 2, r1 = h * 0.34, r2 = r1 * 0.382;
      gctx.fillStyle = '#FFFF00';
      gctx.beginPath();
      for (var i = 0; i < 10; i++) {
        var rr = i % 2 ? r2 : r1;
        var a = -Math.PI / 2 + i * Math.PI / 5;
        var sx = cx + Math.cos(a) * rr, sy = cy + Math.sin(a) * rr;
        i ? gctx.lineTo(sx, sy) : gctx.moveTo(sx, sy);
      }
      gctx.closePath();
      gctx.fill();

      gctx.globalAlpha = 1;
    }

    // The host lockup: the university mark on a light disc, floating at the
    // centre of the turning globe with the name set beneath it.
    function drawBadge() {
      var size = Math.min(G.w, G.h);

      // a soft well behind the lockup so the wireframe does not fight the type
      var scrim = gctx.createRadialGradient(
        badge.x, badge.y + size * 0.03, badge.r * 0.6,
        badge.x, badge.y + size * 0.03, size * 0.36);
      scrim.addColorStop(0, 'rgba(4,7,14,.72)');
      scrim.addColorStop(0.55, 'rgba(4,7,14,.5)');
      scrim.addColorStop(1, 'rgba(4,7,14,0)');
      gctx.fillStyle = scrim;
      gctx.beginPath();
      gctx.arc(badge.x, badge.y + size * 0.03, size * 0.36, 0, Math.PI * 2);
      gctx.fill();

      // halo, so the disc lifts off the sphere rather than sitting flat on it
      var halo = gctx.createRadialGradient(
        badge.x, badge.y, badge.r * 0.85, badge.x, badge.y, badge.r * 2.1);
      halo.addColorStop(0, 'rgba(52,211,153,.30)');
      halo.addColorStop(1, 'rgba(52,211,153,0)');
      gctx.fillStyle = halo;
      gctx.beginPath();
      gctx.arc(badge.x, badge.y, badge.r * 2.1, 0, Math.PI * 2);
      gctx.fill();

      gctx.fillStyle = 'rgba(255,255,255,.98)';
      gctx.beginPath();
      gctx.arc(badge.x, badge.y, badge.r, 0, Math.PI * 2);
      gctx.fill();

      gctx.strokeStyle = ramp;
      gctx.lineWidth = 1.5;
      gctx.globalAlpha = 0.85;
      gctx.beginPath();
      gctx.arc(badge.x, badge.y, badge.r + 4, 0, Math.PI * 2);
      gctx.stroke();
      gctx.globalAlpha = 1;

      if (houReady) {
        var lh = badge.r * 1.52;
        var lw = lh * (houLogo.naturalWidth / houLogo.naturalHeight);
        gctx.drawImage(houLogo, badge.x - lw / 2, badge.y - lh / 2, lw, lh);
      }

      gctx.textAlign = 'center';
      gctx.textBaseline = 'alphabetic';
      gctx.fillStyle = '#F2F7FD';
      gctx.font = '600 ' + fsName.toFixed(1) + 'px Sora, "Segoe UI", system-ui, sans-serif';
      gctx.fillText('Hanoi Open University', badge.x, badge.y + badge.r + fsName * 1.5);
      gctx.textAlign = 'left';

      // the sub-line is letterspaced by hand so it holds in every browser
      gctx.fillStyle = '#8FA5C0';
      gctx.font = '400 ' + fsSub.toFixed(1) + 'px "JetBrains Mono", ui-monospace, monospace';
      var sub = 'HOST INSTITUTION · HANOI, VIETNAM';
      var gap = fsSub * 0.16, total = -gap;
      for (var i = 0; i < sub.length; i++) total += gctx.measureText(sub.charAt(i)).width + gap;
      var lx = badge.x - total / 2;
      var ly = badge.y + badge.r + fsName * 1.5 + fsSub * 2;
      for (var j = 0; j < sub.length; j++) {
        gctx.fillText(sub.charAt(j), lx, ly);
        lx += gctx.measureText(sub.charAt(j)).width + gap;
      }
    }

    function project(p) {
      var cy = Math.cos(yaw), sy = Math.sin(yaw);
      var x = p.x * cy + p.z * sy;
      var z = -p.x * sy + p.z * cy;
      var ct = Math.cos(TILT), st = Math.sin(TILT);
      var y2 = p.y * ct - z * st;
      var z2 = p.y * st + z * ct;
      var f = CAM / (CAM - z2 * R);
      return { x: CX + x * R * f, y: CY + y2 * R * f, z: z2 };
    }

    // Segments are bucketed by depth so the whole wireframe costs a handful of
    // strokes per frame instead of one per segment.
    var DEPTH_BANDS = 6;
    function newBuckets() {
      var b = [];
      for (var i = 0; i < DEPTH_BANDS; i++) b.push(new Path2D());
      return b;
    }
    function addSegment(buckets, p, q) {
      var depth = (p.z + q.z) / 2;
      var k = Math.round(((depth + 1) / 2) * (DEPTH_BANDS - 1));
      k = k < 0 ? 0 : k > DEPTH_BANDS - 1 ? DEPTH_BANDS - 1 : k;
      buckets[k].moveTo(p.x, p.y);
      buckets[k].lineTo(q.x, q.y);
    }
    function addLine(buckets, points) {
      var proj = [];
      for (var i = 0; i < points.length; i++) proj.push(project(points[i]));
      for (var j = 0; j < proj.length - 1; j++) addSegment(buckets, proj[j], proj[j + 1]);
    }
    function strokeBand(buckets, base, width, from, to) {
      gctx.strokeStyle = ramp;
      gctx.lineWidth = width;
      for (var i = from; i <= to; i++) {
        gctx.globalAlpha = base * (0.12 + 0.88 * (i / (DEPTH_BANDS - 1)));
        gctx.stroke(buckets[i]);
      }
      gctx.globalAlpha = 1;
    }

    function draw() {
      if (!R) return;
      gctx.clearRect(0, 0, G.w, G.h);

      var glow = gctx.createRadialGradient(CX, CY, R * 0.15, CX, CY, R * 1.75);
      glow.addColorStop(0, 'rgba(34,211,238,.23)');
      glow.addColorStop(0.45, 'rgba(52,211,153,.12)');
      glow.addColorStop(1, 'rgba(4,7,14,0)');
      gctx.fillStyle = glow;
      gctx.beginPath();
      gctx.arc(CX, CY, R * 1.75, 0, Math.PI * 2);
      gctx.fill();

      var wire = newBuckets(), ring = newBuckets(), path = newBuckets();
      var i;
      for (i = 0; i < wireLines.length; i++) addLine(wire, wireLines[i]);
      addLine(ring, orbit);
      for (i = 0; i < arcs.length; i++) addLine(path, arcs[i]);

      // far hemisphere
      strokeBand(wire, 0.34, 1, 0, 2);
      strokeBand(ring, 0.48, 1.1, 0, 2);
      strokeBand(path, 0.60, 1.2, 0, 2);

      // the body of the globe, which occludes everything behind it
      var body = gctx.createRadialGradient(CX - R * 0.3, CY - R * 0.35, R * 0.1, CX, CY, R * 1.05);
      body.addColorStop(0, 'rgba(9,17,30,.74)');
      body.addColorStop(1, 'rgba(4,7,14,.93)');
      gctx.fillStyle = body;
      gctx.beginPath();
      gctx.arc(CX, CY, R * 1.004, 0, Math.PI * 2);
      gctx.fill();

      // the silhouette, which gives the sphere a hard edge against the glow
      gctx.globalAlpha = 0.38;
      gctx.strokeStyle = ramp;
      gctx.lineWidth = 1;
      gctx.beginPath();
      gctx.arc(CX, CY, R, 0, Math.PI * 2);
      gctx.stroke();
      gctx.globalAlpha = 1;

      // near hemisphere
      strokeBand(wire, 0.46, 1, 3, 5);
      strokeBand(ring, 0.58, 1.1, 3, 5);
      strokeBand(path, 1, 1.4, 3, 5);

      // a packet running along each arc
      for (i = 0; i < arcs.length; i++) {
        var arc = arcs[i];
        var t = ((tick * 0.0030) + i / arcs.length) % 1;
        var pk = project(arc[Math.floor(t * (arc.length - 1))]);
        var dp = (pk.z + 1) / 2;
        var pc = tint((pk.x - (CX - R)) / (2 * R));
        gctx.fillStyle = rgba(pc, 1);
        gctx.globalAlpha = (0.2 + 0.8 * dp) * 0.28;
        gctx.beginPath();
        gctx.arc(pk.x, pk.y, 5.5 + dp * 3, 0, Math.PI * 2);
        gctx.fill();
        gctx.globalAlpha = 0.25 + 0.75 * dp;
        gctx.beginPath();
        gctx.arc(pk.x, pk.y, 1.9 + dp * 1.1, 0, Math.PI * 2);
        gctx.fill();
        gctx.globalAlpha = 1;
      }

      // city markers; the host city gets a pulsing ring
      for (i = 0; i < marks.length; i++) {
        var m = project(marks[i]);
        var d = (m.z + 1) / 2;
        if (d < 0.2) continue;
        var mc = tint((m.x - (CX - R)) / (2 * R));
        var r = (i === 0 ? 3.2 : 1.5) + d * 1.5;
        gctx.fillStyle = rgba(mc, 1);
        gctx.globalAlpha = 0.18 + 0.82 * d;
        gctx.beginPath();
        gctx.arc(m.x, m.y, r, 0, Math.PI * 2);
        gctx.fill();

        if (i === 0) {
          var pulse = (tick % 170) / 170;
          gctx.globalAlpha = (1 - pulse) * 0.55 * d;
          gctx.strokeStyle = rgba(mc, 1);
          gctx.lineWidth = 1.2;
          gctx.beginPath();
          gctx.arc(m.x, m.y, r + pulse * 24, 0, Math.PI * 2);
          gctx.stroke();
        }
        gctx.globalAlpha = 1;
      }

      drawBadge();

      // drawn last so the host city stays readable over the lockup's scrim
      var hub = project(marks[0]);
      drawFlag(hub, (hub.z + 1) / 2);
    }

    runWhileVisible(function () {
      if (!R) return;              // not laid out yet, or hidden on a narrow screen
      tick++;
      yaw += 0.0015;                                  // one revolution per ~70s
      TILT = -0.42 + Math.sin(tick * 0.0019) * 0.05;  // a slow bob, so it breathes
      draw();
    });
  }

  /* ------------------------------------------------------------------
     7. Tracks — open the first one on wide screens as an affordance
     ------------------------------------------------------------------ */
  var firstTrack = document.querySelector('.track');
  if (firstTrack && window.innerWidth > 720) firstTrack.open = true;

})();
