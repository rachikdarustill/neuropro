import Link from 'next/link';
import { cx } from '@/lib/style';
import { Hx } from '@/components/Hx';
import DemoAgent from '@/components/DemoAgent';
import LeadForm from '@/components/LeadForm';

const SERVICES = [
  ['ИИ-агенты', 'Создаём цифровых агентов для поддержки, продаж, обработки документов, аналитики и внутренних операций'],
  ['ИИ внутри процессов', 'Встраиваем искусственный интеллект в существующие бизнес-процессы, ЦРМ, базы знаний и внутренние системы'],
  ['Цифровые продукты', 'Разрабатываем веб-сервисы, кабинеты, платформы и внутренние системы автоматизации под ключ'],
  ['ИИ-аутстафф', 'Усиливаем команды опытными ИИ-инженерами, аналитиками и продуктовыми специалистами'],
];

export default function Home() {
  return (
    <div style={cx('max-width:1440px;margin:0 auto;display:flex;flex-direction:column;gap:18px;')}>
      {/* HERO + ДЕМО-АГЕНТ: единая карточка */}
      <div data-reveal style={cx('background:#fff;border:1px solid #D0D0D0;border-radius:30px;box-shadow:0 30px 72px -30px rgba(0,0,0,.22);overflow:hidden;')}>
        <section style={cx('padding:clamp(44px,5vw,72px) clamp(24px,5vw,72px) clamp(48px,5vw,68px);')}>
          <h1 data-reveal style={cx('margin:0;text-align:center;font-size:clamp(38px,4.8vw,66px);line-height:1.05;letter-spacing:-0.03em;color:#2F2F2F;font-weight:800;text-wrap:balance;')}>ИИ-внедрения и цифровые продукты под ключ</h1>
          <p data-reveal style={cx('margin:26px auto 0;max-width:1080px;text-align:center;font-size:clamp(15.5px,1.3vw,18px);line-height:1.65;color:#5F5F5F;text-wrap:pretty;')}>Проектируем, разрабатываем и внедряем ИИ-агентов, цифровые продукты и автоматизацию бизнес-процессов<br />Работает опытная ИТ-команда: только специалисты 6+ лет, без джунов, без лишней бюрократии, с фокусом на бизнес-результат</p>
          <div data-reveal style={cx('display:flex;flex-wrap:wrap;gap:14px;justify-content:center;margin:36px 0 0;')}>
            <Hx as="a" href="#lead-form" s="font-family:inherit;cursor:pointer;background:#2F2F2F;color:#fff;border:1px solid #2F2F2F;border-radius:18px;padding:16px 34px;font-size:16px;font-weight:700;text-decoration:none;transition:transform .3s cubic-bezier(.16,1,.3,1),box-shadow .3s ease,background .3s ease;" sh="transform:translateY(-3px);box-shadow:0 16px 34px rgba(0,0,0,.22);background:#2F2F2F;">Написать нам</Hx>
            <Hx as={Link} href="/cases" data-r="resbtn" s="font-family:inherit;cursor:pointer;background:#fff;color:#2F2F2F;border:1px solid #5F5F5F;border-radius:18px;padding:16px 28px;font-size:16px;font-weight:700;display:flex;align-items:center;gap:8px;white-space:nowrap;text-decoration:none;transition:border-color .3s ease,transform .3s cubic-bezier(.16,1,.3,1);" sh="border:1px solid #2F2F2F;transform:translateY(-3px);">Наши кейсы <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg></Hx>
          </div>
          <div data-reveal style={cx('margin:20px 0 0;text-align:center;font-size:13.5px;color:#5F5F5F;font-weight:600;letter-spacing:.02em;')}>От задачи до внедрения · С фокусом на метрики</div>
        </section>
        <DemoAgent />
      </div>

      {/* ЧЕМ ЗАНИМАЕМСЯ + ФОРМА: единая карточка */}
      <div data-reveal style={cx('background:#fff;border:none;border-radius:30px;overflow:hidden;box-shadow:0 30px 72px -30px rgba(0,0,0,.22);')}>
        <section style={cx('background:#fff;')}>
          <div style={cx('max-width:1440px;margin:0 auto;padding:clamp(64px,8vw,110px) 32px;')}>
            <div data-reveal style={cx('max-width:720px;margin-bottom:clamp(40px,5vw,64px);')}>
              <div style={cx('font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#5F5F5F;font-weight:700;margin-bottom:22px;')}>Направления</div>
              <h2 style={cx('margin:0;font-size:clamp(32px,4vw,54px);line-height:1.06;letter-spacing:-0.02em;color:#2F2F2F;font-weight:700;')}>Чем мы занимаемся</h2>
            </div>
            <div style={cx('display:grid;grid-template-columns:repeat(auto-fit,minmax(258px,1fr));gap:22px;')}>
              {SERVICES.map(([title, desc]) => (
                <div key={title} data-reveal style={cx('border:1px solid #D0D0D0;border-radius:14px;padding:34px 30px;background:#fff;box-shadow:0 16px 38px -20px rgba(0,0,0,.22);')}>
                  <h3 style={cx('margin:0 0 14px;font-size:21px;color:#2F2F2F;font-weight:700;letter-spacing:-0.01em;')}>{title}</h3>
                  <div style={cx('width:40px;height:2px;background:#2F2F2F;border-radius:1px;margin:0 0 16px;')} />
                  <p style={cx('margin:0;font-size:15.5px;line-height:1.6;color:#5F5F5F;')}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <LeadForm />
      </div>
    </div>
  );
}
