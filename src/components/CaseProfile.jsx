import { cx } from '@/lib/style';

// Статичная сводка по кейсу вместо анимированной панели с меткой LIVE.
// Все значения считаются из данных кейса, поэтому не расходятся с текстом.
export default function CaseProfile({ caseData: c }) {
  const rows = [
    ['Этапов в процессе', (c.flow || []).length],
    ['Выполнено работ', (c.whatDid || []).length],
    ['Зафиксировано результатов', (c.results || []).length],
    ['Направлений развития', (c.scale || []).length],
  ];

  return (
    <aside aria-label="Профиль решения" style={cx('position:relative;background:#2F2F2F;color:#fff;border-radius:18px;padding:clamp(24px,2.8vw,34px);display:flex;flex-direction:column;gap:14px;background-image:linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px);background-size:38px 38px;')}>
      <p style={cx('margin:0;font-size:13px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.7);')}>Профиль решения</p>
      <p style={cx('margin:0;font-size:clamp(19px,2vw,24px);font-weight:700;letter-spacing:-.02em;line-height:1.25;')}>{c.category}</p>

      <dl style={cx('margin:6px 0 0;display:flex;flex-direction:column;')}>
        {rows.map(([label, value]) => (
          <div key={label} style={cx('display:flex;align-items:baseline;justify-content:space-between;gap:16px;padding:13px 0;border-top:1px solid rgba(255,255,255,.16);')}>
            <dt style={cx('font-size:14.5px;color:rgba(255,255,255,.65);')}>{label}</dt>
            <dd style={cx('margin:0;font-size:22px;font-weight:800;font-variant-numeric:tabular-nums;letter-spacing:-.02em;')}>{value}</dd>
          </div>
        ))}
      </dl>

      <p style={cx('margin:auto 0 0;padding-top:14px;font-size:12px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.45);')}>Кейс {c.no}</p>
    </aside>
  );
}
