// utils/dateUtils.js
export const parseDateDDMMYYYY = (str) => {
  // Expect dd-mm-yyyy
  const parts = String(str).split('-');
  if (parts.length !== 3) return null;
  const [dd, mm, yyyy] = parts.map(p => parseInt(p, 10));
  if (!dd || !mm || !yyyy) return null;
  // Month in JS Date is 0-indexed
  const date = new Date(Date.UTC(yyyy, mm - 1, dd));
  return isNaN(date.getTime()) ? null : date;
};
