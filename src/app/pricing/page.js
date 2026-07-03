import { cx } from '@/lib/style';
import PageCard from '@/components/PageCard';
import PriceCalculator from '@/components/PriceCalculator';
import { priceFactors } from '@/lib/data';

export const metadata = {
  title: 'Стоимость услуг',
  description: 'Стоимость внедрения ИИ и разработки цифровых продуктов зависит от задачи, сложности, интеграций и состава команды. Ставка специалиста — от 5 000 ₽/час. Рассчитайте ориентировочную стоимость проекта.',
  alternates: { canonical: '/pricing/' },
};

export default function PricingPage() {
  return (
    <PageCard>
      <section style={cx('max-width:1440px;margin:0 auto;padding:clamp(40px,6vw,84px) 32px clamp(48px,6vw,80px);')}>
        <div data-r="priceHero" style={cx('display:grid;grid-template-columns:1.1fr .9fr;gap:64px;align-items:center;')}>
          <div data-reveal>
            <div style={cx('font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#5F5F5F;font-weight:700;margin-bottom:24px;')}>Цены</div>
            <h1 style={cx('margin:0;font-size:clamp(32px,4.4vw,62px);line-height:1.05;letter-spacing:-0.025em;color:#2F2F2F;font-weight:700;text-wrap:balance;')}>Стоимость зависит от задачи, сложности и состава команды</h1>
            <p style={cx('margin:28px 0 0;font-size:18px;line-height:1.6;color:#2F2F2F;max-width:560px;')}>Мы оцениваем проект по составу работ, уровню специалистов, срокам, интеграциям и требуемому результату</p>
          </div>
          <div data-reveal style={cx('background:#2F2F2F;border:1px solid #2F2F2F;border-radius:14px;padding:26px 28px;box-shadow:0 22px 50px -32px rgba(0,0,0,.5);align-self:center;justify-self:end;width:100%;max-width:340px;')}>
            <div style={cx('font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.7);font-weight:700;')}>Ставка специалиста</div>
            <div style={cx('margin-top:10px;font-size:clamp(28px,3vw,40px);line-height:1;letter-spacing:-0.02em;color:#fff;font-weight:700;')}>от 5 000 ₽<span style={cx('font-size:.42em;color:rgba(255,255,255,.7);font-weight:700;')}> / час</span></div>
            <p style={cx('margin:14px 0 0;font-size:14px;line-height:1.5;color:rgba(255,255,255,.7);')}>Финальная стоимость складывается из состава команды и объёма работ по проекту</p>
          </div>
        </div>
      </section>

      <section style={cx('border-top:1px solid #D0D0D0;background:#E6E6E6;')}>
        <div data-r="priceCalc" style={cx('max-width:1440px;margin:0 auto;padding:clamp(56px,7vw,96px) 32px;display:grid;grid-template-columns:1fr 1fr;gap:clamp(40px,5vw,72px);align-items:stretch;')}>
          <div data-reveal>
            <h2 style={cx('margin:0;font-size:clamp(26px,3vw,40px);letter-spacing:-0.02em;color:#2F2F2F;font-weight:700;')}>От чего зависит цена</h2>
            <ul style={cx('list-style:none;margin:clamp(28px,3vw,40px) 0 0;padding:0;display:flex;flex-direction:column;gap:18px;')}>
              {priceFactors.map((f) => (
                <li key={f.no} style={cx('display:flex;align-items:flex-start;gap:16px;font-size:18px;line-height:1.4;color:#2F2F2F;font-weight:700;')}>
                  <span style={cx('width:8px;height:8px;border-radius:50%;background:#2F2F2F;flex:none;margin-top:8px;')} />
                  <span>{f.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <PriceCalculator />
        </div>
      </section>
    </PageCard>
  );
}
