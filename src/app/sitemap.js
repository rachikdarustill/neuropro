import { casesData } from '@/lib/data';
import { NPP_LEGAL } from '@/lib/legal';

export const dynamic = 'force-static';

const BASE = 'https://neuro-pro.ai';

export default function sitemap() {
  const staticRoutes = ['', '/pricing', '/analysis', '/cases'].map((p) => ({
    url: `${BASE}${p}/`.replace(/\/\/$/, '/'),
    changeFrequency: 'monthly',
    priority: p === '' ? 1.0 : 0.8,
  }));
  const caseRoutes = casesData.map((c) => ({
    url: `${BASE}/cases/${c.id}/`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));
  const legalRoutes = Object.keys(NPP_LEGAL).map((doc) => ({
    url: `${BASE}/legal/${doc}/`,
    changeFrequency: 'yearly',
    priority: 0.3,
  }));
  return [...staticRoutes, ...caseRoutes, ...legalRoutes];
}
