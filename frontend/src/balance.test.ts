import { describe, it, expect } from 'vitest';
import { buildTimeline } from './balance';
import type { Setting, IncomeSource, Bill, MiscSpending } from './db';

describe('buildTimeline', () => {
  it('computes running projected balance', () => {
    const setting: Setting = {
      id: 'singleton',
      currency: 'USD',
      timezone: 'America/New_York',
      openingBalanceCents: 100000,
      openingBalanceDate: '2025-01-01',
    };
    const incomes: IncomeSource[] = [
      {
        id: 'inc1',
        name: 'Salary',
        amountCents: 200000,
        rrule: null,
        schedule: 'oneoff',
        startDate: '2025-01-01',
        active: true,
      },
    ];
    const bills: Bill[] = [
      {
        id: 'bill1',
        name: 'Rent',
        amountCents: 80000,
        rrule: null,
        schedule: 'oneoff',
        startDate: '2025-01-03',
        active: true,
      },
    ];
    const misc: MiscSpending[] = [
      {
        id: 'misc1',
        date: '2025-01-02',
        amountCents: 500,
        description: 'Coffee',
      },
    ];
    const timeline = buildTimeline(setting, incomes, bills, misc);
    expect(timeline).toHaveLength(3);
    expect(timeline[0].projectedBalance).toBe(300000);
    expect(timeline[1].projectedBalance).toBe(299500);
    expect(timeline[2].projectedBalance).toBe(219500);
  });
});
