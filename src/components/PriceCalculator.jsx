'use client';
import { useEffect, useRef, useState } from 'react';
import { cx } from '@/lib/style';
import { Hx } from '@/components/Hx';
import { briefSteps } from '@/lib/data';

// Ported verbatim from botSay/startChat/askStep/pickOption/estimate/finishChat.
const AGENT_NAME = 'Дмитрий';
const AGENT_INITIAL = AGENT_NAME.charAt(0);

function estimate(p) {
  const base = { agent: [500, 1500], embed: [800, 2500], product: [1500, 5000], staff: [400, 1200] }[p.type] || [800, 2500];
  let m = 1;
  if (p.team === 'std') m *= 1.4; if (p.team === 'max') m *= 2;
  if (p.integ === 'crm') m *= 1.3; if (p.integ === 'kb') m *= 1.25; if (p.integ === 'api') m *= 1.2;
  if (p.timeline === 'rush') m *= 1.3;
  const round = (n) => Math.round(n * m / 50) * 50;
  const lo = round(base[0]), hi = round(base[1]);
  const fmt = (n) => n >= 1000 ? (n / 1000).toLocaleString('ru-RU', { maximumFractionDigits: 1 }) + ' млн ₽' : n + ' тыс ₽';
  const tier = { agent: 'ИИ-агент', embed: 'внедрение ИИ в процессы', product: 'цифровой продукт под ключ', staff: 'ИИ-аутстафф' }[p.type] || 'ИИ-проект';
  const weeks = { rush: 'до 4 недель', mid: '6–12 недель', long: '3–6 месяцев', unknown: 'уточним на созвоне' }[p.timeline] || '6–12 недель';
  return { range: 'от ' + fmt(lo) + ' до ' + fmt(hi), tier, weeks };
}

