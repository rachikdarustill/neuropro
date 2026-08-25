'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cx } from '@/lib/style';

const LOGO = (
  <svg viewBox="0 0 82 100" style={{ height: '100%', width: 'auto', flex: 'none', display: 'block' }} fill="#2F2F2F" aria-label="НейроПро+">
    <rect x="30" y="0" width="22" height="45" /><rect x="30" y="59" width="22" height="41" />
    <rect x="0" y="31" width="22" height="41" /><rect x="60" y="31" width="22" height="41" />
  </svg>
);

const navBtn = 'font-family:inherit;cursor:pointer;background:none;color:#2F2F2F;border:none;border-bottom:2px solid transparent;padding:4px 1px;font-size:16px;font-weight:700;letter-spacing:-.015em;display:flex;align-items:center;gap:7px;white-space:nowrap;transition:border-color .25s ease;text-decoration:none;';
const navArrow = 'font-size:14px;color:#5F5F5F;font-weight:700;transition:transform .25s ease,color .25s ease;';

const NAV = [
  { href: '/pricing', full: 'Стоимость услуг', short: 'Стоимость' },
  { href: '/analysis', full: 'Оценить эффект от ИИ', short: 'Эффект ИИ' },
  { href: '/cases', full: 'Реализованные кейсы', short: 'Кейсы' },
];

export default function Header() {
  const [sc, setSc] = useState(false);
  const pathname = usePathname();
  // Раздел кейсов подсвечен и на странице отдельного кейса.
  const isActive = (href) => pathname === href || pathname.startsWith(href + '/');
  useEffect(() => {
    const onScroll = () => setSc(window.scrollY > 36);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const hPad = sc ? '14px clamp(28px,4vw,64px)' : '34px clamp(28px,4vw,64px)';
  const hLogo = sc ? '44px' : '54px';
  const hBrand = sc ? '20px' : '24px';
  const hTagMax = sc ? '0px' : '26px';
  const hTagOp = sc ? '0' : '1';
  const hTagMt = sc ? '0px' : '5px';
  const hShadow = sc ? '0 8px 28px -14px rgba(0,0,0,.22)' : 'none';

  return (
    <header style={cx(`position:fixed;top:0;left:0;right:0;z-index:200;background:rgba(255,255,255,0.92);backdrop-filter:blur(12px) saturate(140%);-webkit-backdrop-filter:blur(12px) saturate(140%);border-bottom:1px solid #D0D0D0;transition:box-shadow .3s ease;box-shadow:${hShadow};`)}>
      <div style={{ ...cx('max-width:1440px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:24px;transition:padding .3s cubic-bezier(.16,1,.3,1);'), padding: hPad }}>
        <Link href="/" style={cx('display:flex;align-items:center;gap:18px;cursor:pointer;text-decoration:none;')}>
          <span style={{ height: hLogo, display: 'block', transition: 'height .3s cubic-bezier(.16,1,.3,1)' }}>{LOGO}</span>
          <span style={cx('display:flex;flex-direction:column;line-height:1.1;')}>
            <span data-r="brandName" style={{ ...cx('font-weight:800;color:#2F2F2F;letter-spacing:-0.03em;transition:font-size .3s ease;'), fontSize: hBrand }}>НейроПро+</span>
            <span data-r="brandTag" style={{ ...cx('font-size:14px;color:#5F5F5F;overflow:hidden;transition:max-height .3s ease,opacity .3s ease,margin-top .3s ease;'), maxHeight: hTagMax, opacity: hTagOp, marginTop: hTagMt }}>Внедрение ИИ в бизнес-процессы</span>
          </span>
        </Link>
        <nav style={cx('display:flex;align-items:center;gap:clamp(16px,2vw,30px);flex:none;')}>
          {NAV.map((n) => {
            const active = isActive(n.href);
            return (
              <Link key={n.href} data-r="navbtn" href={n.href} aria-current={active ? 'page' : undefined}
                style={cx(navBtn + `border-bottom:2px solid ${active ? '#2F2F2F' : 'transparent'};`)}>
                <span className="npp-nav-full">{n.full}</span><span className="npp-nav-short">{n.short}</span>
                <span className="nav-arrow" style={cx(navArrow)}>&rsaquo;</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
