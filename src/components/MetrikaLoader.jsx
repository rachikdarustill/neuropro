'use client';
import { useEffect } from 'react';

// Ported from the production consent-gated Yandex.Metrika loader.
// Loads mc.yandex.ru/metrika/tag.js ONLY after the user consents to analytics
// cookies (localStorage npp_cookie_consent.analytics === true).
const COUNTER = 110108098;

export default function MetrikaLoader() {
  useEffect(() => {
    function analyticsConsented() {
      try {
        const v = JSON.parse(localStorage.getItem('npp_cookie_consent') || 'null');
        return !!(v && v.analytics);
      } catch (e) { return false; }
    }
    function loadMetrika() {
      if (window.__ymLoaded) return;
      window.__ymLoaded = true;
      (function (m, e, t, r, i) {
        m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
        m[i].l = 1 * new Date();
        for (let j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) { return; } }
        const k = e.createElement(t); const a = e.getElementsByTagName(t)[0];
        k.async = 1; k.src = r; a.parentNode.insertBefore(k, a);
      })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=' + COUNTER, 'ym');
      window.ym(COUNTER, 'init', { ssr: true, webvisor: true, clickmap: true, ecommerce: 'dataLayer', accurateTrackBounce: true, trackLinks: true });
    }

    if (analyticsConsented()) { loadMetrika(); return; }
    const onChange = () => { if (analyticsConsented()) loadMetrika(); };
    window.addEventListener('npp:consent-changed', onChange);
    const iv = setInterval(() => { if (analyticsConsented()) { clearInterval(iv); loadMetrika(); } }, 600);
    return () => { window.removeEventListener('npp:consent-changed', onChange); clearInterval(iv); };
  }, []);

  return null;
}
