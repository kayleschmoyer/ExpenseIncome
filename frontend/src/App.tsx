import { useEffect, useState } from 'react';
import { useStore, type Schedule } from './store';

function cents(value: number) {
  return (value / 100).toFixed(2);
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
  } = useStore();

  useEffect(() => {
    load();
  }, [load]);

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

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-10 text-yellow-400">
      <h1 className="text-3xl font-bold text-center">Elite Expense Tracker</h1>

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
          {incomeSchedule === 'oneoff' ? (
            <input className="bg-black border border-yellow-500 text-yellow-400 p-2 rounded" type="date" value={incomeWhen} onChange={e => setIncomeWhen(e.target.value)} />
          ) : (
            <select className="bg-black border border-yellow-500 text-yellow-400 p-2 rounded" value={incomeWhen} onChange={e => setIncomeWhen(e.target.value)}>
              <option value="" disabled>Select day</option>
              {days.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          )}
          <button className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-400" onClick={() => {
            addIncome(incomeName, Math.round(parseFloat(incomeAmount) * 100), incomeSchedule, incomeWhen);
            setIncomeName(''); setIncomeAmount(''); setIncomeSchedule('oneoff'); setIncomeWhen('');
          }}>Add</button>
        </div>
        <ul className="space-y-1">
          {incomeSources.map(i => (
            <li key={i.id} className="flex justify-between border-b border-yellow-700 pb-1">
              <span>{i.name}</span>
              <div className="flex items-center gap-2">
                <span>{cents(i.amountCents)}</span>
                <button className="text-red-500" onClick={() => deleteIncome(i.id)}>Delete</button>
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
          {billSchedule === 'oneoff' ? (
            <input className="bg-black border border-yellow-500 text-yellow-400 p-2 rounded" type="date" value={billWhen} onChange={e => setBillWhen(e.target.value)} />
          ) : (
            <select className="bg-black border border-yellow-500 text-yellow-400 p-2 rounded" value={billWhen} onChange={e => setBillWhen(e.target.value)}>
              <option value="" disabled>Select day</option>
              {days.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          )}
          <button className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-400" onClick={() => {
            addBill(billName, Math.round(parseFloat(billAmount) * 100), billSchedule, billWhen);
            setBillName(''); setBillAmount(''); setBillSchedule('oneoff'); setBillWhen('');
          }}>Add</button>
        </div>
        <ul className="space-y-1">
          {bills.map(b => (
            <li key={b.id} className="flex justify-between border-b border-yellow-700 pb-1">
              <span>{b.name}</span>
              <div className="flex items-center gap-2">
                <span>{cents(b.amountCents)}</span>
                <button className="text-red-500" onClick={() => deleteBill(b.id)}>Delete</button>
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
          <button className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-400" onClick={() => {
            addMisc(miscDate, Math.round(parseFloat(miscAmount) * 100), miscDesc);
            setMiscDesc(''); setMiscAmount(''); setMiscDate('');
          }}>Add</button>
        </div>
        <ul className="space-y-1">
          {misc.map(m => (
            <li key={m.id} className="flex justify-between border-b border-yellow-700 pb-1">
              <span>{m.description}</span>
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
