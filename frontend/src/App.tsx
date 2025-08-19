import { useEffect, useState } from 'react';
import { useStore } from './store';

function cents(value: number) {
  return (value / 100).toFixed(2);
}

export default function App() {
  const { incomeSources, bills, misc, load, addIncome, addBill, addMisc } = useStore();

  useEffect(() => {
    load();
  }, [load]);

  const [incomeName, setIncomeName] = useState('');
  const [incomeAmount, setIncomeAmount] = useState('');
  const [incomeDate, setIncomeDate] = useState('');

  const [billName, setBillName] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [billDate, setBillDate] = useState('');

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
          <input className="bg-black border border-yellow-500 text-yellow-400 p-2 rounded" type="date" value={incomeDate} onChange={e => setIncomeDate(e.target.value)} />
          <button className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-400" onClick={() => {
            addIncome(incomeName, Math.round(parseFloat(incomeAmount) * 100), incomeDate);
            setIncomeName(''); setIncomeAmount(''); setIncomeDate('');
          }}>Add</button>
        </div>
        <ul className="space-y-1">
          {incomeSources.map(i => (
            <li key={i.id} className="flex justify-between border-b border-yellow-700 pb-1">
              <span>{i.name}</span>
              <span>{cents(i.amountCents)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Bills</h2>
        <div className="flex flex-wrap gap-2">
          <input className="bg-black border border-yellow-500 text-yellow-400 p-2 rounded flex-1" placeholder="Name" value={billName} onChange={e => setBillName(e.target.value)} />
          <input className="bg-black border border-yellow-500 text-yellow-400 p-2 rounded w-32" placeholder="Amount" value={billAmount} onChange={e => setBillAmount(e.target.value)} />
          <input className="bg-black border border-yellow-500 text-yellow-400 p-2 rounded" type="date" value={billDate} onChange={e => setBillDate(e.target.value)} />
          <button className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-400" onClick={() => {
            addBill(billName, Math.round(parseFloat(billAmount) * 100), billDate);
            setBillName(''); setBillAmount(''); setBillDate('');
          }}>Add</button>
        </div>
        <ul className="space-y-1">
          {bills.map(b => (
            <li key={b.id} className="flex justify-between border-b border-yellow-700 pb-1">
              <span>{b.name}</span>
              <span>{cents(b.amountCents)}</span>
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
              <span>{cents(m.amountCents)}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
