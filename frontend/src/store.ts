import { create } from 'zustand';
import { db } from './db';
import type { IncomeSource, Bill, MiscSpending, Setting } from './db';
import { v4 as uuid } from 'uuid';

interface StoreState {
  settings?: Setting;
  incomeSources: IncomeSource[];
  bills: Bill[];
  misc: MiscSpending[];
  load: () => Promise<void>;
  addIncome: (name: string, amountCents: number, date: string) => Promise<void>;
  addBill: (name: string, amountCents: number, date: string) => Promise<void>;
  addMisc: (date: string, amountCents: number, description: string) => Promise<void>;
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
  addIncome: async (name, amountCents, date) => {
    const entry: IncomeSource = {
      id: uuid(),
      name,
      amountCents,
      rrule: null,
      schedule: 'oneoff',
      startDate: date,
      active: true,
    };
    await db.income_sources.add(entry);
    set((s) => ({ incomeSources: [...s.incomeSources, entry] }));
  },
  addBill: async (name, amountCents, date) => {
    const entry: Bill = {
      id: uuid(),
      name,
      amountCents,
      rrule: null,
      schedule: 'oneoff',
      startDate: date,
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
}));
