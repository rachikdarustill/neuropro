import { cx } from '@/lib/style';
import PageCard from '@/components/PageCard';
import AiEffectWizard from '@/components/AiEffectWizard';

export const metadata = {
  title: 'Оценить эффект от ИИ',
  description: 'Экспресс-оценка эффекта от внедрения ИИ: пять вопросов о процессе — и предварительный расчёт экономического потенциала, трудоёмкости пилота и срока окупаемости. Результат сразу, без запроса контактов.',
  alternates: { canonical: '/analysis/' },
};

export default function AnalysisPage() {
  return (
    <PageCard>
      <section data-reveal style={cx('padding:clamp(40px,6vw,84px) clamp(24px,4vw,56px);')}>
        <div data-r="anHero" style={cx('display:grid;grid-template-columns:minmax(0,1fr) minmax(260px,340px);gap:clamp(24px,3vw,48px);align-items:center;')}>
          <div>
            <p style={cx('margin:0;font-size:13px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#5F5F5F;')}>Оценка эффекта</p>
            <h1 style={cx('margin:14px 0 18px;font-size:clamp(30px,4.4vw,52px);line-height:1.05;letter-spacing:-.025em;color:#2F2F2F;font-weight:800;text-wrap:balance;')}>Оцените потенциал внедрения ИИ в ваш процесс</h1>
            <p style={cx('margin:0;font-size:clamp(16.5px,1.4vw,18px);line-height:1.65;color:#5F5F5F;')}>Предварительная оценка экономического потенциала, трудоёмкости пилота и срока окупаемости. Результат покажем сразу, без запроса контактов</p>
          </div>
          <div style={cx('background:#2F2F2F;color:#fff;border-radius:18px;padding:clamp(24px,3vw,34px);')}>
            <p style={cx('margin:0;font-size:13px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.7);')}>Экспресс-оценка</p>
            <p style={cx('margin:10px 0 4px;font-size:clamp(26px,3vw,38px);font-weight:800;letter-spacing:-.03em;')}>5 вопросов</p>
            <p style={cx('margin:0;color:rgba(255,255,255,.6);font-size:15px;font-weight:700;')}>/ 1–2 минуты</p>
          </div>
        </div>
      </section>

      <div style={cx('border-top:1px solid #D0D0D0;')} />

      <AiEffectWizard />
    </PageCard>
  );
}
