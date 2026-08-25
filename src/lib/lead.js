// Единая точка отправки заявок: Cloudflare Worker → Telegram.
// Используется формой на главной и формой в разделе «Оценить эффект от ИИ»,
// чтобы адрес relay жил в одном месте.
export const RELAY = 'https://neuropro-lead-relay.rachikdarustill.workers.dev';

// Отправка «в один конец»: подтверждение показываем сразу, не дожидаясь ответа,
// а keepalive даёт запросу уйти даже если пользователь тут же закрыл вкладку.
export function sendLead(data) {
  try {
    fetch(RELAY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      keepalive: true,
    }).catch(() => {});
  } catch (_) {}
}
