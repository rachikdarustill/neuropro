'use client';
import Link from 'next/link';
import { cx } from '@/lib/style';
import { Hx } from '@/components/Hx';

const linkBase = 'font-size:15.5px;color:#2F2F2F;cursor:pointer;transition:color .3s ease;width:fit-content;text-decoration:none;display:block;';
const linkHover = 'color:#2F2F2F;text-decoration:underline;';
const contactBase = 'color:#2F2F2F;text-decoration:none;transition:color .3s ease;';
const contactHover = 'color:#2F2F2F;text-decoration:underline;';

const NAV = [
  ['/legal/policy', 'Политика обработки ПДн'],
  ['/legal/consent', 'Согласие на обработку ПДн'],
  ['/legal/terms', 'Пользовательское соглашение'],
  ['/legal/cookie', 'Политика использования cookie-файлов'],
  ['/legal/requisites', 'Реквизиты компании'],
  ['/legal/itinfo', 'Сведения об ИТ-деятельности'],
  ['/legal/infosec', 'Политика информационной безопасности'],
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={cx('padding:0 clamp(14px,2vw,28px) clamp(18px,2.5vw,32px);')}>
      <div style={cx('max-width:1440px;margin:0 auto;background:#fff;border:1px solid #D0D0D0;border-radius:30px;box-shadow:0 30px 72px -30px rgba(0,0,0,.22);padding:clamp(48px,5vw,76px) clamp(32px,4vw,56px) clamp(32px,4vw,44px);')}>
        <div className="npp-footer-grid" style={cx('display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:clamp(36px,4vw,56px);')}>
          <div style={cx('min-width:240px;')}>
            <Link href="/" style={cx('display:flex;align-items:center;gap:13px;cursor:pointer;margin-bottom:24px;text-decoration:none;')}>
              <svg viewBox="0 0 82 100" style={cx('height:38px;width:auto;flex:none;display:block;')} fill="#2F2F2F" aria-label="НейроПро+">
                <rect x="30" y="0" width="22" height="45" /><rect x="30" y="59" width="22" height="41" /><rect x="0" y="31" width="22" height="41" /><rect x="60" y="31" width="22" height="41" />
              </svg>
              <span style={cx('font-size:20px;font-weight:700;color:#2F2F2F;letter-spacing:-0.01em;')}>НейроПро+</span>
            </Link>
            <p style={cx('margin:0 0 26px;font-size:15.5px;line-height:1.6;color:#5F5F5F;max-width:300px;')}>Цифровые продукты и внедрение ИИ в бизнес-процессы под ключ</p>
            <div style={cx('font-size:13.5px;line-height:1.75;color:#5F5F5F;')}>
              <div style={cx('color:#2F2F2F;font-weight:700;margin-bottom:6px;')}>ООО «НЕЙРОПРОПЛЮС»</div>
              <div>ИНН: 9709134402&nbsp;&nbsp;·&nbsp;&nbsp;КПП: 771401001</div>
              <div>ОГРН: 1267700137539</div>
              <div style={cx('margin-top:10px;')}>ОКВЭД 62.01 — Разработка компьютерного программного обеспечения</div>
            </div>
          </div>

          <div>
            <div style={cx('font-size:12.5px;letter-spacing:.16em;text-transform:uppercase;color:#5F5F5F;font-weight:700;margin-bottom:22px;')}>Навигация</div>
            <div style={cx('display:flex;flex-direction:column;gap:14px;')}>
              {NAV.map(([href, label]) => (
                <Hx key={href} as={Link} href={href} s={linkBase} sh={linkHover}>{label}</Hx>
              ))}
            </div>
          </div>

          <div>
            <div style={cx('font-size:12.5px;letter-spacing:.16em;text-transform:uppercase;color:#5F5F5F;font-weight:700;margin-bottom:22px;')}>Контакты</div>
            <div style={cx('display:flex;flex-direction:column;gap:16px;font-size:15px;color:#2F2F2F;')}>
              <Hx as="a" href="mailto:info@neuro-pro.ai" s={contactBase} sh={contactHover}><span style={cx('display:block;color:#5F5F5F;font-size:12.5px;margin-bottom:3px;')}>E-mail</span>info@neuro-pro.ai</Hx>
              <Hx as="a" href="tel:+79161384559" s={contactBase} sh={contactHover}><span style={cx('display:block;color:#5F5F5F;font-size:12.5px;margin-bottom:3px;')}>Телефон</span>+7 916 138-45-59</Hx>
              <div><span style={cx('display:block;color:#5F5F5F;font-size:12.5px;margin-bottom:3px;')}>Адрес</span>125167, г. Москва, вн. тер. г. Муниципальный округ Хорошевский, пр-кт Ленинградский, д. 37, помещ. 35/14</div>
            </div>
          </div>
        </div>

        <div style={cx('margin-top:clamp(44px,5vw,64px);padding-top:28px;border-top:1px solid #D0D0D0;display:flex;flex-wrap:wrap;gap:14px;justify-content:space-between;align-items:center;')}>
          <span style={cx('font-size:13.5px;color:#5F5F5F;')}>© {year} ООО «НЕЙРОПРОПЛЮС». Все права защищены.</span>
          <Hx as="span" role="button" tabIndex={0}
            onClick={() => window.dispatchEvent(new Event('npp:reopen-cookie'))}
            s="font-size:13.5px;color:#5F5F5F;cursor:pointer;transition:color .3s ease;" sh="color:#2F2F2F;text-decoration:underline;">Настройки cookie</Hx>
        </div>
      </div>
    </footer>
  );
}
