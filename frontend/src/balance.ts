import type { IncomeSource, Bill, MiscSpending, Setting } from './db';

export interface TimelineEntry {
  date: string;
  kind: 'income' | 'bill' | 'misc';
  label: string;
  delta: number; // signed cents
  projectedBalance: number; // after applying delta
}

const kindOrder = { income: 0, bill: 1, misc: 2 } as const;

export function buildTimeline(
  setting: Setting,
  incomes: IncomeSource[],
  bills: Bill[],
  misc: MiscSpending[],
): TimelineEntry[] {
  const events: { date: string; kind: 'income' | 'bill' | 'misc'; label: string; amountCents: number }[] = [];
  for (const i of incomes) {
    events.push({ date: i.startDate, kind: 'income', label: i.name, amountCents: i.amountCents });
  }
  for (const b of bills) {
    events.push({ date: b.startDate, kind: 'bill', label: b.name, amountCents: -b.amountCents });
  }
  for (const m of misc) {
    events.push({ date: m.date, kind: 'misc', label: m.description, amountCents: -m.amountCents });
  }
  events.sort((a, b) => (a.date === b.date ? kindOrder[a.kind] - kindOrder[b.kind] : a.date.localeCompare(b.date)));
  let balance = setting.openingBalanceCents;
  const timeline: TimelineEntry[] = [];
  for (const e of events) {
    balance += e.amountCents;
    timeline.push({ date: e.date, kind: e.kind, label: e.label, delta: e.amountCents, projectedBalance: balance });
  }
  return timeline;
}
