'use client';
import { useEffect, useRef, useState } from 'react';
import { cx } from '@/lib/style';
import { agentScenarios } from '@/lib/data';

// Ported verbatim from runScenario + the demo-agent markup (support console mockup).
function InboxIcon({ type, color }) {
  const common = { width: 15, height: 15, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (type === 'mail') return <svg {...common}><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M4 7.5l8 5.5 8-5.5" /></svg>;
  if (type === 'phone') return <svg {...common}><path d="M5 4h3.5l1.8 4.5L8 10.2a11 11 0 0 0 5 5l1.7-2.3 4.5 1.8V18a2 2 0 0 1-2.2 2A15 15 0 0 1 3 6.2 2 2 0 0 1 5 4z" /></svg>;
  return <svg {...common}><path d="M4 5h16v11H9l-4 4V5z" /></svg>;
}

const LOGO_WHITE = (h) => (
  <svg viewBox="0 0 82 100" style={{ height: h, width: 'auto', display: 'block' }} fill="#fff">
    <rect x="30" y="0" width="22" height="45" /><rect x="30" y="59" width="22" height="41" /><rect x="0" y="31" width="22" height="41" /><rect x="60" y="31" width="22" height="41" />
  </svg>
);

export default function DemoAgent() {
  const [st, setSt] = useState({ agi: 0, agVis: 0, agThinking: true, agAnswer: false, agResult: false });
  const timers = useRef([]);

  useEffect(() => {
    const later = (fn, ms) => { const t = setTimeout(fn, ms); timers.current.push(t); return t; };
    function runScenario(i) {
      const sc = agentScenarios[i]; if (!sc) return;
      setSt({ agi: i, agVis: 0, agThinking: true, agAnswer: false, agResult: false });
      let d = 750;
      sc.steps.forEach((_, idx) => { later(() => setSt((s) => ({ ...s, agVis: idx + 1 })), d); d += 760; });
      later(() => setSt((s) => ({ ...s, agThinking: false, agAnswer: true })), d + 150);
      later(() => setSt((s) => ({ ...s, agResult: true })), d + 650);
      later(() => runScenario((i + 1) % agentScenarios.length), d + 3400);
    }
    runScenario(0);
    return () => { timers.current.forEach(clearTimeout); timers.current = []; };
  }, []);

  const agi = st.agi ?? 0;
  const agScene = agentScenarios[agi] || agentScenarios[0];
  const agSteps = agScene.steps.slice(0, st.agVis ?? 0);
  const agResult = st.agResult ?? false;
  const agStatus = agResult ? 'Закрыто автоматически' : 'Агент обрабатывает';
  const inboxItems = agentScenarios.map((s, idx) => ({
    label: s.inboxLabel, time: s.inboxTime, on: idx === agi,
    type: s.icon,
  }));

  return (
    <div style={cx('border-top:1px solid #D0D0D0;')}>
      {/* TOP BAR */}
      <div style={cx('display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;padding:18px 22px;border-bottom:1px solid #D0D0D0;')}>
        <div style={cx('display:flex;align-items:center;gap:12px;')}>
          <div style={cx('width:30px;height:30px;border-radius:8px;background:#2F2F2F;display:flex;align-items:center;justify-content:center;flex:none;')}>{LOGO_WHITE('15px')}</div>
          <span style={cx('font-size:15px;font-weight:700;color:#2F2F2F;')}>Агент поддержки · Онлайн-пульт</span>
          <span style={cx('font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11.5px;color:#5F5F5F;border:1px solid #D0D0D0;border-radius:6px;padding:4px 9px;white-space:nowrap;')}>npp-agent · v2</span>
        </div>
        <div style={cx('display:flex;align-items:center;gap:18px;')}>
          <span style={cx('font-size:13px;color:#5F5F5F;white-space:nowrap;')}>Обработано сегодня · <strong style={cx('color:#2F2F2F;')}>1 285</strong></span>
          <span style={cx('display:flex;align-items:center;gap:7px;font-size:12px;font-weight:700;letter-spacing:.14em;color:#2F2F2F;')}><span style={cx('width:7px;height:7px;border-radius:50%;background:#2F2F2F;display:inline-block;')} />ОНЛАЙН</span>
        </div>
      </div>

      {/* BODY */}
      <div data-r="mockGrid" style={cx('display:grid;grid-template-columns:248px 1fr 268px;')}>
        {/* INBOX */}
        <div style={cx('border-right:1px solid #D0D0D0;padding:22px 16px;')}>
          <div style={cx('display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;padding:0 4px;')}>
            <span style={cx('font-size:11.5px;letter-spacing:.18em;text-transform:uppercase;color:#5F5F5F;font-weight:700;')}>Входящие</span>
            <span style={cx('font-size:12px;font-weight:700;color:#5F5F5F;background:#D0D0D0;border-radius:20px;padding:2px 9px;')}>12</span>
          </div>
          <div style={cx('display:flex;flex-direction:column;gap:3px;')}>
            {inboxItems.map((it, i) => it.on ? (
              <div key={i} style={cx('display:flex;align-items:center;gap:10px;padding:11px 12px;border-radius:10px;background:#E6E6E6;border-left:3px solid #2F2F2F;')}>
                <InboxIcon type={it.type} color="#2F2F2F" />
                <span style={cx('flex:1;font-size:13.5px;font-weight:700;color:#2F2F2F;')}>{it.label}</span>
                <span style={cx('font-size:12px;color:#5F5F5F;')}>{it.time}</span>
              </div>
            ) : (
              <div key={i} style={cx('display:flex;align-items:center;gap:10px;padding:11px 12px;border-radius:10px;border-left:3px solid transparent;')}>
                <InboxIcon type={it.type} color="#5F5F5F" />
                <span style={cx('flex:1;font-size:13.5px;font-weight:600;color:#5F5F5F;')}>{it.label}</span>
                <span style={cx('font-size:12px;color:#5F5F5F;')}>{it.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CHAT */}
        <div style={cx('padding:22px 26px;display:flex;flex-direction:column;min-height:360px;')}>
          <span style={cx('font-size:11.5px;letter-spacing:.18em;text-transform:uppercase;color:#5F5F5F;font-weight:700;margin-bottom:16px;')}>Клиент · Чат</span>
          <div style={cx('background:#E6E6E6;border-radius:4px 14px 14px 14px;padding:14px 18px;font-size:14.5px;line-height:1.5;color:#2F2F2F;max-width:88%;')}>{agScene.client}</div>
          <div className="npp-steps" style={cx('display:flex;flex-direction:column;gap:13px;margin-top:24px;')}>
            {agSteps.map((s, i) => (
              <div key={i} style={cx('display:flex;align-items:center;gap:11px;')}>
                <span style={cx('width:18px;height:18px;border-radius:50%;background:#2F2F2F;display:inline-flex;align-items:center;justify-content:center;flex:none;')}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4 10-11" /></svg></span>
                <span style={cx('font-size:14px;color:#2F2F2F;font-weight:700;')}>{s.label}</span><span style={cx('font-size:13px;color:#5F5F5F;')}>{s.note}</span>
              </div>
            ))}
          </div>
          {st.agThinking && (
            <div style={cx('margin-top:18px;display:flex;align-items:center;gap:9px;')}>
              <span style={cx('width:7px;height:7px;border-radius:50%;background:#5F5F5F;display:inline-block;animation:npp_typing 1.2s infinite;')} />
              <span style={cx('width:7px;height:7px;border-radius:50%;background:#5F5F5F;display:inline-block;animation:npp_typing 1.2s infinite .2s;')} />
              <span style={cx('width:7px;height:7px;border-radius:50%;background:#5F5F5F;display:inline-block;animation:npp_typing 1.2s infinite .4s;')} />
              <span style={cx('font-size:13px;color:#5F5F5F;')}>Агент обрабатывает…</span>
            </div>
          )}
          {st.agAnswer && (
            <div style={cx('margin-top:20px;display:flex;gap:11px;align-items:flex-end;animation:npp_msg .45s cubic-bezier(.16,1,.3,1) both;')}>
              <div style={cx('width:30px;height:30px;border-radius:8px;background:#2F2F2F;display:flex;align-items:center;justify-content:center;flex:none;')}>{LOGO_WHITE('14px')}</div>
              <div style={cx('background:#2F2F2F;color:#fff;border-radius:4px 16px 16px 16px;padding:14px 18px;font-size:14px;line-height:1.55;max-width:90%;')}>{agScene.answer}</div>
            </div>
          )}
        </div>

        {/* RESULT */}
        <div style={cx('border-left:1px solid #D0D0D0;padding:22px 20px;background:#E6E6E6;')}>
          <span style={cx('font-size:11.5px;letter-spacing:.18em;text-transform:uppercase;color:#5F5F5F;font-weight:700;')}>Результат</span>
          <div style={cx('display:flex;align-items:center;gap:9px;margin:16px 0 18px;')}>
            <span style={cx(`width:8px;height:8px;border-radius:50%;background:${agResult ? '#2F2F2F' : '#5F5F5F'};display:inline-block;`)} />
            <span style={cx('font-size:15px;font-weight:700;color:#2F2F2F;')}>{agStatus}</span>
          </div>
          {[['Маршрут', agScene.route], ['Оценка клиента', agScene.csat], ['Эскалация', agScene.esc]].map(([k, v]) => (
            <div key={k} style={cx('display:flex;justify-content:space-between;align-items:center;padding:11px 0;border-top:1px solid #D0D0D0;font-size:14px;')}><span style={cx('color:#5F5F5F;')}>{k}</span><span style={cx('font-weight:700;color:#2F2F2F;')}>{v}</span></div>
          ))}
          <div style={cx('display:flex;justify-content:space-between;align-items:baseline;padding:11px 0;border-top:1px solid #D0D0D0;font-size:14px;')}><span style={cx('color:#5F5F5F;')}>Время</span><span style={cx('font-weight:800;color:#2F2F2F;font-size:20px;letter-spacing:-0.01em;')}>{agScene.time}</span></div>
          <div style={cx('margin-top:18px;display:flex;align-items:flex-end;gap:6px;height:44px;')}>
            {['38%', '54%', '46%', '66%', '58%'].map((h, i) => <span key={i} style={cx(`flex:1;height:${h};background:#D0D0D0;border-radius:3px;`)} />)}
            <span style={cx('flex:1;height:100%;background:#2F2F2F;border-radius:3px;')} />
          </div>
          <p style={cx('margin:18px 0 0;font-size:13px;line-height:1.5;color:#5F5F5F;')}><strong style={cx('color:#2F2F2F;')}>−50%</strong> к времени ответа против ручной поддержки</p>
        </div>
      </div>
    </div>
  );
}
