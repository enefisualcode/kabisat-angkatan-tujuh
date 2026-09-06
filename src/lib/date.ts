const MONTHS_SHORT = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MEI",
  "JUN",
  "JUL",
  "AGU",
  "SEP",
  "OKT",
  "NOV",
  "DES",
];

const MONTHS_FULL = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export function formatUpdateDate(iso: string) {
  const d = new Date(iso);
  const day = d.getDate().toString().padStart(2, "0");
  const month = MONTHS_SHORT[d.getMonth()];
  return `${day} ${month} ${d.getFullYear()}`;
}

/** Parse strings like "November 2026" into a sortable { month, year, monthIndex }. */
export function parseIndoMonthYear(value: string) {
  const [monthName, yearStr] = value.trim().split(/\s+/);
  const monthIndex = MONTHS_FULL.findIndex(
    (m) => m.toLowerCase() === monthName?.toLowerCase()
  );
  return {
    month: monthName ?? value,
    year: Number(yearStr) || 0,
    monthIndex: monthIndex === -1 ? 0 : monthIndex,
  };
}
