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

  // ---- Footer year ----
  var year = String(new Date().getFullYear());
  document.querySelectorAll('[data-year]').forEach(function (node) { node.textContent = year; });
})();
