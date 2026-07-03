import { cx } from '@/lib/style';

// Shared white card wrapper for all non-home pages (pricing, cases, case, legal).
// Ported from the <sc-if notHome> container.
export default function PageCard({ children }) {
  return (
    <div style={cx('max-width:1440px;margin:0 auto;background:#fff;border:1px solid #D0D0D0;border-radius:30px;overflow:hidden;box-shadow:0 30px 72px -30px rgba(0,0,0,.22);')}>
      {children}
    </div>
  );
}
