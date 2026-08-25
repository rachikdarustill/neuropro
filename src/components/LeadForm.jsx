'use client';
import { useState } from 'react';
import Link from 'next/link';
import { cx } from '@/lib/style';
import { Hx } from '@/components/Hx';
import { sendLead } from '@/lib/lead';

const inputBase = 'font-family:inherit;background:transparent;border:none;border-bottom:1px solid rgba(255,255,255,.25);color:#fff;font-size:16px;padding:9px 0;outline:none;transition:border-color .3s ease;';
const inputFocus = 'border-bottom-color:#fff;';
const labelSpan = 'font-size:12.5px;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.6);font-weight:700;';

function Field({ label, name, type = 'text', placeholder }) {
  return (
    <label style={cx('display:flex;flex-direction:column;gap:9px;')}>
      <span style={cx(labelSpan)}>{label}</span>
      <Hx as="input" name={name} type={type} required s={inputBase} sf={inputFocus} placeholder={placeholder} />
    </label>
  );
}

export default function LeadForm() {
  const [sent, setSent] = useState(false);

  function submitForm(e) {
    e.preventDefault();
    const form = e.target;
    const data = {};
    form.querySelectorAll('input').forEach((inp) => {
      if (inp.type === 'checkbox' || inp.type === 'hidden') return;
      if (inp.name && inp.value.trim()) data[inp.name] = inp.value.trim();
    });
    sendLead(data);
    setSent(true);
    if (form.reset) form.reset();
  }

  return (
    <>
      <div id="lead-form" data-r="formSplit" style={cx('display:grid;grid-template-columns:minmax(0,0.92fr) minmax(0,1.08fr);background:#2F2F2F;')}>
        {/* ЛЕВАЯ — глубокий графит */}
        <div data-r="formAside" style={cx('background:#2F2F2F;color:#fff;padding:clamp(44px,4.5vw,68px) clamp(32px,3.4vw,52px);display:flex;flex-direction:column;')}>
          <div style={cx('font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,255,255,.5);font-weight:700;margin-bottom:24px;')}>Оставить заявку</div>
          <h2 style={cx('margin:0;font-size:clamp(27px,2.9vw,42px);line-height:1.12;letter-spacing:-0.02em;color:#fff;font-weight:700;text-wrap:balance;')}>Расскажите, какую задачу хотите решить</h2>
          <p style={cx('margin:22px 0 0;font-size:16.5px;line-height:1.6;color:rgba(255,255,255,.7);max-width:400px;')}>Мы проанализируем задачу, предложим возможное решение и дадим сроки и стоимости.</p>
          <div style={cx('margin-top:auto;padding-top:clamp(36px,4vw,52px);')}>
            <div style={cx('font-size:13px;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.7);font-weight:700;margin-bottom:18px;')}>Связаться напрямую</div>
            <div style={cx('display:flex;flex-direction:column;gap:13px;font-size:16px;')}>
              <Hx as="a" href="mailto:info@neuro-pro.ai" s="color:#D0D0D0;text-decoration:none;transition:color .3s ease;display:flex;gap:14px;" sh="color:#fff;"><span style={cx('color:rgba(255,255,255,.7);width:64px;flex:none;')}>E-mail</span>info@neuro-pro.ai</Hx>
              <Hx as="a" href="tel:+79670609494" s="color:#D0D0D0;text-decoration:none;transition:color .3s ease;display:flex;gap:14px;" sh="color:#fff;"><span style={cx('color:rgba(255,255,255,.7);width:64px;flex:none;')}>Телефон</span>+7 967 060-94-94</Hx>
            </div>
          </div>
        </div>

        {/* ПРАВАЯ — форма */}
        <div style={cx('background:#2F2F2F;padding:clamp(44px,4.5vw,68px) clamp(32px,3.4vw,52px);display:flex;flex-direction:column;justify-content:flex-end;')}>
          <form onSubmit={submitForm} className="npp-darkform" style={cx('display:grid;grid-template-columns:1fr 1fr;gap:26px 24px;')}>
            <Field label="Имя" name="name" placeholder="Как к вам обращаться" />
            <Field label="Компания" name="company" placeholder="Название" />
            <Field label="Телефон" name="phone" placeholder="+7 999 000-00-00" />
            <Field label="E-mail" name="email" type="email" placeholder="you@company.com" />
            <label style={cx('grid-column:1 / -1;display:flex;align-items:flex-start;gap:12px;cursor:pointer;margin-top:2px;')}>
              <input type="checkbox" required style={cx('width:18px;height:18px;margin-top:1px;accent-color:#fff;cursor:pointer;flex:none;')} />
              <span style={cx('font-size:13.5px;line-height:1.5;color:rgba(255,255,255,.7);')}>Я согласен с <Link href="/legal/policy" style={cx('color:rgba(255,255,255,.9);text-decoration:underline;cursor:pointer;')}>политикой обработки персональных данных</Link></span>
            </label>
            <div style={cx('grid-column:1 / -1;margin-top:8px;')}>
              <Hx as="button" type="submit" s="font-family:inherit;cursor:pointer;width:100%;background:#fff;color:#2F2F2F;border:none;border-radius:18px;padding:18px 36px;font-size:17px;font-weight:700;transition:all .3s cubic-bezier(.16,1,.3,1);" sh="transform:translateY(-3px);box-shadow:0 18px 38px rgba(0,0,0,.35);background:#E6E6E6;">Оставить заявку</Hx>
            </div>
          </form>
        </div>
      </div>

      {sent && (
        <div onClick={() => setSent(false)} style={cx('position:fixed;inset:0;z-index:2000;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:24px;animation:npp_msg .3s ease both;')}>
          <div onClick={(e) => e.stopPropagation()} style={cx('background:#fff;border-radius:24px;max-width:440px;width:100%;padding:clamp(40px,5vw,52px) clamp(28px,4vw,44px);text-align:center;box-shadow:0 40px 90px -30px rgba(0,0,0,.55);animation:npp_msg .35s cubic-bezier(.16,1,.3,1) both;')}>
            <div style={cx('width:66px;height:66px;border-radius:50%;background:#2F2F2F;display:flex;align-items:center;justify-content:center;margin:0 auto 24px;')}><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4 10-11" /></svg></div>
            <h3 style={cx('margin:0 0 12px;font-size:26px;letter-spacing:-0.01em;color:#2F2F2F;font-weight:700;')}>Заявка отправлена</h3>
            <p style={cx('margin:0 0 30px;font-size:16.5px;line-height:1.6;color:#5F5F5F;')}>Скоро мы свяжемся с вами.</p>
            <Hx as="button" onClick={() => setSent(false)} s="font-family:inherit;cursor:pointer;background:#2F2F2F;color:#fff;border:none;border-radius:18px;padding:15px 40px;font-size:16px;font-weight:700;transition:all .3s cubic-bezier(.16,1,.3,1);" sh="transform:translateY(-2px);box-shadow:0 14px 30px rgba(0,0,0,.25);">Хорошо</Hx>
          </div>
        </div>
      )}
    </>
  );
}
