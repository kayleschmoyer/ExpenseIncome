import { useEffect, useState } from 'react';
import { useStore, type Schedule } from './store';

function cents(value: number) {
  return (value / 100).toFixed(2);
}

function occurrences(start: string, schedule: Schedule, month: Date) {
  const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
  const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const startDate = new Date(start);
  const dates: string[] = [];

  if (schedule === 'oneoff') {
    if (startDate >= monthStart && startDate <= monthEnd) {
      dates.push(startDate.toISOString().slice(0, 10));
    }
  } else if (schedule === 'weekly') {
    const d = new Date(startDate);
    while (d < monthStart) {
      d.setDate(d.getDate() + 7);
    }
    while (d <= monthEnd) {
      dates.push(d.toISOString().slice(0, 10));
      d.setDate(d.getDate() + 7);
    }
  } else if (schedule === 'biweekly') {
    const d = new Date(startDate);
    while (d < monthStart) {
      d.setDate(d.getDate() + 14);
    }
    while (d <= monthEnd) {
      dates.push(d.toISOString().slice(0, 10));
      d.setDate(d.getDate() + 14);
    }
  } else if (schedule === 'monthly') {
    const d = new Date(startDate);
    while (d < monthStart) {
      d.setMonth(d.getMonth() + 1);
    }
    if (d <= monthEnd) {
      dates.push(d.toISOString().slice(0, 10));
    }
  }
  return dates;
}

