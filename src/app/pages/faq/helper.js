import { getDateInUTCToTimeZone } from 'helpers/functions';

export const parseFaqStatus = (status) => {
  const n = Number(status);
  if (!isNaN(n)) return n === 1 ? 'active' : 'inactive';
  return status ? 'active' : 'inactive';
};

export const faqStatusOption = [
  { value: 'active', label: 'Active', color: 'success' },
  { value: 'inactive', label: 'Inactive', color: 'error' }
];

export const moduleOptions = [
  { value: 'GLOBAL', label: 'GLOBAL' },
  { value: 'AFFILIATE', label: 'AFFILIATE' },
  { value: 'EARNINGS', label: 'EARNINGS' }
];

export const responseMapper = (apiData = []) => {
  const list = Array.isArray(apiData) ? apiData : [];
  return list.map((item) => ({
    id: item.FAQUID || item.FaqUID || item.faqUID || item.id,
    module: item.Module || '',
    question: item.Question || '',
    answer: item.Answer || '',
    status: parseFaqStatus(item.Status),
    createdAt: item.DateCreated ? getDateInUTCToTimeZone(item.DateCreated) : ''
  }));
};
