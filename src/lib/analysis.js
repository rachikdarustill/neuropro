// Методика экспресс-оценки эффекта от ИИ.
//
// Перенесено дословно из npp-logic.js (пакет neuropro-site-20260825): anCfg,
// anDefs, anExtraDefs и anCompute. Формулы, коэффициенты и тексты не менялись —
// изменён только способ подключения (IIFE на window → ES-модуль), поэтому
// расчёт даёт те же числа, что и смоук-тест автора методики.
//
// Правки формул согласуются с владельцем методики: вместе с изменениями
// поднимается anCfg.methodVersion.

export const anCfg = {
  methodVersion: '1.1 от 18.08.2026',
  costPerHour: 1500,
  costPerHourUpdated: 'август 2026',
  // DEV_RATE — ставка разработки НейроПро+, ₽ за человеко-час.
  devRate: 5000,
  // Резерв проекта (интеграции, подготовка данных, доработки)
  reserveLo: .15, reserveHi: .20,
  OPS: { o100:[1,100], o500:[101,500], o2000:[501,2000], o10000:[2001,10000], o10000p:[10000,20000] },
  TIME: { t5:[1,5], t15:[6,15], t30:[16,30], t60:[31,60], t60p:[60,120] },
  COST: { c200:[100,200], c500:[200,500], c1500:[500,1500], c5000:[1500,5000], c5000p:[5000,9000] },
  AUTOMATION_BASE: { support:.45, sales:.35, docs:.50, ops:.40, analytics:.40, other:.35 },
  REPEATABILITY: { rules:1.15, mostly:1.00, expert:.75, chaotic:.55, unknown:.80 },
  ROLE_SHARE: { draft:.70, confirm:.90, auto12:1.05, auto3:1.20, unknown:.90 },
  PILOT_HOURS: { draft:[250,400], confirm:[400,650], auto12:[650,1000], auto3:[1000,1600], unknown:[400,700] },
  // Коэффициент сложности процесса (по повторяемости)
  PROCESS_K: { rules:.85, mostly:1.00, chaotic:1.25, expert:1.40, unknown:1.10 },
  // Коэффициент реализации эффекта: превращается ли высвобожденное время в деньги
  REALIZE: { hard:.5, reassign:.7, cut:.9, unknown:.6 },
  // Ежемесячные расходы на эксплуатацию ИИ: модели, инфраструктура, поддержка, ₽/мес
  OPS_MONTHLY: { draft:35000, confirm:50000, auto12:75000, auto3:120000, unknown:50000 },
  OPS_INTEGR: { none:.85, one:1.00, two:1.15, three:1.35, unknown:1.15 },
  DEV_K: {
    dataReady:{ one:.90, several:1.00, documents:1.15, scattered:1.30, unknown:1.10 },
    access:{ auto:.90, export:1.00, manual:1.10, no:1.25, unknown:1.10 },
    integr:{ none:.90, one:1.00, two:1.15, three:1.35, unknown:1.15 },
    check:{ each:.95, sample:1.00, exceptions:1.10, hard:1.25, unknown:1.10 },
    risk:{ low:.95, client:1.05, money:1.15, legal:1.30, unknown:1.10 }
  },
  SCORE: {
    dataReady:{ one:95, several:80, documents:60, scattered:35, unknown:50 },
    access:{ auto:95, export:80, manual:55, no:30, unknown:50 },
    integr:{ none:90, one:80, two:65, three:45, unknown:55 },
    check:{ each:85, sample:80, exceptions:70, hard:25, unknown:55 },
    risk:{ low:90, client:75, money:55, legal:25, unknown:50 },
    realize:{ cut:95, reassign:75, hard:40, unknown:55 }
  },
  REP_SCORE: { rules:100, mostly:75, expert:45, chaotic:25, unknown:50 }
};