export default function PriceCalculator() {
  const [chatStarted, setChatStarted] = useState(false);
  const [chatMsgs, setChatMsgs] = useState([]);
  const [chatOptions, setChatOptions] = useState([]);
  const [chatTyping, setChatTyping] = useState(false);
  const picksRef = useRef({});
  const botT = useRef(null);
  const chatBodyRef = useRef(null);

  useEffect(() => {
    const b = chatBodyRef.current;
    if (b) requestAnimationFrame(() => { b.scrollTop = b.scrollHeight; });
  }, [chatMsgs, chatTyping]);

  useEffect(() => () => clearTimeout(botT.current), []);

  function botSay(text, options) {
    setChatTyping(true); setChatOptions([]);
    clearTimeout(botT.current);
    botT.current = setTimeout(() => {
      setChatTyping(false);
      setChatMsgs((s) => [...s, { from: 'bot', text }]);
      setChatOptions(options || []);
    }, 750);
  }
  function askStep(i) {
    const st = briefSteps[i];
    botSay(st.q, st.options.map((o) => ({ ...o, step: i })));
  }
  function startChat() {
    picksRef.current = {};
    setChatStarted(true);
    setChatMsgs([{ from: 'bot', text: 'Привет, меня зовут ' + AGENT_NAME + '. Я помогу посчитать ориентировочную стоимость вашего проекта. Если что-то будет непонятно, я задам уточняющий вопрос.' }]);
    setChatOptions([]);
    setTimeout(() => askStep(0), 650);
  }
  function finishChat(picks) {
    const e = estimate(picks);
    const text = 'Спасибо! По описанию это похоже на проект уровня «' + e.tier + '».\n\nПредварительная вилка: ' + e.range + '.\nОриентир по срокам: ' + e.weeks + '.\n\nЭто только предварительная оценка — точные цифры зафиксируем после короткого созвона с командой.';
    botSay(text, [{ label: 'Связаться с командой', action: 'contact' }, { label: 'Посчитать заново', action: 'restart' }]);
  }
  function pickOption(opt) {
    if (opt.action === 'contact') {
      setChatMsgs((s) => [...s, { from: 'user', text: opt.label }]);
      setChatOptions([]);
      window.location.href = '/#lead-form';
      return;
    }
    if (opt.action === 'restart') {
      setChatStarted(false); setChatMsgs([]); setChatOptions([]); picksRef.current = {};
      setTimeout(() => startChat(), 60);
      return;
    }
    const key = briefSteps[opt.step].key;
    picksRef.current = { ...picksRef.current, [key]: opt.v };
    setChatMsgs((s) => [...s, { from: 'user', text: opt.label }]);
    setChatOptions([]);
    const next = opt.step + 1;
    if (next < briefSteps.length) setTimeout(() => askStep(next), 380);
    else setTimeout(() => finishChat(picksRef.current), 420);
  }

  return (
    <div data-reveal style={cx('display:flex;flex-direction:column;height:100%;')}>
      <div style={cx('border:1px solid #D0D0D0;border-radius:18px;background:#fff;box-shadow:0 30px 70px -40px rgba(0,0,0,.3);overflow:hidden;display:flex;flex-direction:column;flex:1;')}>
        <div style={cx('display:flex;align-items:center;gap:14px;padding:20px 26px;border-bottom:1px solid #D0D0D0;flex:none;')}>
          <div style={cx('width:46px;height:46px;border-radius:12px;background:#2F2F2F;color:#fff;display:flex;align-items:center;justify-content:center;font-size:19px;font-weight:700;flex:none;')}>{AGENT_INITIAL}</div>
          <div style={cx('line-height:1.25;')}>
            <div style={cx('font-size:17px;font-weight:700;color:#2F2F2F;')}>{AGENT_NAME}</div>
            <div style={cx('font-size:13px;color:#5F5F5F;display:flex;align-items:center;gap:7px;')}><span style={cx('width:7px;height:7px;border-radius:50%;background:#2F2F2F;display:inline-block;')} />ИИ-агент по расчёту стоимости</div>
          </div>
        </div>

        <div ref={chatBodyRef} style={cx('padding:28px 26px;flex:1;min-height:340px;overflow-y:auto;display:flex;flex-direction:column;gap:16px;background:#fff;')}>
          {!chatStarted && (
            <div style={cx('margin:auto;text-align:center;padding:30px 10px;')}>
              <p style={cx('margin:0 0 24px;font-size:16px;line-height:1.6;color:#5F5F5F;max-width:420px;')}>Привет! Меня зовут {AGENT_NAME}. Я помогу посчитать ориентировочную стоимость вашего проекта и задам пару уточняющих вопросов</p>
              <Hx as="button" onClick={startChat} s="font-family:inherit;cursor:pointer;background:#2F2F2F;color:#fff;border:none;border-radius:18px;padding:16px 32px;font-size:16px;font-weight:700;transition:all .3s cubic-bezier(.16,1,.3,1);" sh="background:#2F2F2F;transform:translateY(-2px);box-shadow:0 12px 28px rgba(0,0,0,.2);">Начать расчёт</Hx>
            </div>
          )}

          {chatMsgs.map((m, i) => m.from === 'bot' ? (
            <div key={i} style={cx('display:flex;gap:11px;align-items:flex-end;max-width:84%;animation:npp_msg .4s cubic-bezier(.16,1,.3,1) both;')}>
              <div style={cx('width:30px;height:30px;border-radius:9px;background:#2F2F2F;color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex:none;')}>{AGENT_INITIAL}</div>
              <div style={cx('background:#E6E6E6;color:#2F2F2F;border-radius:4px 16px 16px 16px;padding:14px 18px;font-size:15.5px;line-height:1.55;white-space:pre-line;')}>{m.text}</div>
            </div>
          ) : (
            <div key={i} style={cx('align-self:flex-end;background:#2F2F2F;color:#fff;border-radius:16px 16px 4px 16px;padding:13px 18px;font-size:15.5px;line-height:1.5;max-width:80%;animation:npp_msg .4s cubic-bezier(.16,1,.3,1) both;')}>{m.text}</div>
          ))}

          {chatTyping && (
            <div style={cx('display:flex;gap:11px;align-items:flex-end;')}>
              <div style={cx('width:30px;height:30px;border-radius:9px;background:#2F2F2F;color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex:none;')}>{AGENT_INITIAL}</div>
              <div style={cx('background:#E6E6E6;border-radius:4px 16px 16px 16px;padding:16px 18px;display:flex;gap:5px;')}>
                <span style={cx('width:7px;height:7px;border-radius:50%;background:#5F5F5F;display:inline-block;animation:npp_typing 1.2s infinite;')} />
                <span style={cx('width:7px;height:7px;border-radius:50%;background:#5F5F5F;display:inline-block;animation:npp_typing 1.2s infinite .2s;')} />
                <span style={cx('width:7px;height:7px;border-radius:50%;background:#5F5F5F;display:inline-block;animation:npp_typing 1.2s infinite .4s;')} />
              </div>
            </div>
          )}
        </div>

        {chatOptions.length > 0 && (
          <div style={cx('padding:18px 26px;border-top:1px solid #D0D0D0;display:flex;flex-wrap:wrap;gap:10px;background:#E6E6E6;')}>
            {chatOptions.map((opt, i) => (
              <Hx key={i} as="button" onClick={() => pickOption(opt)} s="font-family:inherit;cursor:pointer;background:#fff;color:#2F2F2F;border:1px solid #D0D0D0;border-radius:18px;padding:11px 18px;font-size:14.5px;font-weight:700;transition:all .25s cubic-bezier(.16,1,.3,1);" sh="background:#2F2F2F;color:#fff;border:1px solid #2F2F2F;transform:translateY(-2px);">{opt.label}</Hx>
            ))}
          </div>
        )}
      </div>
      <p style={cx('margin:16px 0 0;font-size:13px;line-height:1.5;color:#5F5F5F;')}>{AGENT_NAME} даёт только предварительную оценку — точную стоимость команда зафиксирует после обсуждения задачи</p>
    </div>
  );
}
