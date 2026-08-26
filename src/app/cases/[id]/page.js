import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cx } from '@/lib/style';
import { Hx } from '@/components/Hx';
import PageCard from '@/components/PageCard';
import CaseArt from '@/components/CaseArt';
import { casesData } from '@/lib/data';

export function generateStaticParams() {
  return casesData.map((c) => ({ id: c.id }));
}

export function generateMetadata({ params }) {
  const c = casesData.find((x) => x.id === params.id);
  if (!c) return {};
  return {
    title: c.title,
    description: c.desc,
    alternates: { canonical: `/cases/${c.id}/` },
    openGraph: { title: `${c.title} · НейроПро+`, description: c.desc, url: `https://neuro-pro.ai/cases/${c.id}/` },
  };
}

const eyebrow = 'font-size:13px;letter-spacing:.18em;text-transform:uppercase;color:#5F5F5F;font-weight:700;';

export default function CasePage({ params }) {
  const c = casesData.find((x) => x.id === params.id);
  if (!c) notFound();

  const taskParas = (c.task || '').split('\n\n').filter((x) => x);
  const whatDidN = (c.whatDid || []).map((t, i) => ({ n: String(i + 1).padStart(2, '0'), text: t }));
  const flowN = (c.flow || []).map((label, i) => ({ label, notFirst: i > 0 }));

  return (
    <PageCard>
    <article style={cx('max-width:1080px;margin:0 auto;padding:clamp(32px,5vw,64px) 32px clamp(64px,8vw,110px);')}>
      <Hx as={Link} href="/cases/" data-reveal
        s="font-family:inherit;cursor:pointer;background:none;border:none;color:#5F5F5F;font-size:15px;font-weight:700;display:flex;align-items:center;gap:8px;padding:0;margin-bottom:clamp(32px,4vw,52px);text-decoration:none;width:fit-content;transition:color .3s ease;" sh="color:#2F2F2F;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>Все кейсы
      </Hx>

      {/* 7.1 HERO */}
      <div data-r="caseHero" data-reveal style={cx('display:grid;grid-template-columns:1.08fr .92fr;gap:clamp(36px,4vw,56px);align-items:center;margin-bottom:clamp(48px,6vw,80px);')}>
        <div>
          <div style={cx('font-size:13px;letter-spacing:.2em;text-transform:uppercase;color:#5F5F5F;font-weight:700;margin-bottom:20px;')}>Кейс {c.no} · {c.category}</div>
          <h1 style={cx('margin:0;font-size:clamp(30px,4vw,52px);line-height:1.07;letter-spacing:-0.025em;color:#2F2F2F;font-weight:700;text-wrap:balance;')}>{c.title}</h1>
          <p style={cx('margin:24px 0 0;font-size:18px;line-height:1.6;color:#2F2F2F;text-wrap:pretty;')}>{c.desc}</p>
          <div style={cx('margin-top:30px;')}>
            <div style={cx('font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#5F5F5F;font-weight:700;margin-bottom:14px;')}>Главный эффект</div>
            <div style={cx('display:flex;flex-wrap:wrap;gap:10px;')}>
              {c.effects.map((e, i) => (
                <span key={i} style={cx('font-size:14px;font-weight:700;color:#2F2F2F;background:#fff;border:1px solid #D0D0D0;border-radius:999px;padding:9px 16px;')}>{e}</span>
              ))}
            </div>
          </div>
          <Hx as={Link} href="/#lead-form" s="font-family:inherit;cursor:pointer;display:inline-block;margin-top:34px;background:#2F2F2F;color:#fff;border:none;border-radius:18px;padding:16px 32px;font-size:16px;font-weight:700;text-decoration:none;transition:all .3s cubic-bezier(.16,1,.3,1);" sh="transform:translateY(-3px);box-shadow:0 16px 34px rgba(0,0,0,.25);">Обсудить похожую задачу</Hx>
        </div>
        <CaseArt caseData={c} />
      </div>

      {/* 7.2 ЗАДАЧА */}
      <div data-reveal style={cx('margin-bottom:clamp(48px,6vw,76px);max-width:780px;')}>
        <div style={cx(eyebrow + 'margin-bottom:20px;')}>Задача</div>
        <div style={cx('display:flex;flex-direction:column;gap:18px;')}>
          {taskParas.map((p, i) => (
            <p key={i} style={cx('margin:0;font-size:18px;line-height:1.65;color:#2F2F2F;text-wrap:pretty;')}>{p}</p>
          ))}
        </div>
      </div>

      {/* 7.3 ЧТО СДЕЛАЛИ */}
      <div data-reveal style={cx('margin-bottom:clamp(48px,6vw,76px);')}>
        <div style={cx(eyebrow + 'margin-bottom:28px;')}>Что сделали</div>
        <div style={cx('display:grid;grid-template-columns:repeat(auto-fill,minmax(min(340px,100%),1fr));gap:2px 40px;')}>
          {whatDidN.map((w, i) => (
            <div key={i} style={cx('display:flex;gap:18px;padding:16px 0;border-top:1px solid #D0D0D0;align-items:flex-start;')}>
              <span style={cx('font-size:14px;font-weight:800;color:#5F5F5F;font-variant-numeric:tabular-nums;flex:none;width:24px;padding-top:2px;')}>{w.n}</span>
              <span style={cx('font-size:16.5px;line-height:1.5;color:#2F2F2F;')}>{w.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 7.4 КАК РАБОТАЕТ РЕШЕНИЕ */}
      <div data-reveal style={cx('margin-bottom:clamp(48px,6vw,76px);')}>
        <div style={cx(eyebrow + 'margin-bottom:28px;')}>Как работает решение</div>
        <div className="npp-case-flow" style={cx('display:flex;flex-wrap:wrap;align-items:stretch;gap:12px;')}>
          {flowN.map((f, i) => (
            <div key={i} style={{ display: 'contents' }}>
              {f.notFirst && (
                <span className="npp-flow-arrow" style={cx('display:flex;align-items:center;color:#5F5F5F;flex:none;')}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
              )}
              <span style={cx('flex:1 1 auto;min-width:0;display:flex;align-items:center;justify-content:center;text-align:center;background:#fff;border:1px solid #D0D0D0;border-radius:14px;padding:18px 18px;font-size:15px;line-height:1.35;font-weight:700;color:#2F2F2F;')}>{f.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 7.5 ПОЧЕМУ ЭТО КРУТО */}
      <div data-reveal style={cx('margin-bottom:clamp(48px,6vw,76px);background:#fff;border:1px solid #D0D0D0;border-radius:20px;padding:clamp(32px,4vw,48px);box-shadow:0 16px 38px -24px rgba(0,0,0,.18);')}>
        <div style={cx(eyebrow + 'margin-bottom:18px;')}>Почему это сложно и ценно</div>
        <p style={cx('margin:0;font-size:clamp(19px,2.1vw,24px);line-height:1.5;color:#2F2F2F;font-weight:600;letter-spacing:-0.01em;text-wrap:pretty;max-width:820px;')}>{c.whyCool}</p>
      </div>

      {/* 7.6 РЕЗУЛЬТАТ */}
      <div data-reveal style={cx('margin-bottom:clamp(48px,6vw,76px);')}>
        <div style={cx(eyebrow + 'margin-bottom:24px;')}>Результат</div>
        <div style={cx('display:grid;grid-template-columns:repeat(auto-fit,minmax(min(240px,100%),1fr));gap:16px;')}>
          {c.results.map((r, i) => (
            <div key={i} style={cx('display:flex;gap:13px;align-items:flex-start;background:#fff;border:1px solid #D0D0D0;border-radius:16px;padding:22px 22px;')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2F2F2F" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={cx('flex:none;margin-top:1px;')}><path d="M5 12.5l4.5 4.5L19 6.5" /></svg>
              <span style={cx('font-size:16px;line-height:1.45;color:#2F2F2F;font-weight:600;')}>{r}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 7.7 ЧТО МОЖНО МАСШТАБИРОВАТЬ */}
      <div data-reveal style={cx('margin-bottom:clamp(56px,7vw,88px);max-width:820px;')}>
        <div style={cx(eyebrow + 'margin-bottom:22px;')}>Что можно масштабировать дальше</div>
        <ul style={cx('margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:14px;')}>
          {c.scale.map((s, i) => (
            <li key={i} style={cx('display:flex;gap:14px;font-size:17px;line-height:1.5;color:#2F2F2F;')}><span style={cx('width:6px;height:6px;border-radius:50%;background:#2F2F2F;flex:none;margin-top:9px;')} />{s}</li>
          ))}
        </ul>
      </div>

      {/* 7.8 ФИНАЛЬНЫЙ CTA */}
      <div data-reveal style={cx('background:#2F2F2F;border-radius:24px;padding:clamp(40px,5vw,64px);text-align:center;')}>
        <h2 style={cx('margin:0 auto;font-size:clamp(26px,3vw,42px);line-height:1.1;letter-spacing:-0.02em;color:#fff;font-weight:700;max-width:560px;')}>Хотите решить похожую задачу?</h2>
        <p style={cx('margin:20px auto 34px;font-size:17px;line-height:1.6;color:rgba(255,255,255,.7);max-width:560px;')}>Опишите процесс, который хотите ускорить или автоматизировать. Мы разберём задачу, предложим архитектуру и дадим ориентир по срокам и стоимости.</p>
        <Hx as={Link} href="/#lead-form" s="font-family:inherit;cursor:pointer;display:inline-block;background:#fff;color:#2F2F2F;border:none;border-radius:18px;padding:18px 40px;font-size:17px;font-weight:700;text-decoration:none;transition:all .3s cubic-bezier(.16,1,.3,1);" sh="transform:translateY(-3px);box-shadow:0 16px 34px rgba(255,255,255,.18);">Обсудить проект</Hx>
      </div>
    </article>
    </PageCard>
  );
}
