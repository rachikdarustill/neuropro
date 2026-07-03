import { cx } from '@/lib/style';

// Ported verbatim from the inlined CaseArt visualization (renderVals + markup 468-509).
// Pure CSS-animated (ca_* keyframes in globals.css) — no client JS needed.
export default function CaseArt({ caseData }) {
  const caFlow = (Array.isArray(caseData.flow) && caseData.flow.length) ? caseData.flow : ['Вход', 'Обработка', 'Проверка', 'Решение', 'Результат'];
  const caResults = (Array.isArray(caseData.results) && caseData.results.length) ? caseData.results : ['Готово'];
  const caStep = 0.72, caTail = 2.2;
  const caCycle = (caFlow.length + caTail) * caStep;
  const nodes = caFlow.map((label, i) => ({ label, notFirst: i > 0, delayS: (i * caStep).toFixed(2) }));
  const cycleS = caCycle.toFixed(2);
  const resultDelayS = (caFlow.length * caStep).toFixed(2);
  const resultText = caResults[0];
  const no = caseData.no || '01';

  return (
    <div style={cx('height:clamp(400px,36vw,440px);border-radius:18px;overflow:hidden;')}>
      <div style={cx("position:relative;width:100%;height:100%;background:#2F2F2F;overflow:hidden;font-family:'Manrope',-apple-system,sans-serif;")}>
        <div style={cx('position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px);background-size:34px 34px;')} />
        <span style={cx('position:absolute;top:18px;left:24px;z-index:5;font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.55);font-weight:700;white-space:nowrap;')}>Кейс {no}</span>
        <span style={cx('position:absolute;top:17px;right:22px;z-index:5;display:flex;align-items:center;gap:7px;font-size:11px;letter-spacing:.18em;color:rgba(255,255,255,.7);font-weight:700;white-space:nowrap;')}><span style={cx('width:7px;height:7px;border-radius:50%;background:#fff;display:inline-block;animation:ca_pulse 1.6s ease-in-out infinite;')} />LIVE</span>
        <span style={cx('position:absolute;right:14px;bottom:-24px;z-index:0;font-size:130px;font-weight:800;color:rgba(255,255,255,.055);letter-spacing:-0.05em;line-height:1;')}>{no}</span>
        <div style={cx('position:absolute;top:0;left:0;right:0;height:2px;z-index:5;overflow:hidden;pointer-events:none;')}>
          <span style={cx('position:absolute;top:0;left:0;width:38%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.55),transparent);animation:ca_sweep 4s linear infinite;')} />
        </div>
        <div style={cx('position:absolute;left:24px;right:22px;top:50px;z-index:2;')}>
          <div style={cx('display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;')}>
            <div style={cx('display:flex;align-items:center;gap:9px;')}>
              <span style={cx('font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,255,255,.42);font-weight:700;')}>Логика решения</span>
              <span style={cx('display:flex;align-items:flex-end;gap:3px;padding-bottom:1px;')}>
                <span style={cx('width:3.5px;height:3.5px;border-radius:50%;background:rgba(255,255,255,.6);animation:ca_type 1.1s infinite 0s;')} />
                <span style={cx('width:3.5px;height:3.5px;border-radius:50%;background:rgba(255,255,255,.6);animation:ca_type 1.1s infinite .18s;')} />
                <span style={cx('width:3.5px;height:3.5px;border-radius:50%;background:rgba(255,255,255,.6);animation:ca_type 1.1s infinite .36s;')} />
              </span>
            </div>
            <span style={cx('font-size:10.5px;letter-spacing:.06em;color:rgba(255,255,255,.5);font-family:ui-monospace,SFMono-Regular,Menlo,monospace;border:1px solid rgba(255,255,255,.16);border-radius:5px;padding:2px 7px;')}>ИИ-агент</span>
          </div>
          <div style={cx('position:relative;')}>
            <div style={cx('position:absolute;left:10px;top:17px;bottom:17px;width:2px;background:rgba(255,255,255,.12);border-radius:2px;')} />
            {nodes.map((nd, i) => (
              <div key={i} style={cx('position:relative;z-index:1;display:flex;align-items:center;gap:14px;height:34px;')}>
                {nd.notFirst && <span style={cx(`position:absolute;left:10px;top:-17px;width:2px;height:34px;background:rgba(255,255,255,.85);transform-origin:top;transform:scaleY(0);animation:ca_seg ${cycleS}s ease infinite ${nd.delayS}s;`)} />}
                <span style={cx(`position:relative;z-index:1;width:22px;height:22px;border-radius:50%;border:1.5px solid rgba(255,255,255,.24);background:#2F2F2F;box-sizing:border-box;display:flex;align-items:center;justify-content:center;flex:none;animation:ca_dot ${cycleS}s linear infinite ${nd.delayS}s, ca_flash ${cycleS}s ease-out infinite ${nd.delayS}s;`)}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2F2F2F" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" style={cx(`opacity:0;animation:ca_check ${cycleS}s ease infinite ${nd.delayS}s;`)}><path d="M5 13l4 4 10-11" /></svg>
                </span>
                <span style={cx(`font-size:13.5px;line-height:1.2;font-weight:600;white-space:nowrap;color:rgba(255,255,255,.36);animation:ca_lab ${cycleS}s linear infinite ${nd.delayS}s;`)}>{nd.label}</span>
              </div>
            ))}
          </div>
          <div style={cx('margin-top:15px;padding-top:14px;border-top:1px solid rgba(255,255,255,.12);')}>
            <div style={cx('font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.4);font-weight:700;margin-bottom:10px;')}>Результат</div>
            <div style={cx('display:flex;align-items:center;gap:11px;')}>
              <span style={cx(`width:20px;height:20px;border-radius:50%;border:1.5px solid rgba(255,255,255,.24);background:#2F2F2F;box-sizing:border-box;display:flex;align-items:center;justify-content:center;flex:none;animation:ca_dot ${cycleS}s linear infinite ${resultDelayS}s, ca_flash ${cycleS}s ease-out infinite ${resultDelayS}s;`)}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#2F2F2F" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" style={cx(`opacity:0;animation:ca_check ${cycleS}s ease infinite ${resultDelayS}s;`)}><path d="M5 13l4 4 10-11" /></svg>
              </span>
              <span style={cx(`font-size:13.5px;line-height:1.3;font-weight:700;color:rgba(255,255,255,.36);animation:ca_lab ${cycleS}s linear infinite ${resultDelayS}s;`)}>{resultText}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
