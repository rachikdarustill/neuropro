'use client';
import { useState } from 'react';
import Link from 'next/link';
import { cx } from '@/lib/style';
import { Hx } from '@/components/Hx';
import { sendLead } from '@/lib/lead';
import { anCfg, anDefs, anExtraDefs, anCompute } from '@/lib/analysis';

// Экспресс-оценка эффекта от ИИ: пять быстрых вопросов → результат → необязательное
// уточнение из шести вопросов → заявка. Вёрстка и тексты — как в исходном разделе,
// расчёт целиком в @/lib/analysis.
//
// Адаптив вынесен в globals.css по data-r: на ширине до 1040px тёмная боковая
// колонка дублировала бы шапку раздела, поэтому сжимается до строки прогресса.

const EYEBROW = 'margin:0;font-size:13px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#5F5F5F;';
const EYEBROW_DARK = 'margin:0;font-size:13px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.7);';
const TILE = 'border:1px solid #D0D0D0;border-radius:14px;background:#fff;';
const DARK = 'background:#2F2F2F;color:#fff;border-radius:18px;';

const BTN = 'font-family:inherit;display:inline-flex;align-items:center;justify-content:center;gap:9px;border-radius:18px;padding:16px 32px;font-size:16px;font-weight:700;border:1px solid transparent;cursor:pointer;transition:transform .3s cubic-bezier(.16,1,.3,1),box-shadow .3s,background .25s,color .25s;';
const BTN_PRIMARY = BTN + 'background:#2F2F2F;color:#fff;';
const BTN_GHOST = BTN + 'background:#fff;color:#2F2F2F;border:1px solid #5F5F5F;';
const HOVER_PRIMARY = 'transform:translateY(-3px);box-shadow:0 16px 34px rgba(0,0,0,.25);';
const HOVER_GHOST = 'transform:translateY(-3px);box-shadow:0 14px 30px -16px rgba(0,0,0,.3);';
const OFF = 'opacity:.45;cursor:not-allowed;transform:none;box-shadow:none;';

const FIELD_INPUT = 'font-family:inherit;font-size:16px;color:#fff;background:transparent;border:0;border-bottom:1px solid rgba(255,255,255,.28);padding:11px 2px;outline:none;transition:border-color .25s ease;width:100%;';

function Btn({ kind = 'primary', disabled, children, ...rest }) {
  const base = (kind === 'primary' ? BTN_PRIMARY : BTN_GHOST) + (disabled ? OFF : '');
  return (
    <Hx as="button" type="button" disabled={disabled} s={base}
      sh={disabled ? undefined : (kind === 'primary' ? HOVER_PRIMARY : HOVER_GHOST)} {...rest}>
      {children}
    </Hx>
  );
}

function Opt({ on, children, onClick }) {
  return (
    <Hx as="button" type="button" onClick={onClick}
      s={'font-family:inherit;border-radius:14px;padding:13px 18px;font-size:15px;font-weight:700;cursor:pointer;transition:all .2s ease;'
        + (on ? 'background:#2F2F2F;color:#fff;border:1px solid #2F2F2F;' : 'background:#fff;color:#2F2F2F;border:1px solid #D0D0D0;')}
      sh={on ? undefined : 'border:1px solid #2F2F2F;'}>
      {children}
    </Hx>
  );
}

function labelOf(options, v) {
  const hit = (options || []).find((o) => o[0] === v);
  return hit ? hit[1] : '—';
}

// Короткие подписи для письма в Telegram: relay отдаёт заявку одним полем
// message и обрезает его на 1000 символах, поэтому расчёт пишем сжато.
const SHORT = {
  process: 'Процесс', load: 'Нагрузка', cost: 'Стоимость', std: 'Повторяемость', role: 'Формат',
  dataReady: 'Данные', access: 'Доступ', integr: 'Интеграции', check: 'Контроль',
  risk: 'Риск', realize: 'Эффект',
};

