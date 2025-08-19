import { create } from 'zustand';
import { db } from './db';
import type { IncomeSource, Bill, MiscSpending, Setting } from './db';
import { v4 as uuid } from 'uuid';

export type Schedule = 'oneoff' | 'weekly' | 'biweekly' | 'monthly';

interface StoreState {
  settings?: Setting;
  incomeSources: IncomeSource[];
  bills: Bill[];
  misc: MiscSpending[];
  load: () => Promise<void>;
  addIncome: (
    name: string,
    amountCents: number,
    schedule: Schedule,
    when: string
  ) => Promise<void>;
  addBill: (
    name: string,
    amountCents: number,
    schedule: Schedule,
    when: string
  ) => Promise<void>;
  addMisc: (date: string, amountCents: number, description: string) => Promise<void>;
  deleteIncome: (id: string) => Promise<void>;
  deleteBill: (id: string) => Promise<void>;
  deleteMisc: (id: string) => Promise<void>;
}

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

function nextDateForDay(day: string) {
  const target = days.indexOf(day);
  const date = new Date();
  const diff = (target - date.getDay() + 7) % 7;
  date.setDate(date.getDate() + diff);
  return date.toISOString().slice(0, 10);
}

export const useStore = create<StoreState>((set) => ({
  settings: undefined,
  incomeSources: [],
  bills: [],
  misc: [],
  load: async () => {
    const [settings, incomeSources, bills, misc] = await Promise.all([
      db.settings.get('singleton'),
      db.income_sources.toArray(),
      db.bills.toArray(),
      db.misc_spending.toArray(),
    ]);
    if (!settings) {
      const defaultSetting: Setting = {
        id: 'singleton',
        currency: 'USD',
        timezone: 'America/New_York',
        openingBalanceCents: 0,
        openingBalanceDate: new Date().toISOString().slice(0,10),
      };
      await db.settings.put(defaultSetting);
      set({ settings: defaultSetting });
    } else {
      set({ settings });
    }
    set({ incomeSources, bills, misc });
  },
  addIncome: async (name, amountCents, schedule, when) => {
    const startDate = schedule === 'oneoff' ? when : nextDateForDay(when);
    const entry: IncomeSource = {
      id: uuid(),
      name,
      amountCents,
      rrule: null,
      schedule,
      startDate,
      active: true,
    };
    await db.income_sources.add(entry);
    set((s) => ({ incomeSources: [...s.incomeSources, entry] }));
  },
  addBill: async (name, amountCents, schedule, when) => {
    const startDate = schedule === 'oneoff' ? when : nextDateForDay(when);
    const entry: Bill = {
      id: uuid(),
      name,
      amountCents,
      rrule: null,
      schedule,
      startDate,
      active: true,
    };
    await db.bills.add(entry);
    set((s) => ({ bills: [...s.bills, entry] }));
  },
  addMisc: async (date, amountCents, description) => {
    const entry: MiscSpending = {
      id: uuid(),
      date,
      amountCents,
      description,
    };
    await db.misc_spending.add(entry);
    set((s) => ({ misc: [...s.misc, entry] }));
  },
  deleteIncome: async (id) => {
    await db.income_sources.delete(id);
    set((s) => ({ incomeSources: s.incomeSources.filter((i) => i.id !== id) }));
  },
  deleteBill: async (id) => {
    await db.bills.delete(id);
    set((s) => ({ bills: s.bills.filter((b) => b.id !== id) }));
  },
  deleteMisc: async (id) => {
    await db.misc_spending.delete(id);
    set((s) => ({ misc: s.misc.filter((m) => m.id !== id) }));
  },
}));
