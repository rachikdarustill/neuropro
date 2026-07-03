import { notFound } from 'next/navigation';
import { cx } from '@/lib/style';
import PageCard from '@/components/PageCard';
import { LEGAL as NPP_LEGAL } from '@/lib/legal-patched';

export function generateStaticParams() {
  return Object.keys(NPP_LEGAL).map((doc) => ({ doc }));
}

export function generateMetadata({ params }) {
  const raw = NPP_LEGAL[params.doc];
  if (!raw) return {};
  return {
    title: raw.title,
    description: (raw.subtitle ? raw.subtitle + '. ' : '') + raw.title + ' — ООО «НЕЙРОПРОПЛЮС», neuro-pro.ai.',
    alternates: { canonical: `/legal/${params.doc}/` },
    robots: { index: true, follow: true },
  };
}

export default function LegalPage({ params }) {
  const raw = NPP_LEGAL[params.doc];
  if (!raw) notFound();

  const eyebrow = raw.subtitle || 'Правовая информация';
  const sections = (raw.sections || []).map((s) => ({
    hasHeading: !!s.heading,
    heading: s.heading || '',
    body: (s.paras || []).join('\n\n'),
  }));

  return (
    <PageCard>
      <article style={cx('max-width:820px;margin:0 auto;padding:clamp(40px,6vw,84px) 32px clamp(64px,8vw,100px);')}>
        <div data-reveal>
          <div style={cx('font-size:13px;letter-spacing:.2em;text-transform:uppercase;color:#5F5F5F;font-weight:700;margin-bottom:20px;')}>{eyebrow}</div>
          <h1 style={cx('margin:0 0 36px;font-size:clamp(30px,3.6vw,50px);line-height:1.08;letter-spacing:-0.02em;color:#2F2F2F;font-weight:700;text-wrap:balance;')}>{raw.title}</h1>
        </div>
        <div style={cx('display:flex;flex-direction:column;gap:30px;')}>
          {sections.map((s, i) => (
            <div key={i} data-reveal>
              {s.hasHeading && <h2 style={cx('margin:0 0 12px;font-size:20px;color:#2F2F2F;font-weight:700;letter-spacing:-0.01em;')}>{s.heading}</h2>}
              <p style={cx('margin:0;font-size:16.5px;line-height:1.7;color:#5F5F5F;white-space:pre-line;')}>{s.body}</p>
            </div>
          ))}
        </div>
      </article>
    </PageCard>
  );
}
