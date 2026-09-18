/* ==========================================================================
   Výukové aplikace — přepínání světlého a tmavého režimu
   Volba se ukládá do localStorage a platí napříč všemi stránkami.
   Skript, který brání probliknutí, je vložen přímo v <head> každé stránky.
   ========================================================================== */
(function () {
  'use strict';

  var STORAGE_KEY = 'va-theme';

  function stored() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function systemPrefersDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  /** Aktuálně vykreslený režim ('light' | 'dark'). */
  function current() {
    var explicit = document.documentElement.getAttribute('data-theme');
    if (explicit === 'light' || explicit === 'dark') return explicit;
    return systemPrefersDark() ? 'dark' : 'light';
  }

  function apply(theme, persist) {
    document.documentElement.setAttribute('data-theme', theme);
    if (persist !== false) {
      try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) { /* soukromý režim */ }
    }

    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#191919' : '#ffffff');

    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      btn.setAttribute('title', theme === 'dark' ? 'Přepnout na světlý režim' : 'Přepnout na tmavý režim');
    });

    // Prvky kreslené do <canvas> nebo JS si musí barvy přepočítat samy.
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: theme } }));
  }

  function toggle() {
    apply(current() === 'dark' ? 'light' : 'dark');
  }

  /** Vrátí hodnotu CSS proměnné — pro kreslení do canvasu. */
  function token(name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback || '';
  }

  function init() {
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.addEventListener('click', toggle);
    });
    apply(current(), false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Sleduj změnu systémového nastavení, dokud si uživatel nevybral ručně.
  if (window.matchMedia && !stored()) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var onChange = function () { if (!stored()) apply(systemPrefersDark() ? 'dark' : 'light', false); };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  window.VATheme = { current: current, apply: apply, toggle: toggle, token: token };
})();
