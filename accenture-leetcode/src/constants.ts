export type CompanyId = 'accenture' | 'jpmc';

export type CompanyConfig = {
  id: CompanyId;
  name: string;
  logoFile: string;
  pageFile: '' | 'jpmc.html';
  csvFile: string;
};

export const companies: Record<CompanyId, CompanyConfig> = {
  accenture: {
    id: 'accenture',
    name: 'Accenture',
    logoFile: 'ACN.svg',
    pageFile: '',
    csvFile: 'data/accenture.csv',
  },
  jpmc: {
    id: 'jpmc',
    name: 'JPMC',
    logoFile: 'jpmc.jpg',
    pageFile: 'jpmc.html',
    csvFile: 'data/jpmc.csv',
  },
};

export const defaultCompanyId: CompanyId = 'accenture';

export const getCompanyIdFromDom = (): CompanyId => {
  if (typeof document === 'undefined') return defaultCompanyId;
  const raw = (document.documentElement.dataset.company ?? '').toLowerCase();
  if (raw === 'jpmc') return 'jpmc';
  return defaultCompanyId;
};

export const withBase = (path: string): string => {
  const base = import.meta.env.BASE_URL || '/';
  const normalized = path.replace(/^\//, '');
  return `${base}${normalized}`;
};

export const companyHref = (companyId: CompanyId): string => {
  const base = import.meta.env.BASE_URL || '/';
  const page = companies[companyId].pageFile;
  return page ? `${base}${page}` : base;
};

