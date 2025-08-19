import Dexie from 'dexie';
import type { Table } from 'dexie';

export interface Setting {
  id: 'singleton';
  currency: string;
  timezone: string;
  openingBalanceCents: number;
  openingBalanceDate: string; // ISO date
}

export interface IncomeSource {
  id: string;
  name: string;
  amountCents: number;
  rrule: string | null;
  schedule: 'oneoff' | 'weekly' | 'biweekly' | 'monthly' | 'twicemonthly' | 'custom';
  startDate: string;
  endDate?: string;
  tags?: string[];
  exceptions?: string[];
  active: boolean;
}

export interface Bill {
  id: string;
  name: string;
  amountCents: number;
  rrule: string | null;
  schedule: 'oneoff' | 'weekly' | 'biweekly' | 'monthly' | 'twicemonthly' | 'custom';
  startDate: string;
  endDate?: string;
  autopay?: boolean;
  tags?: string[];
  exceptions?: string[];
  active: boolean;
}

export interface MiscSpending {
  id: string;
  date: string;
  amountCents: number;
  description: string;
  tags?: string[];
}

export interface LedgerEntry {
  id: string;
  date: string;
  type: 'income' | 'bill' | 'misc';
  linkId?: string;
  plannedCents: number;
  actualCents?: number;
  status: 'planned' | 'posted' | 'skipped';
  paid: boolean;
  note?: string;
  createdAt: string;
}

export interface Tag {
  id: string;
  label: string;
}

export class FinanceDB extends Dexie {
  settings!: Table<Setting, string>;
  income_sources!: Table<IncomeSource, string>;
  bills!: Table<Bill, string>;
  misc_spending!: Table<MiscSpending, string>;
  ledger!: Table<LedgerEntry, string>;
  tags!: Table<Tag, string>;

  constructor() {
    super('finance_db');
    this.version(1).stores({
      settings: 'id',
      income_sources: 'id, active',
      bills: 'id, active',
      misc_spending: 'id, date',
      ledger: 'id, date, type',
      tags: 'id',
    });
  }
}

export const db = new FinanceDB();
