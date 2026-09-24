const dayMs = 24 * 60 * 60 * 1000;
const dateOnlyPattern = /^(\d{4})-(\d{2})-(\d{2})$/;

function pad2(value) {
  return String(value).padStart(2, '0');
}

export function toDate(value) {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;

  const text = String(value);
  const dateOnly = text.match(dateOnlyPattern);
  const date = dateOnly
    ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
    : new Date(text);

  return Number.isNaN(date.getTime()) ? null : date;
}

export function toInputDate(value) {
  const date = toDate(value);
  if (!date) return '';
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function todayInputDate() {
  return toInputDate(new Date());
}

export function addMonths(value, months) {
  const date = toDate(value) || new Date();
  const next = new Date(date);
  const expectedDay = next.getDate();
  next.setMonth(next.getMonth() + Number(months || 0));
  if (next.getDate() !== expectedDay) {
    next.setDate(0);
  }
  return next;
}

function localDayTime(date) {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

export function diffInDays(fromValue, toValue) {
  const from = toDate(fromValue);
  const to = toDate(toValue);
  if (!from || !to) return 0;
  return Math.round((localDayTime(to) - localDayTime(from)) / dayMs);
}

export function getWarrantyEndDate(purchaseDate, warrantyMonths) {
  if (!purchaseDate || !warrantyMonths) return '';
  return toInputDate(addMonths(purchaseDate, Number(warrantyMonths)));
}

export function getWarrantyDaysLeft(item, now = new Date()) {
  const endDate = item.warrantyEndDate || getWarrantyEndDate(item.purchaseDate, item.warrantyMonths);
  return diffInDays(now, endDate);
}

export function getYearsSince(value, now = new Date()) {
  const date = toDate(value);
  if (!date) return 0;
  const years = (now.getTime() - date.getTime()) / (365.25 * dayMs);
  return Math.max(0, years);
}

export function isSameYear(value, year = new Date().getFullYear()) {
  const date = toDate(value);
  return Boolean(date && date.getFullYear() === year);
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}