// Пять быстрых вопросов — обязательная часть расчёта.
export const anDefs = [
  { key:'process', name:'Процесс', q:'Какой процесс вы хотите улучшить с помощью ИИ?',
    info:'Выберите ближайший вариант. Точное описание можно будет добавить после расчёта.',
    options:[['support','Обращения и поддержка клиентов'],['sales','Продажи и подготовка коммерческих предложений'],['docs','Документы, извлечение и ввод данных'],['ops','Внутренние рутинные операции'],['analytics','Аналитика и отчётность'],['other','Другой процесс']] },
  { key:'load', name:'Текущая нагрузка', q:'Какой объём работы выполняется сейчас?', dual:true,
    aKey:'ops', aLabel:'Операций в месяц',
    aOptions:[['o100','1–100'],['o500','101–500'],['o2000','501–2 000'],['o10000','2 001–10 000'],['o10000p','Более 10 000'],['unknown','Сложно оценить объём']],
    bKey:'time', bLabel:'Среднее ручное время на операцию',
    bOptions:[['t5','До 5 минут'],['t15','6–15 минут'],['t30','16–30 минут'],['t60','31–60 минут'],['t60p','Более 60 минут'],['unknown','Сложно оценить время']],
    info:'Укажите приблизительное число типовых операций в месяц и среднее ручное время на одну операцию. Операция — это обращение, заявка, документ, звонок, задача или проверка.' },
  { key:'cost', name:'Стоимость процесса', q:'Сколько компания примерно тратит на этот процесс в месяц?',
    info:'Учитывайте зарплаты с начислениями, подрядчиков и регулярные расходы на выполнение процесса. Достаточно приблизительной оценки.',
    options:[['c200','Менее 200 тыс. ₽'],['c500','200–500 тыс. ₽'],['c1500','500 тыс. – 1,5 млн ₽'],['c5000','1,5–5 млн ₽'],['c5000p','Более 5 млн ₽'],['unknown','Сложно оценить']] },
  { key:'std', name:'Повторяемость', q:'Насколько работа выполняется по одинаковым правилам?',
    info:'Оцените не качество данных, а повторяемость действий и решений сотрудников.',
    options:[['rules','Почти всегда по одним и тем же правилам'],['mostly','В основном одинаково, но бывают исключения'],['expert','Часто требуется индивидуальное решение специалиста'],['chaotic','Процесс сильно меняется и пока не формализован'],['unknown','Сложно оценить']] },
  { key:'role', name:'Формат первого решения', q:'Что ИИ должен делать на первом этапе?',
    info:'Если вы не уверены, калькулятор предложит безопасный стартовый вариант.',
    options:[['draft','Находить информацию и готовить черновик или рекомендацию'],['confirm','Выполнять действие, а сотрудник будет подтверждать результат'],['auto12','Самостоятельно обрабатывать типовые случаи и передавать сложные сотруднику'],['auto3','Вести процесс целиком без постоянного участия сотрудника'],['unknown','Не знаю — предложите подходящий формат']] }
];

// Шесть уточняющих вопросов — необязательный второй проход («Уточнить оценку»).
export const anExtraDefs = [
  { key:'dataReady', name:'Готовность данных', q:'Насколько данные процесса готовы для работы ИИ?',
    info:'Выберите наиболее близкое состояние на текущий момент.',
    options:[['one','В основном в одной системе и упорядочены'],['several','В нескольких системах, но их можно объединить или выгрузить'],['documents','В основном в документах, письмах, таблицах или сообщениях'],['scattered','Данные разрознены, неполны или многое хранится вручную'],['unknown','Не знаю']] },
  { key:'access', name:'Доступ к данным', q:'Как данные можно получать для работы пилота?',
    info:'Если способ подключения неизвестен, выберите «Не знаю» — это нормальный ответ. Автоматически — через программный интерфейс или готовый коннектор.',
    options:[['auto','Можно подключаться автоматически'],['export','Можно регулярно выгружать файлы или отчёты'],['manual','Данные можно передавать только вручную'],['no','Регулярного доступа пока нет'],['unknown','Не знаю']] },
  { key:'integr', name:'Интеграции', q:'Со сколькими системами должен работать ИИ в пилоте?',
    info:'Считайте только системы, из которых нужно получать данные или в которые нужно записывать результат.',
    options:[['none','Без интеграций — только файлы или отдельный интерфейс'],['one','С одной системой'],['two','С двумя системами'],['three','С тремя и более системами'],['unknown','Пока не определено']] },
  { key:'check', name:'Контроль результата', q:'Как сотрудник сможет проверять результат ИИ на пилоте?',
    info:'Речь идёт именно о первом, контролируемом этапе внедрения.',
    options:[['each','Проверять каждое действие'],['sample','Проверять часть результатов выборочно'],['exceptions','Проверять только исключения и спорные случаи'],['hard','Надёжно проверить результат трудно'],['unknown','Пока не определено']] },
  { key:'risk', name:'Последствия ошибки', q:'К чему может привести ошибка ИИ?',
    info:'Выберите наиболее серьёзное реалистичное последствие.',
    options:[['low','Потребуется только ручное исправление'],['client','Возможна задержка или жалоба клиента'],['money','Возможны финансовые потери'],['legal','Возможны юридические последствия, нарушение безопасности или ущерб здоровью'],['unknown','Сложно оценить']] },
  { key:'realize', name:'Реализация эффекта', q:'Что произойдёт с высвобожденным временем сотрудников?',
    info:'Это ключевой вопрос для честной окупаемости: эффект считается деньгами только в той части, которую компания действительно реализует.',
    options:[['cut','Сократятся расходы или вырастет пропускная способность без найма'],['reassign','Сотрудников переключим на другие полезные задачи'],['hard','Высвобожденное время сложно монетизировать'],['unknown','Пока не решили']] }
];

