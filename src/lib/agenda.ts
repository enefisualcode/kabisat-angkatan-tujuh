import { programs } from "@/data/programs";
import { parseIndoMonthYear } from "@/lib/date";
import type { AgendaItem } from "@/types";

/** Agenda KABISAT is derived from the programs list so both stay in sync. */
export function getAgenda(): AgendaItem[] {
  const withOrder = programs.map((program) => {
    const { month, year, monthIndex } = parseIndoMonthYear(
      program.actualDate ?? program.estimatedDate
    );
    return { month, year, monthIndex, program };
  });

  withOrder.sort((a, b) => a.year - b.year || a.monthIndex - b.monthIndex);

  return withOrder.map(({ month, year, program }) => ({
    id: program.id,
    year,
    month,
    title: program.title,
    status: program.status,
    programSlug: program.slug,
  }));
}

export function getAgendaByYear() {
  const items = getAgenda();
  const map = new Map<number, AgendaItem[]>();
  for (const item of items) {
    if (!map.has(item.year)) map.set(item.year, []);
    map.get(item.year)!.push(item);
  }
  return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
}
