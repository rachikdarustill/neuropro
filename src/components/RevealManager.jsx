'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Ported verbatim from componentDidMount/checkReveal/forceCheck/revealAll.
// Reveals every [data-reveal] element as it scrolls into view; re-scans on
// route change so newly-mounted pages animate in the same way.
export default function RevealManager() {
  const pathname = usePathname();

  useEffect(() => {
    function checkReveal() {
      const vh = window.innerHeight || 800;
      document.querySelectorAll('[data-reveal]').forEach((e) => {
        if (e.hasAttribute('data-shown')) return;
        const r = e.getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > -40) {
          e.setAttribute('data-shown', '');
          e.dataset.shownAt = String(Date.now());
        }
      });
    }
    function forceCheck() {
      const now = Date.now();
      document.querySelectorAll('[data-reveal][data-shown]').forEach((e) => {
        if (e.hasAttribute('data-force')) return;
        const t = parseInt(e.dataset.shownAt || '0', 10);
        if (now - t > 1200 && parseFloat(getComputedStyle(e).opacity) < 0.9) {
          e.setAttribute('data-force', '');
        }
      });
    }
    function revealAll() {
      document.querySelectorAll('[data-reveal]').forEach((e) => {
        if (!e.hasAttribute('data-shown')) {
          e.setAttribute('data-shown', '');
          e.dataset.shownAt = String(Date.now());
        }
      });
    }

    const onScroll = () => checkReveal();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    window.scrollTo({ top: 0 });
    const t1 = setTimeout(checkReveal, 400);
    const t2 = setTimeout(checkReveal, 900);
    const t3 = setTimeout(checkReveal, 1100);
    const safety = setTimeout(revealAll, 2200);
    const force = setInterval(forceCheck, 500);
    checkReveal();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(safety);
      clearInterval(force);
    };
  }, [pathname]);

  return null;
}
