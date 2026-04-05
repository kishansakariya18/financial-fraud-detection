import { TRANSACTION_CATEGORIES } from './constants';

/**
 * Prefer embedded `category.name` from transaction list/detail API; fall back to static map or id.
 */
export function getTransactionCategoryLabel(row) {
  if (!row) return '—';
  const embedded = row.category?.name?.trim();
  if (embedded) return embedded;
  const catId = row.categoryId;
  if (catId == null || catId === '') return '—';
  const fromConstants = TRANSACTION_CATEGORIES.find((c) => String(c.value) === String(catId));
  if (fromConstants) return fromConstants.label;
  if (row.categoryLabel) return row.categoryLabel;
  return String(catId);
}
