import Link from 'next/link';
import { cx } from '@/lib/style';
import PageCard from '@/components/PageCard';
import { casesData } from '@/lib/data';

export const metadata = {
  title: 'Реализованные проекты',
  description: 'Реализованные проекты НейроПро+: ИИ-агенты, внедрение ИИ в процессы, цифровые продукты и автоматизация под ключ. Результаты применения ИИ под конкретные задачи.',
  alternates: { canonical: '/cases/' },
};

export default function CasesPage() {
  return (
    <PageCard>
    <section style={cx('max-width:1440px;margin:0 auto;padding:clamp(40px,6vw,84px) 32px clamp(64px,8vw,110px);')}>
      <div data-reveal style={cx('max-width:760px;margin-bottom:clamp(44px,5vw,68px);')}>
        <div style={cx('font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#5F5F5F;font-weight:700;margin-bottom:22px;')}>Портфолио</div>
        <h1 style={cx('margin:0;font-size:clamp(36px,4.4vw,60px);line-height:1.04;letter-spacing:-0.025em;color:#2F2F2F;font-weight:700;text-wrap:balance;')}>Реализованные проекты</h1>
        <p style={cx('margin:24px 0 0;font-size:clamp(18px,2vw,21px);line-height:1.55;color:#2F2F2F;')}>Каждый проект — это интеллектуальная система, созданная под конкретную задачу организации</p>
        <p style={cx('margin:18px 0 0;font-size:16.5px;line-height:1.6;color:#5F5F5F;text-wrap:pretty;')}>Показываем не технологии ради технологий, а результаты их применения: автоматизацию процессов, повышение эффективности, новые цифровые продукты и инструменты принятия решений</p>
      </div>
      <div className="npp-cases-grid" style={cx('display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(28px,3vw,40px);')}>
        {casesData.map((c) => (
          <Link key={c.id} href={`/cases/${c.id}/`} className="npp-case-card" data-reveal style={cx('cursor:pointer;border:1px solid #D0D0D0;border-radius:18px;overflow:hidden;background:#fff;display:flex;flex-direction:column;box-shadow:0 1px 2px rgba(0,0,0,.04);text-decoration:none;transition:box-shadow .4s cubic-bezier(.16,1,.3,1),transform .4s cubic-bezier(.16,1,.3,1);')}>
            <div style={cx('background:#2F2F2F;padding:26px 26px 24px;display:flex;flex-direction:column;gap:16px;min-height:132px;')}>
              <div style={cx('display:flex;align-items:center;justify-content:space-between;gap:12px;')}>
                <span style={cx('font-size:11.5px;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.55);font-weight:700;line-height:1.4;')}>{c.category}</span>
                <span style={cx('font-size:13px;font-weight:700;color:rgba(255,255,255,.4);flex:none;')}>{c.no}</span>
              </div>
              <h3 style={cx('margin:0;font-size:20px;line-height:1.26;letter-spacing:-0.015em;color:#fff;font-weight:700;text-wrap:balance;')}>{c.title}</h3>
            </div>
            <div style={cx('padding:24px 26px 28px;display:flex;flex-direction:column;flex:1;')}>
              <p style={cx('margin:0 0 20px;font-size:15.5px;line-height:1.55;color:#5F5F5F;')}>{c.desc}</p>
              <ul style={cx('margin:auto 0 0;padding:0;list-style:none;display:flex;flex-direction:column;gap:10px;')}>
                {c.effects.map((e, i) => (
                  <li key={i} style={cx('display:flex;gap:11px;font-size:14px;line-height:1.4;color:#2F2F2F;align-items:flex-start;')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2F2F2F" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={cx('flex:none;margin-top:2px;')}><path d="M5 12.5l4.5 4.5L19 6.5" /></svg>{e}
                  </li>
                ))}
              </ul>
            </div>
          </Link>
        ))}
      </div>
    </section>
    </PageCard>
  );
}
