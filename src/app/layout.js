import { Manrope } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';
import MetrikaLoader from '@/components/MetrikaLoader';
import RevealManager from '@/components/RevealManager';
import { cx } from '@/lib/style';

const manrope = Manrope({
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-manrope',
});

const TITLE = 'НейроПро+ — внедрение ИИ в бизнес-процессы и цифровые продукты под ключ';
const DESC = 'НейроПро+ (ООО «НЕЙРОПРОПЛЮС») — внедряем ИИ в бизнес-процессы и разрабатываем цифровые продукты под ключ: ИИ-агенты, автоматизация процессов, ИИ-аутстафф. Ставка специалиста — от 5 000 ₽/час.';

export const metadata = {
  metadataBase: new URL('https://neuro-pro.ai'),
  title: { default: TITLE, template: '%s · НейроПро+' },
  description: DESC,
  keywords: ['внедрение ИИ', 'ИИ-агенты', 'автоматизация бизнес-процессов', 'разработка ПО', 'цифровые продукты', 'искусственный интеллект', 'ИИ-аутстафф'],
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
  icons: { icon: '/favicon.svg', apple: '/apple-touch-icon.png' },
  openGraph: {
    type: 'website', siteName: 'НейроПро+', locale: 'ru_RU', url: 'https://neuro-pro.ai/',
    title: TITLE, description: DESC,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: ['/og-image.png'] },
};

export const viewport = { themeColor: '#2F2F2F' };

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={manrope.variable}>
      <body>
        <div style={cx('min-height:100vh;display:flex;flex-direction:column;overflow-x:hidden;background:#E6E6E6;')}>
          <Header />
          <main style={cx('flex:1;padding:clamp(138px,11vw,148px) clamp(14px,2vw,30px) 18px;')}>
            {children}
          </main>
          <Footer />
        </div>
        <CookieConsent />
        <MetrikaLoader />
        <RevealManager />
      </body>
    </html>
  );
}