export default function App() {
  const {
    incomeSources,
    bills,
    misc,
    load,
    addIncome,
    addBill,
    addMisc,
    deleteIncome,
    deleteBill,
    deleteMisc,
    updateIncome,
    updateBill,
    skipIncomeOccurrence,
    skipBillOccurrence,
  } = useStore();

  useEffect(() => {
    load();
  }, [load]);

  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));

  const [incomeName, setIncomeName] = useState('');
  const [incomeAmount, setIncomeAmount] = useState('');
  const [incomeSchedule, setIncomeSchedule] = useState<Schedule>('oneoff');
  const [incomeWhen, setIncomeWhen] = useState('');

  const [billName, setBillName] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [billSchedule, setBillSchedule] = useState<Schedule>('oneoff');
  const [billWhen, setBillWhen] = useState('');

  const [miscDesc, setMiscDesc] = useState('');
  const [miscAmount, setMiscAmount] = useState('');
  const [miscDate, setMiscDate] = useState('');

  const incomeOccurrences = incomeSources.flatMap(i =>
    occurrences(i.startDate, i.schedule, month)
      .filter(date => !(i.exceptions?.includes(date)))
      .map(date => ({ ...i, date }))
  );
  const billOccurrences = bills.flatMap(b =>
    occurrences(b.startDate, b.schedule, month)
      .filter(date => !(b.exceptions?.includes(date)))
      .map(date => ({ ...b, date }))
  );
  const miscForMonth = misc.filter(m => {
    const d = new Date(m.date);
    return d.getFullYear() === month.getFullYear() && d.getMonth() === month.getMonth();
  });

  const incomeValid = incomeName && incomeAmount && incomeWhen;
  const billValid = billName && billAmount && billWhen;
  const miscValid = miscDesc && miscAmount && miscDate;

  function handleDeleteIncome(i: { id: string; date: string }) {
    if (window.confirm('Delete entire series? Click cancel to delete only this occurrence.')) {
      deleteIncome(i.id);
    } else {
      skipIncomeOccurrence(i.id, i.date);
    }
  }

  function handleDeleteBill(b: { id: string; date: string }) {
    if (window.confirm('Delete entire series? Click cancel to delete only this occurrence.')) {
      deleteBill(b.id);
    } else {
      skipBillOccurrence(b.id, b.date);
    }
  }

  function handleEditIncome(i: { id: string; date: string; name: string; amountCents: number; schedule: Schedule }) {
    const applyFuture = window.confirm('Apply changes to this and future occurrences? Click cancel for this occurrence only.');
    const name = prompt('Name', i.name);
    const amt = prompt('Amount', (i.amountCents / 100).toString());
    if (!name || !amt) return;
    const amountCents = Math.round(parseFloat(amt) * 100);
    if (applyFuture) {
      const prevDay = new Date(i.date);
      prevDay.setDate(prevDay.getDate() - 1);
      updateIncome(i.id, { endDate: prevDay.toISOString().slice(0,10) });
      addIncome(name, amountCents, i.schedule, i.date);
    } else {
      skipIncomeOccurrence(i.id, i.date);
      addIncome(name, amountCents, 'oneoff', i.date);
    }
  }

  function handleEditBill(b: { id: string; date: string; name: string; amountCents: number; schedule: Schedule }) {
    const applyFuture = window.confirm('Apply changes to this and future occurrences? Click cancel for this occurrence only.');
    const name = prompt('Name', b.name);
    const amt = prompt('Amount', (b.amountCents / 100).toString());
    if (!name || !amt) return;
    const amountCents = Math.round(parseFloat(amt) * 100);
    if (applyFuture) {
      const prevDay = new Date(b.date);
      prevDay.setDate(prevDay.getDate() - 1);
      updateBill(b.id, { endDate: prevDay.toISOString().slice(0,10) });
      addBill(name, amountCents, b.schedule, b.date);
    } else {
      skipBillOccurrence(b.id, b.date);
      addBill(name, amountCents, 'oneoff', b.date);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-10 text-yellow-400">
      <h1 className="text-3xl font-bold text-center">Elite Expense Tracker</h1>
      <div className="flex items-center justify-center gap-4">
        <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="px-2">◀</button>
        <span className="font-semibold">{month.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
        <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="px-2">▶</button>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Income</h2>
        <div className="flex flex-wrap gap-2">
          <input className="bg-black border border-yellow-500 text-yellow-400 p-2 rounded flex-1" placeholder="Name" value={incomeName} onChange={e => setIncomeName(e.target.value)} />
          <input className="bg-black border border-yellow-500 text-yellow-400 p-2 rounded w-32" placeholder="Amount" value={incomeAmount} onChange={e => setIncomeAmount(e.target.value)} />
          <select className="bg-black border border-yellow-500 text-yellow-400 p-2 rounded" value={incomeSchedule} onChange={e => setIncomeSchedule(e.target.value as Schedule)}>
            <option value="oneoff">One-off</option>
            <option value="weekly">Weekly</option>
            <option value="biweekly">Bi-weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <input className="bg-black border border-yellow-500 text-yellow-400 p-2 rounded" type="date" value={incomeWhen} onChange={e => setIncomeWhen(e.target.value)} />
          <button className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-400 disabled:opacity-50" disabled={!incomeValid} onClick={() => {
            addIncome(incomeName, Math.round(parseFloat(incomeAmount) * 100), incomeSchedule, incomeWhen);
            setIncomeName(''); setIncomeAmount(''); setIncomeSchedule('oneoff'); setIncomeWhen('');
          }}>Add</button>
        </div>
        <ul className="space-y-1">
          {incomeOccurrences.map(i => (
            <li key={`${i.id}-${i.date}`} className="flex justify-between border-b border-yellow-700 pb-1">
              <span>{i.name} ({i.date})</span>
              <div className="flex items-center gap-2">
                <span>{cents(i.amountCents)}</span>
                <button className="text-blue-400" onClick={() => handleEditIncome(i)}>Edit</button>
                <button className="text-red-500" onClick={() => handleDeleteIncome(i)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Bills</h2>
        <div className="flex flex-wrap gap-2">
          <input className="bg-black border border-yellow-500 text-yellow-400 p-2 rounded flex-1" placeholder="Name" value={billName} onChange={e => setBillName(e.target.value)} />
          <input className="bg-black border border-yellow-500 text-yellow-400 p-2 rounded w-32" placeholder="Amount" value={billAmount} onChange={e => setBillAmount(e.target.value)} />
          <select className="bg-black border border-yellow-500 text-yellow-400 p-2 rounded" value={billSchedule} onChange={e => setBillSchedule(e.target.value as Schedule)}>
            <option value="oneoff">One-off</option>
            <option value="weekly">Weekly</option>
            <option value="biweekly">Bi-weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <input className="bg-black border border-yellow-500 text-yellow-400 p-2 rounded" type="date" value={billWhen} onChange={e => setBillWhen(e.target.value)} />
          <button className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-400 disabled:opacity-50" disabled={!billValid} onClick={() => {
            addBill(billName, Math.round(parseFloat(billAmount) * 100), billSchedule, billWhen);
            setBillName(''); setBillAmount(''); setBillSchedule('oneoff'); setBillWhen('');
          }}>Add</button>
        </div>
        <ul className="space-y-1">
          {billOccurrences.map(b => (
            <li key={`${b.id}-${b.date}`} className="flex justify-between border-b border-yellow-700 pb-1">
              <span>{b.name} ({b.date})</span>
              <div className="flex items-center gap-2">
                <span>{cents(b.amountCents)}</span>
                <button className="text-blue-400" onClick={() => handleEditBill(b)}>Edit</button>
                <button className="text-red-500" onClick={() => handleDeleteBill(b)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Misc Spending</h2>
        <div className="flex flex-wrap gap-2">
          <input className="bg-black border border-yellow-500 text-yellow-400 p-2 rounded flex-1" placeholder="Description" value={miscDesc} onChange={e => setMiscDesc(e.target.value)} />
          <input className="bg-black border border-yellow-500 text-yellow-400 p-2 rounded w-32" placeholder="Amount" value={miscAmount} onChange={e => setMiscAmount(e.target.value)} />
          <input className="bg-black border border-yellow-500 text-yellow-400 p-2 rounded" type="date" value={miscDate} onChange={e => setMiscDate(e.target.value)} />
          <button className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-400 disabled:opacity-50" disabled={!miscValid} onClick={() => {
            addMisc(miscDate, Math.round(parseFloat(miscAmount) * 100), miscDesc);
            setMiscDesc(''); setMiscAmount(''); setMiscDate('');
          }}>Add</button>
        </div>
        <ul className="space-y-1">
          {miscForMonth.map(m => (
            <li key={m.id} className="flex justify-between border-b border-yellow-700 pb-1">
              <span>{m.description} ({m.date})</span>
              <div className="flex items-center gap-2">
                <span>{cents(m.amountCents)}</span>
                <button className="text-red-500" onClick={() => deleteMisc(m.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