// Ставка разработки. Точка переопределения из исходника (проп devRate);
// на сайте всегда действует ставка из anCfg.
function anRate() { return anCfg.devRate; }

// A — ответы на пять быстрых вопросов, E — на шесть уточняющих (может быть пустым).
export function anCompute(A, E) {
  const C = anCfg;
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const mid = r => (r[0] + r[1]) / 2;

  const loadKnown = !!(A.ops && A.ops !== 'unknown' && A.time && A.time !== 'unknown');
  const hMid = loadKnown ? mid(C.OPS[A.ops]) * mid(C.TIME[A.time]) / 60 : null;

  const roleKey = A.role || 'unknown';
  const share = clamp((C.AUTOMATION_BASE[A.process] || .35) * (C.REPEATABILITY[A.std] || .80) * (C.ROLE_SHARE[roleKey] || .90), .10, .70);
  const shLo = share * .85, shHi = Math.min(share * 1.15, .75);

  const extendedDone = anExtraDefs.every(q => E && E[q.key] != null);
  const devRate = anRate();
  const procK = C.PROCESS_K[A.std] != null ? C.PROCESS_K[A.std] : C.PROCESS_K.unknown;
  let devMultiplier = procK;
  if (extendedDone) {
    let p = 1;
    Object.keys(C.DEV_K).forEach(k => { const m = C.DEV_K[k][E[k]]; if (m) p *= m; });
    devMultiplier = procK * clamp(p, .80, 1.75);
  }
  const base = C.PILOT_HOURS[roleKey] || C.PILOT_HOURS.unknown;
  const dLo = base[0] * devMultiplier, dHi = base[1] * devMultiplier;
  const devCostLo = dLo * devRate * (1 + C.reserveLo);
  const devCostHi = dHi * devRate * (1 + C.reserveHi);

  const realizeKey = (E && E.realize) || 'unknown';
  const realizeK = C.REALIZE[realizeKey] != null ? C.REALIZE[realizeKey] : C.REALIZE.unknown;
  const opsBase = C.OPS_MONTHLY[roleKey] || C.OPS_MONTHLY.unknown;
  const opsK = (E && C.OPS_INTEGR[E.integr]) || 1;
  const monthlyOps = Math.round(opsBase * opsK / 5000) * 5000;

  const costKnown = !!(A.cost && A.cost !== 'unknown');
  const monthlyCost = costKnown ? mid(C.COST[A.cost]) * 1000 : (loadKnown ? hMid * C.costPerHour : null);
  const gross = monthlyCost != null ? monthlyCost * ((shLo + shHi) / 2) : null;
  const savings = gross != null ? gross * realizeK - monthlyOps : null;
  const netPositive = savings != null && savings > 0;
  const pbLo = netPositive ? devCostLo / savings : null;
  const pbHi = netPositive ? devCostHi / savings : null;

  const economics = netPositive ? clamp(savings * 12 / (((devCostLo + devCostHi) / 2) || 1) / 3, 0, 1) * 100 : (savings != null ? 8 : 50);
  const repeat = C.REP_SCORE[A.std] != null ? C.REP_SCORE[A.std] : 50;
  const volume = !loadKnown ? 50 : hMid < 40 ? 20 : hMid < 160 ? 50 : hMid < 400 ? 75 : hMid < 800 ? 90 : 100;
  let feasibility = 60;
  if (extendedDone) {
    const keys = Object.keys(C.SCORE);
    feasibility = keys.reduce((a, k) => a + (C.SCORE[k][E[k]] != null ? C.SCORE[k][E[k]] : 50), 0) / keys.length;
    if (E.risk === 'legal' || E.check === 'hard') feasibility = Math.min(feasibility, 40);
  }
  const index = Math.round(clamp(.40 * economics + .25 * repeat + .20 * volume + .15 * feasibility, 0, 100));

  const quickUnknown = ['ops','time','cost','std','role'].filter(k => !A[k] || A[k] === 'unknown').length;
  const extraUnknown = extendedDone ? anExtraDefs.filter(q => E[q.key] === 'unknown').length : 0;
  const unknownCount = quickUnknown + extraUnknown;
  const precision = extendedDone && unknownCount === 0 ? 'Уточнённая оценка'
    : unknownCount <= 2 ? 'Предварительная оценка' : 'Ориентировочная оценка';

  const level = index>=80 ? 'очень высокий' : index>=60 ? 'высокий' : index>=40 ? 'умеренный' : 'низкий';
  const verdict = index>=80 ? 'Очень высокий экономический потенциал' : index>=60 ? 'Высокий экономический потенциал'
    : index>=40 ? 'Умеренный экономический потенциал' : 'Низкий экономический потенциал на текущий момент';
  const summary = index>=80 ? 'Процесс хорошо подходит для ИИ — разумный следующий шаг: пилот на ограниченном участке.'
    : index>=60 ? 'Эффект вероятен — стоит начать с одного контролируемого сценария.'
    : index>=40 ? 'Эффект возможен, но сначала стоит проверить данные и экономику процесса на небольшом объёме.'
    : 'Сейчас эффект маловероятен: процесс стоит сначала упорядочить и подготовить данные.';

  const forceHuman = extendedDone && (E.risk === 'legal' || E.check === 'hard');
  let startWith = {
    draft:'ИИ находит информацию и готовит черновик или рекомендацию, сотрудник проверяет результат. После подтверждения качества сценарий можно расширять.',
    confirm:'ИИ выполняет операцию, сотрудник подтверждает результат. После проверки качества можно передавать ИИ типовые случаи полностью.',
    auto12:'Начать с работы под подтверждением сотрудника на одном типе случаев, затем открыть самостоятельную обработку типовых обращений.',
    auto3:'Начать с одного участка процесса под контролем сотрудника и только затем переходить к сквозному сценарию без постоянного участия человека.',
    unknown:'Безопасный старт: ИИ выполняет операцию, а сотрудник подтверждает результат. Дальше расширяем автономность по факту качества.'
  }[roleKey] || 'ИИ готовит результат, сотрудник проверяет и подтверждает его.';
  if (forceHuman) startWith = 'ИИ выполняет операцию, но результат обязательно подтверждает сотрудник: последствия ошибки или сложность проверки не позволяют начинать с автономного режима. Автономность расширяем только после накопленной статистики качества.';
  const control = forceHuman ? 'Обязательное подтверждение человеком на каждом действии пилота'
    : roleKey === 'draft' ? 'Сотрудник проверяет каждый черновик'
    : roleKey === 'auto12' ? 'Выборочная проверка типовых случаев, ручной разбор сложных'
    : roleKey === 'auto3' ? 'Проверка исключений и спорных случаев'
    : 'Сотрудник подтверждает результат перед применением';

  const rh = n => n>=100 ? String(Math.round(n/10)*10) : String(Math.round(n));
  const rd = n => String(Math.round(n/50)*50);
  const pbText = (lo, hi) => {
    const l = Math.max(1, Math.round(lo)), h = Math.max(1, Math.round(hi));
    if (l > 18) return 'более 18 мес.';
    if (h > 18) return 'от ' + l + ' мес.';
    return (l === h ? String(l) : l + '–' + h) + ' мес.';
  };
  const hLo = loadKnown ? hMid*.85 : 0, hHi = loadKnown ? hMid*1.15 : 0;
  const fLo = loadKnown ? hMid*shLo*.95 : 0, fHi = loadKnown ? hMid*shHi*1.05 : 0;

  const fnum = v => {
    if (v >= 1000000) { const x = v/1000000; const s = x >= 10 ? String(Math.round(x)) : x.toFixed(1).replace(/\.0$/, '').replace('.', ','); return { n:s, u:'млн ₽' }; }
    return { n: String(Math.round(v/1000)), u:'тыс. ₽' };
  };
  const fm = v => { if (v == null) return '—'; const a = fnum(v); return a.n + ' ' + a.u; };
  const fmRange = (lo, hi) => {
    const a = fnum(lo), b = fnum(hi);
    return a.u === b.u ? (a.n === b.n ? a.n + ' ' + a.u : a.n + '–' + b.n + ' ' + a.u)
      : a.n + ' ' + a.u + ' – ' + b.n + ' ' + b.u;
  };
  const realizeLabel = { cut:'0,9 — расходы сокращаются или растёт пропускная способность', reassign:'0,7 — сотрудников переключат на другие задачи', hard:'0,5 — время сложно монетизировать', unknown:'0,6 — консервативное значение по умолчанию' }[realizeKey];

  return {
    index: String(index), level, verdict, summary, startWith, control, precision,
    refined: extendedDone, notEnoughLoad: !loadKnown, notEnoughCost: savings == null,
    devRateText: String(devRate).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽',
    realizeText: realizeLabel,
    reserveText: Math.round(C.reserveLo*100) + '–' + Math.round(C.reserveHi*100) + '%',
    metrics: [
      { label:'Текущая ручная нагрузка',
        value: loadKnown ? rh(hLo)+'–'+rh(hHi)+' часов' : 'Недостаточно данных',
        note: loadKnown ? 'в месяц' : 'Укажите объём и время для расчёта' },
      { label:'Потенциально высвобождаемое время',
        value: loadKnown ? rh(fLo)+'–'+rh(fHi)+' часов' : 'Недостаточно данных',
        note: loadKnown ? 'в месяц, диапазон для проверки на пилоте' : 'Укажите объём и время для расчёта' },
      { label:'Разработка пилота', value: rd(dLo)+'–'+rd(dHi)+' ч',
        note: 'человеко-часов' + (extendedDone ? ' с учётом данных, интеграций и контроля' : ', предварительная оценка') + '; коэффициент сложности процесса ×' + String(procK).replace('.', ',') },
      { label:'Стоимость пилота', value: fmRange(devCostLo, devCostHi),
        note: 'по ставке разработки ' + String(devRate).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽/ч, включая резерв проекта ' + Math.round(C.reserveLo*100) + '–' + Math.round(C.reserveHi*100) + '%' },
      { label:'Ежемесячные расходы на ИИ', value: fm(monthlyOps),
        note: 'модели и инфраструктура, поддержка, подготовка данных — оценка' },
      { label:'Реальный эффект в месяц',
        value: savings == null ? 'Нужны данные о затратах' : (netPositive ? fm(savings) : 'Пока не окупается'),
        note: savings == null ? 'Укажите стоимость процесса либо объём и время'
          : (netPositive ? 'после коэффициента реализации ' + realizeK.toFixed(1).replace('.', ',') + ' и вычета расходов на ИИ'
            : 'расходы на ИИ выше эффекта: нужен больший объём процесса') },
      { label:'Предварительная окупаемость',
        value: netPositive ? pbText(pbLo, pbHi) : (savings == null ? 'Нужны данные о затратах' : 'не достигается'),
        note: netPositive ? (costKnown ? 'по стоимости пилота с резервом, при подтверждении эффекта' : 'расчёт по стоимости часа ' + C.costPerHour + ' ₽ (' + C.costPerHourUpdated + ')')
          : (savings == null ? 'Укажите стоимость процесса либо объём и время'
            : 'эффект не покрывает ежемесячные расходы на ИИ — нужен больший объём процесса или более широкий сценарий') }
    ]
  };
}
