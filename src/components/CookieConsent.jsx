'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { cx } from '@/lib/style';
import { Hx } from '@/components/Hx';
import { NPP_COOKIES } from '@/lib/legal';

// Ported from initCookies/persistCookies/acceptAllCookies + the cookie banner markup.
// Consent is the gate for analytics (Yandex.Metrika) — see MetrikaLoader.
export default function CookieConsent() {
  const [decided, setDecided] = useState(true); // assume decided until we read storage (avoids SSR flash)

  useEffect(() => {
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem('npp_cookie_consent') || 'null'); } catch (e) {}
    setDecided(!!(saved && typeof saved === 'object'));
    const reopen = () => setDecided(false);
    window.addEventListener('npp:reopen-cookie', reopen);
    return () => window.removeEventListener('npp:reopen-cookie', reopen);
  }, []);

  function acceptAll() {
    const val = { essential: true, functional: true, analytics: true, ts: Date.now() };
    try { localStorage.setItem('npp_cookie_consent', JSON.stringify(val)); } catch (e) {}
    try { document.cookie = 'npp_cookie_consent=1;max-age=31536000;path=/;samesite=lax'; } catch (e) {}
    window.dispatchEvent(new Event('npp:consent-changed'));
    setDecided(true);
  }

  if (decided) return null;
  const bannerText = (NPP_COOKIES && NPP_COOKIES.bannerText) || '';

  return (
    <div style={cx('position:fixed;left:0;right:0;bottom:0;z-index:1500;display:flex;justify-content:center;padding:clamp(12px,2vw,24px);pointer-events:none;')}>
      <div style={cx('pointer-events:auto;background:#2F2F2F;color:#fff;border-radius:20px;max-width:880px;width:100%;padding:clamp(20px,2.2vw,26px) clamp(22px,2.5vw,30px);box-shadow:0 30px 70px -18px rgba(0,0,0,.55);display:flex;flex-wrap:wrap;align-items:center;gap:20px 28px;animation:npp_msg .4s cubic-bezier(.16,1,.3,1) both;')}>
        <div style={cx('display:flex;align-items:flex-start;gap:15px;flex:1;min-width:min(260px,100%);')}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.85)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={cx('flex:none;margin-top:1px;')}>
            <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5z" />
            <circle cx="9" cy="11" r="1" fill="rgba(255,255,255,.85)" stroke="none" />
            <circle cx="14" cy="15" r="1" fill="rgba(255,255,255,.85)" stroke="none" />
            <circle cx="15.5" cy="9.5" r="1" fill="rgba(255,255,255,.85)" stroke="none" />
          </svg>
          <p style={cx('margin:0;font-size:14.5px;line-height:1.6;color:rgba(255,255,255,.85);')}>
            {bannerText} Подробнее — в <Link href="/legal/cookie" style={cx('color:#fff;text-decoration:underline;cursor:pointer;')}>Политике использования cookie</Link>.
          </p>
        </div>
        <Hx as="button" type="button" onClick={acceptAll}
          s="font-family:inherit;cursor:pointer;flex:none;background:#fff;color:#2F2F2F;border:none;border-radius:14px;padding:13px 34px;font-size:14.5px;font-weight:700;transition:all .3s cubic-bezier(.16,1,.3,1);"
          sh="transform:translateY(-2px);box-shadow:0 12px 26px rgba(0,0,0,.3);">Принять</Hx>
      </div>
    </div>
  );
}