export default function AiEffectWizard() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [ans, setAns] = useState({});
  const [extra, setExtra] = useState({});
  const [exOpen, setExOpen] = useState(false);
  const [exStep, setExStep] = useState(0);
  const [exDraft, setExDraft] = useState({});
  const [leadKind, setLeadKind] = useState(null);
  const [leadSent, setLeadSent] = useState(false);

  const total = anDefs.length;
  const idx = Math.min(step, total - 1);
  const def = anDefs[idx];
  const pct = done ? 100 : Math.round(((idx + 1) / total) * 100);

  function restart() {
    setStep(0); setDone(false); setAns({}); setExtra({});
    setExOpen(false); setExStep(0); setExDraft({});
    setLeadKind(null); setLeadSent(false);
  }

  function opts(key, pairs) {
    return (
      <div style={cx('display:flex;flex-wrap:wrap;gap:10px;margin:18px 0 26px;')}>
        {pairs.map(([v, label]) => (
          <Opt key={v} on={ans[key] === v} onClick={() => setAns({ ...ans, [key]: v })}>{label}</Opt>
        ))}
      </div>
    );
  }

  /* ---------- боковая колонка ---------- */
  const aside = (
    <aside data-r="anAside" style={cx('background:#2F2F2F;color:#fff;border-radius:18px;padding:clamp(26px,3vw,34px);display:flex;flex-direction:column;gap:20px;align-self:start;position:sticky;top:110px;')}>
      <p data-r="anAsideFull" style={cx(EYEBROW_DARK)}>Экспресс-оценка эффекта от ИИ</p>
      <p data-r="anAsideFull" style={cx('margin:0;font-size:15.5px;line-height:1.6;color:rgba(255,255,255,.72);')}>Пять коротких шагов. Обычно расчёт занимает 1–2 минуты.</p>

      <div data-r="anProgress" style={cx('display:grid;grid-template-columns:1fr auto;gap:6px 12px;align-items:center;font-size:13.5px;font-weight:700;')}>
        <span>{done ? 'Расчёт готов' : `Шаг ${idx + 1} из ${total}`}</span>
        <span style={cx('text-align:right;')}>{pct}%</span>
        <span data-r="anBar" style={cx('grid-column:1/-1;display:block;height:4px;border-radius:999px;background:rgba(255,255,255,.2);overflow:hidden;')}>
          <i data-r="anBarFill" style={{ ...cx('display:block;height:100%;background:#fff;transition:width .4s ease;'), width: `${pct}%` }} />
        </span>
      </div>

      <ol data-r="anAsideFull" style={cx('list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:2px;')}>
        {anDefs.map((d, i) => {
          const state = done || i < idx ? 'done' : (i === idx ? 'active' : 'locked');
          const enabled = done || i <= idx;
          return (
            <li key={d.key}>
              <button type="button" disabled={!enabled} onClick={() => { setStep(i); setDone(false); }}
                style={cx('display:flex;align-items:center;gap:12px;width:100%;background:none;border:0;padding:11px 0;text-align:left;font-family:inherit;font-size:15px;font-weight:700;'
                  + (enabled ? 'cursor:pointer;' : 'cursor:default;opacity:.45;')
                  + (state === 'active' ? 'color:#fff;' : state === 'done' ? 'color:rgba(255,255,255,.75);' : 'color:inherit;'))}>
                <span style={cx('font-size:12px;font-variant-numeric:tabular-nums;color:rgba(255,255,255,.5);width:22px;flex:none;')}>{String(i + 1).padStart(2, '0')}</span>
                <span>{d.name}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <p data-r="anAsideFull" style={cx('margin:0;font-size:12.5px;line-height:1.55;color:rgba(255,255,255,.45);')}>Ответы используются только для предварительной оценки и не передаются третьим лицам.</p>
    </aside>
  );

  /* ---------- вопрос ---------- */
  const answered = def.dual ? (ans[def.aKey] != null && ans[def.bKey] != null) : (ans[def.key] != null);

  const question = (
    <div>
      <p style={cx(EYEBROW)}>Вопрос {idx + 1} из {total} · {def.name}</p>
      <h2 style={cx('margin:12px 0 10px;font-size:clamp(22px,2.4vw,32px);line-height:1.1;letter-spacing:-.025em;font-weight:700;text-wrap:balance;')}>{def.q}</h2>
      {def.info && <p style={cx('margin:0 0 20px;font-size:14.5px;line-height:1.6;color:#5F5F5F;')}>{def.info}</p>}

      {def.dual ? (
        <div data-r="anDual" style={cx('display:grid;grid-template-columns:1fr 1fr;gap:clamp(18px,2.5vw,32px);')}>
          <div>
            <p style={cx('margin:0 0 4px;font-size:14px;font-weight:700;color:#5F5F5F;')}>{def.aLabel}</p>
            {opts(def.aKey, def.aOptions)}
          </div>
          <div>
            <p style={cx('margin:0 0 4px;font-size:14px;font-weight:700;color:#5F5F5F;')}>{def.bLabel}</p>
            {opts(def.bKey, def.bOptions)}
          </div>
        </div>
      ) : (
        <>
          {opts(def.key, def.options)}
          {def.key === 'process' && ans.process === 'other' && (
            <Hx as="input" type="text" aria-label="Опишите процесс одним предложением"
              placeholder="Опишите процесс одним предложением" value={ans.processOther || ''}
              onChange={(e) => setAns({ ...ans, processOther: e.target.value })}
              s="font-family:inherit;font-size:16px;width:100%;padding:13px 15px;border:1px solid #D0D0D0;border-radius:14px;margin-bottom:24px;outline:none;"
              sf="border:1px solid #2F2F2F;" />
          )}
        </>
      )}

      <div style={cx('display:flex;flex-wrap:wrap;gap:12px;')}>
        {idx > 0 && <Btn kind="ghost" onClick={() => { setStep(idx - 1); setDone(false); }}>Назад</Btn>}
        <Btn disabled={!answered} onClick={() => { if (step < total - 1) setStep(step + 1); else setDone(true); }}>
          {idx === total - 1 ? 'Показать результат' : 'Далее'}
        </Btn>
      </div>

      <p data-r="anQNote" style={cx('display:none;margin:22px 0 0;font-size:12.5px;line-height:1.55;color:#5F5F5F;')}>Ответы используются только для предварительной оценки и не передаются третьим лицам.</p>
    </div>
  );

  /* ---------- уточнение оценки ---------- */
  const exTotal = anExtraDefs.length;
  const exI = Math.min(exStep, exTotal - 1);
  const exDef = anExtraDefs[exI];
  const exAnswered = exDraft[exDef.key] != null;
  const exAll = anExtraDefs.every((q) => exDraft[q.key] != null);
  const exLast = exI === exTotal - 1;

  const refineBlock = (
    <div style={cx(TILE + 'padding:clamp(20px,2.6vw,30px);')}>
      <p style={cx(EYEBROW)}>Уточнение оценки · {exI + 1} из {exTotal}</p>
      <span style={cx('display:block;height:4px;border-radius:999px;background:#D0D0D0;overflow:hidden;margin:8px 0 14px;')}>
        <i style={{ ...cx('display:block;height:100%;background:#2F2F2F;transition:width .4s ease;'), width: `${Math.round(((exI + 1) / exTotal) * 100)}%` }} />
      </span>
      <h3 style={cx('margin:0;font-size:21px;line-height:1.25;letter-spacing:-.025em;font-weight:700;')}>{exDef.name}</h3>
      <p style={cx('margin:6px 0 10px;font-size:19px;line-height:1.6;font-weight:700;')}>{exDef.q}</p>
      {exDef.info && <p style={cx('margin:0 0 20px;font-size:14.5px;line-height:1.6;color:#5F5F5F;')}>{exDef.info}</p>}

      <div style={cx('display:flex;flex-wrap:wrap;gap:10px;margin:18px 0 26px;')}>
        {exDef.options.map(([v, label]) => (
          <Opt key={v} on={exDraft[exDef.key] === v} onClick={() => setExDraft({ ...exDraft, [exDef.key]: v })}>{label}</Opt>
        ))}
      </div>

      <div style={cx('display:flex;flex-wrap:wrap;gap:12px;')}>
        {exI > 0 && <Btn kind="ghost" onClick={() => setExStep(Math.max(exI - 1, 0))}>Назад</Btn>}
        {exLast ? (
          <Btn disabled={!exAll} onClick={() => { setExtra({ ...exDraft }); setExOpen(false); }}>Обновить оценку</Btn>
        ) : (
          <Btn disabled={!exAnswered} onClick={() => setExStep(Math.min(exI + 1, exTotal - 1))}>Далее</Btn>
        )}
        <Btn kind="ghost" onClick={() => { setExOpen(false); setExDraft({}); setExStep(0); }}>Отменить уточнение</Btn>
      </div>
    </div>
  );

  /* ---------- результат ---------- */
  const res = done ? anCompute(ans, extra) : null;

  function submitLead(e) {
    e.preventDefault();
    const form = e.target;
    const data = {};
    form.querySelectorAll('input').forEach((inp) => {
      if (inp.type === 'checkbox' || inp.type === 'hidden') return;
      if (inp.name && inp.value.trim()) data[inp.name] = inp.value.trim();
    });

    // Relay пересылает в Telegram только name/company/phone/email/message,
    // поэтому расчёт и должность уходят внутри message — иначе менеджеру
    // пришлось бы выспрашивать заново то, что человек уже ответил калькулятору.
    const role = data.role || '';
    delete data.role;
    const m = Object.fromEntries(res.metrics.map((x) => [x.label, x.value]));
    const other = (ans.processOther || '').slice(0, 120);

    data.message = [
      `Заявка: ${leadKind === 'talk' ? 'разговор с архитектором' : 'подробный расчёт'}${role ? ' · ' + role : ''}`,
      `Индекс ${res.index}/100 — ${res.verdict} (${res.precision})`, '',
      ...anDefs.map((d) => (d.dual
        ? `${SHORT[d.key]}: ${labelOf(d.aOptions, ans[d.aKey])} / ${labelOf(d.bOptions, ans[d.bKey])}`
        : `${SHORT[d.key]}: ${labelOf(d.options, ans[d.key])}${d.key === 'process' && other ? ' — ' + other : ''}`)),
      ...(res.refined ? anExtraDefs.map((d) => `${SHORT[d.key]}: ${labelOf(d.options, extra[d.key])}`) : []), '',
      `Ручная нагрузка: ${m['Текущая ручная нагрузка']} → высвобождается ${m['Потенциально высвобождаемое время']}`,
      `Пилот: ${m['Разработка пилота']} · ${m['Стоимость пилота']}`,
      `Эффект/мес: ${m['Реальный эффект в месяц']} · расходы на ИИ ${m['Ежемесячные расходы на ИИ']}`,
      `Окупаемость: ${m['Предварительная окупаемость']}`,
      `Методика ${anCfg.methodVersion}`,
    ].join('\n').slice(0, 990);

    sendLead(data);
    setLeadSent(true);
    if (form.reset) form.reset();
  }

  const talk = leadKind === 'talk';
  const leadBlock = leadSent ? (
    <div style={cx(DARK + 'padding:clamp(26px,3.4vw,42px);margin-top:6px;')}>
      <h3 style={cx('margin:0 0 12px;color:#fff;font-size:clamp(20px,2.2vw,28px);line-height:1.25;letter-spacing:-.025em;font-weight:700;')}>{talk ? 'Заявка на разговор принята' : 'Расчёт отправим на почту'}</h3>
      <p style={cx('margin:0;font-size:16px;line-height:1.6;color:rgba(255,255,255,.72);')}>{talk
        ? 'Архитектор ИИ-решений свяжется в течение рабочего дня и предложит удобное время.'
        : 'Архитектор ИИ-решений посмотрит ваш сценарий и свяжется в течение рабочего дня.'}</p>
    </div>
  ) : (
    <div style={cx(DARK + 'padding:clamp(26px,3.4vw,42px);margin-top:6px;')}>
      <p style={cx(EYEBROW_DARK)}>{talk ? 'Разговор с архитектором' : 'Подробный расчёт'}</p>
      <h3 style={cx('margin:12px 0;color:#fff;font-size:clamp(20px,2.2vw,28px);line-height:1.25;letter-spacing:-.025em;font-weight:700;')}>{talk
        ? 'Обсудим ваш процесс с архитектором ИИ-решений'
        : 'Пришлём разбор процесса с ограничениями, архитектурой и метриками пилота'}</h3>
      <p style={cx('margin:0 0 24px;font-size:16px;line-height:1.6;color:rgba(255,255,255,.72);')}>{talk
        ? 'Созвон на 30 минут: разберём процесс, ограничения по данным и безопасности, наметим формат пилота и его метрики. Без презентаций и продаж.'
        : 'Расчёт на основе ваших ответов: сценарий, требования к данным и интеграциям, состав команды, сроки и метрики пилота.'}</p>

      <form onSubmit={submitLead} className="npp-darkform" style={cx('display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:22px;')}>
        {[['Имя', 'name', 'text', true], ['Компания', 'company', 'text', true], ['Должность', 'role', 'text', false], ['Рабочая почта', 'email', 'email', true]].map(([label, name, type, req]) => (
          <label key={name} style={cx('display:flex;flex-direction:column;gap:7px;')}>
            <span style={cx('font-size:12.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.7);')}>{label}</span>
            <Hx as="input" name={name} type={type} required={req} s={FIELD_INPUT} sf="border-bottom:1px solid #fff;" />
          </label>
        ))}
        <label style={cx('grid-column:1/-1;display:flex;align-items:flex-start;gap:12px;cursor:pointer;margin-top:2px;')}>
          <input type="checkbox" required style={cx('width:18px;height:18px;margin-top:1px;accent-color:#fff;cursor:pointer;flex:none;')} />
          <span style={cx('font-size:13.5px;line-height:1.5;color:rgba(255,255,255,.7);')}>Я согласен с <Link href="/legal/policy" style={cx('color:rgba(255,255,255,.9);text-decoration:underline;cursor:pointer;')}>политикой обработки персональных данных</Link></span>
        </label>
        <div style={cx('grid-column:1/-1;margin-top:8px;')}>
          <Hx as="button" type="submit" s={BTN + 'background:#fff;color:#2F2F2F;'} sh="transform:translateY(-3px);box-shadow:0 18px 38px rgba(0,0,0,.35);background:#E6E6E6;">
            {talk ? 'Записаться на разговор' : 'Получить подробный расчёт'}
          </Hx>
        </div>
      </form>
    </div>
  );

  const result = res && (
    <div style={cx('display:flex;flex-direction:column;gap:26px;')}>
      <div>
        <p style={cx(EYEBROW)}>Заключение</p>
        <h2 style={cx('margin:12px 0;font-size:clamp(26px,3.6vw,44px);line-height:1.1;letter-spacing:-.025em;font-weight:700;text-wrap:balance;')}>{res.verdict}</h2>
        <p style={cx('margin:0;font-size:clamp(16.5px,1.4vw,18px);line-height:1.65;color:#5F5F5F;')}>{res.summary}</p>
      </div>

      <div style={cx(DARK + 'padding:clamp(24px,3vw,34px);')}>
        <p style={cx(EYEBROW_DARK)}>Индекс экономического потенциала</p>
        <p style={cx('margin:12px 0 10px;font-size:clamp(44px,6vw,76px);font-weight:800;letter-spacing:-.04em;line-height:1;')}>
          {res.index}<span style={cx('font-size:18px;font-weight:700;color:rgba(255,255,255,.5);margin-left:8px;')}>/ 100</span>
        </p>
        <p style={cx('margin:0;font-size:17px;font-weight:700;')}>Потенциал {res.level}</p>
        <p style={cx('margin:6px 0 0;font-size:14px;color:rgba(255,255,255,.6);')}>{res.precision}</p>
      </div>

      <div style={cx('display:grid;grid-template-columns:repeat(auto-fit,minmax(min(240px,100%),1fr));gap:16px;')}>
        {res.metrics.map((m) => (
          <div key={m.label} style={cx(TILE + 'padding:20px;')}>
            <p style={cx('margin:0;font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#5F5F5F;')}>{m.label}</p>
            <p style={cx('margin:8px 0 6px;font-size:22px;font-weight:800;letter-spacing:-.02em;')}>{m.value}</p>
            <p style={cx('margin:0;font-size:13.5px;line-height:1.5;color:#5F5F5F;')}>{m.note}</p>
          </div>
        ))}
      </div>

      <div style={cx(TILE + 'padding:clamp(20px,2.4vw,28px);display:flex;flex-direction:column;gap:10px;')}>
        <p style={cx(EYEBROW)}>Рекомендуемый старт</p>
        <p style={cx('margin:0;font-size:16.5px;line-height:1.6;')}>{res.startWith}</p>
        <p style={cx('margin:0;color:#5F5F5F;')}><strong>Контроль сотрудника:</strong> {res.control}</p>
      </div>

      {exOpen ? refineBlock : (
        <div style={cx('display:flex;flex-wrap:wrap;align-items:center;gap:12px 18px;')}>
          {res.refined ? (
            <p style={cx('margin:0;font-size:15px;font-weight:700;')}>Оценка уточнена: учтены данные, интеграции, контроль и последствия ошибки</p>
          ) : (
            <>
              <Btn kind="ghost" onClick={() => { setExOpen(true); setExStep(0); setExDraft({}); }}>Уточнить оценку</Btn>
              <p style={cx('margin:0;font-size:13.5px;color:#5F5F5F;')}>6 коротких вопросов • около 1 минуты</p>
            </>
          )}
        </div>
      )}

      <details style={cx('border-top:1px solid #D0D0D0;padding-top:18px;')}>
        <summary style={cx('cursor:pointer;font-weight:700;font-size:15.5px;')}>Как считаем</summary>
        <p style={cx('margin:12px 0 0;font-size:14.5px;line-height:1.65;color:#5F5F5F;')}><strong>Стоимость пилота.</strong> Человеко-часы × коэффициент сложности процесса × ставка разработки {res.devRateText}/ч + резерв проекта {res.reserveText}.</p>
        <p style={cx('margin:12px 0 0;font-size:14.5px;line-height:1.65;color:#5F5F5F;')}><strong>Реальный эффект в месяц.</strong> Стоимость процесса × доля автоматизации × коэффициент реализации − ежемесячные расходы на ИИ.</p>
        <p style={cx('margin:12px 0 0;font-size:14.5px;line-height:1.65;color:#5F5F5F;')}><strong>Коэффициент реализации.</strong> {res.realizeText}. Уточняется в вопросе о судьбе высвобожденного времени.</p>
        <p style={cx('margin:12px 0 0;font-size:14.5px;line-height:1.65;color:#5F5F5F;')}>Расходы на модели, инфраструктуру, поддержку, подготовку данных и интеграции учтены оценочно. Оценка предварительная и предназначена для выбора формата пилота. Фактический эффект зависит от качества данных, интеграций, требований к безопасности и результатов тестирования на реальном процессе.</p>
        {res.refined && <p style={cx('margin:12px 0 0;font-size:14.5px;line-height:1.65;color:#5F5F5F;')}>Оценка учитывает ваши ответы о данных, интеграциях, контроле и последствиях ошибки, но остаётся предварительной. Точные сроки, стоимость и метрики фиксируются после диагностики процесса.</p>}
      </details>

      <div style={cx('display:flex;flex-wrap:wrap;gap:12px;margin-top:28px;')}>
        <Btn onClick={() => { setLeadKind('calc'); setLeadSent(false); }}>Получить подробный расчёт</Btn>
        <Btn kind="ghost" onClick={() => { setLeadKind('talk'); setLeadSent(false); }}>Обсудить с архитектором</Btn>
        <Btn kind="ghost" onClick={restart}>Пересчитать</Btn>
      </div>

      {leadKind && leadBlock}
    </div>
  );

  return (
    <div data-r="anGrid" style={cx('display:grid;grid-template-columns:minmax(280px,340px) minmax(0,1fr);gap:clamp(20px,3vw,44px);padding:clamp(32px,5vw,64px) clamp(24px,4vw,56px) clamp(40px,6vw,80px);')}>
      {aside}
      <div style={cx('min-width:0;')}>{done ? result : question}</div>
    </div>
  );
}
