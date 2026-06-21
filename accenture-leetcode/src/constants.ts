export type CompanyConfig = {
  id: string;
  name: string;
  logoFile: string;
  csvFile: string;
};

export const companies = {
  accenture: {
    id: 'accenture',
    name: 'Accenture',
    logoFile: 'ACN.svg',
    csvFile: 'data/accenture.csv',
  },
  jpmc: {
    id: 'jpmc',
    name: 'JPMC',
    logoFile: 'jpmc.jpg',
    csvFile: 'data/jpmc.csv',
  },
  cisco: {
    id: 'cisco',
    name: 'Cisco',
    logoFile: 'Cisco.png',
    csvFile: 'data/cisco.csv',
  },
} as const;

export type CompanyId = keyof typeof companies;
export const companiesList = Object.values(companies) as CompanyConfig[];
export const companyIds = Object.keys(companies) as CompanyId[];

export const defaultCompanyId: CompanyId = 'accenture';

export const getCompanyIdFromDom = (): CompanyId => {
  if (typeof document === 'undefined') return defaultCompanyId;

  const urlParams = new URLSearchParams(window.location.search);
  const companyFromQuery = urlParams.get('company')?.toLowerCase();
  if (companyFromQuery && companyIds.includes(companyFromQuery as CompanyId)) {
    return companyFromQuery as CompanyId;
  }

  const raw = (document.documentElement.dataset.company ?? '').toLowerCase();
  if (raw && companyIds.includes(raw as CompanyId)) {
    return raw as CompanyId;
  }

  return defaultCompanyId;
};

export const withBase = (path: string): string => {
  const base = import.meta.env.BASE_URL || '/';
  const normalized = path.replace(/^\//, '');
  return `${base}${normalized}`;
};

export const companyHref = (companyId: CompanyId): string => {
  const base = import.meta.env.BASE_URL || '/';
  return `${base}?company=${companyId}`;
};

