(function () {
  'use strict';

  document.documentElement.classList.remove('no-js');

  // ---- Mobile navigation ----
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        setMenu(false);
        toggle.focus();
      }
    });
  }

  // ---- Inside the Cube: link photo markers and ingredient rows ----
  document.querySelectorAll('[data-spot]').forEach(function (spot) {
    var row = document.getElementById(spot.getAttribute('data-spot'));
    if (!row) return;
    var on = function () { row.classList.add('is-active'); spot.classList.add('is-active'); };
    var off = function () { row.classList.remove('is-active'); spot.classList.remove('is-active'); };
    spot.addEventListener('mouseenter', on);
    spot.addEventListener('mouseleave', off);
    spot.addEventListener('focus', on);
    spot.addEventListener('blur', off);
    row.addEventListener('mouseenter', on);
    row.addEventListener('mouseleave', off);
  });

  // ---- Newsletter sign-up ----
  // Set data-endpoint on the form (e.g. a Formspree or Mailchimp URL) to collect sign-ups.
  var form = document.querySelector('[data-signup]');
  if (form) {
    var status = form.querySelector('[data-status]');
    var showStatus = function (message) {
      status.textContent = message;
      status.hidden = false;
    };

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var endpoint = form.getAttribute('data-endpoint');
      if (!endpoint) {
        showStatus('Online sign-up opens soon. To join the list now, email hello@freshlycubed.com.');
        return;
      }
      var button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (response) {
          if (!response.ok) throw new Error('Sign-up failed with status ' + response.status);
          form.reset();
          showStatus('Thank you. You are on the list for Freshly Cubed news.');
        })
        .catch(function () {
          showStatus('We could not send your details. Please try again, or email hello@freshlycubed.com.');
        })
        .then(function () { button.disabled = false; });
    });
  }

  // ---- Motion infographics ----
  // One-shot graphics ([data-play-once]) play when they scroll into view.
  // Loops ([data-play-loop]) run only while on screen. CSS turns all motion off
  // for visitors who ask for reduced motion; the graphics then show their final frame.
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasObserver = 'IntersectionObserver' in window;

  function playGraphic(el) {
    el.classList.remove('is-playing');
    void el.getBoundingClientRect();
    el.classList.add('is-playing');
  }

  if (!reduceMotion && hasObserver) {
    var playOnce = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        playGraphic(entry.target);
        playOnce.unobserve(entry.target);
      });
    }, { threshold: 0.35 });
    document.querySelectorAll('[data-play-once]').forEach(function (el) { playOnce.observe(el); });
  }

  var loops = document.querySelectorAll('[data-play-loop]');
  if (hasObserver) {
    var watchLoop = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { entry.target.classList.toggle('is-visible', entry.isIntersecting); });
    }, { threshold: 0.2 });
    loops.forEach(function (el) { watchLoop.observe(el); });
  } else {
    loops.forEach(function (el) { el.classList.add('is-visible'); });
  }

  document.querySelectorAll('[data-replay]').forEach(function (button) {
    button.addEventListener('click', function () {
      var target = document.getElementById(button.getAttribute('data-replay'));
      if (target && !reduceMotion) playGraphic(target);
    });
  });

  document.querySelectorAll('[data-pause]').forEach(function (button) {
    var target = document.getElementById(button.getAttribute('data-pause'));
    if (!target) return;
    if (reduceMotion) { button.hidden = true; return; }
    button.addEventListener('click', function () {
      var paused = target.classList.toggle('is-paused');
      button.setAttribute('aria-pressed', String(paused));
      button.querySelector('span').textContent = paused ? 'Play' : 'Pause';
      button.querySelector('svg').innerHTML = paused ? '<path d="M8 5l11 7-11 7Z"/>' : '<path d="M9 6v12M15 6v12"/>';
    });
  });

  // ---- Inside the Cube: pairing map ----
  // Hover or pick an ingredient to trace its links. Until the visitor picks one,
  // the map steps through each ingredient once, then rests on the full map.
  var pairMap = document.getElementById('pmap');
  if (pairMap) {
    var filterButtons = document.querySelectorAll('.pmap-filters button');
    var mapKeys = ['oranges', 'lemons', 'ginger', 'turmeric', 'pepper'];
    var pinned = null;
    var tourTimer = null;

    var showFocus = function (key, isTour) {
      pairMap.classList.toggle('has-focus', !!key);
      pairMap.querySelectorAll('[data-k]').forEach(function (node) {
        node.classList.toggle('on', !!key && node.getAttribute('data-k').split(' ').indexOf(key) !== -1);
      });
      filterButtons.forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.getAttribute('data-focus') === pinned));
        b.classList.toggle('is-auto', !!isTour && b.getAttribute('data-focus') === key);
      });
    };
    var stopTour = function () {
      if (tourTimer) clearInterval(tourTimer);
      tourTimer = -1;
    };
    var startTour = function () {
      if (reduceMotion || tourTimer) return;
      var step = 0;
      tourTimer = setInterval(function () {
        if (step === mapKeys.length) { showFocus(null); stopTour(); return; }
        showFocus(mapKeys[step], true);
        step += 1;
      }, 2200);
    };
    var pin = function (key) {
      stopTour();
      pinned = pinned === key ? null : key;
      showFocus(pinned);
    };

    filterButtons.forEach(function (b) {
      b.addEventListener('click', function () { pin(b.getAttribute('data-focus')); });
    });
    pairMap.querySelectorAll('g[data-k]:not(.pill):not(.outg)').forEach(function (group) {
      var key = group.getAttribute('data-k');
      group.style.cursor = 'pointer';
      group.addEventListener('mouseenter', function () { stopTour(); showFocus(key); });
      group.addEventListener('mouseleave', function () { showFocus(pinned); });
      group.addEventListener('click', function () { pin(key); });
    });
    if (hasObserver) {
      var watchMap = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        setTimeout(startTour, 2800);
        watchMap.disconnect();
      }, { threshold: 0.5 });
      watchMap.observe(pairMap);
    }
  }

  // ---- Footer year ----
  var year = String(new Date().getFullYear());
  document.querySelectorAll('[data-year]').forEach(function (node) { node.textContent = year; });
})();
