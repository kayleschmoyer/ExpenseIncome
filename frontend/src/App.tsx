import { useEffect, useState } from 'react';
import { useStore } from './store';
import { buildTimeline } from './balance';

function cents(value: number) {
  return (value / 100).toFixed(2);
}

export default function App() {
  const { incomeSources, bills, misc, settings, load, addIncome, addBill, addMisc } = useStore();

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

  const timeline = settings ? buildTimeline(settings, incomeSources, bills, misc) : [];

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-bold">Income & Expense Tracker</h1>

      <section>
        <h2 className="font-semibold">Add Income</h2>
        <div className="flex gap-2">
          <input className="border p-1" placeholder="Name" value={incomeName} onChange={e => setIncomeName(e.target.value)} />
          <input className="border p-1" placeholder="Amount" value={incomeAmount} onChange={e => setIncomeAmount(e.target.value)} />
          <input className="border p-1" type="date" value={incomeDate} onChange={e => setIncomeDate(e.target.value)} />
          <button className="bg-blue-500 text-white px-2" onClick={() => {
            addIncome(incomeName, Math.round(parseFloat(incomeAmount) * 100), incomeDate);
            setIncomeName(''); setIncomeAmount(''); setIncomeDate('');
          }}>Add</button>
        </div>
      </section>

      <section>
        <h2 className="font-semibold">Add Bill</h2>
        <div className="flex gap-2">
          <input className="border p-1" placeholder="Name" value={billName} onChange={e => setBillName(e.target.value)} />
          <input className="border p-1" placeholder="Amount" value={billAmount} onChange={e => setBillAmount(e.target.value)} />
          <input className="border p-1" type="date" value={billDate} onChange={e => setBillDate(e.target.value)} />
          <button className="bg-blue-500 text-white px-2" onClick={() => {
            addBill(billName, Math.round(parseFloat(billAmount) * 100), billDate);
            setBillName(''); setBillAmount(''); setBillDate('');
          }}>Add</button>
        </div>
      </section>

      <section>
        <h2 className="font-semibold">Misc Spending</h2>
        <div className="flex gap-2">
          <input className="border p-1" placeholder="Description" value={miscDesc} onChange={e => setMiscDesc(e.target.value)} />
          <input className="border p-1" placeholder="Amount" value={miscAmount} onChange={e => setMiscAmount(e.target.value)} />
          <input className="border p-1" type="date" value={miscDate} onChange={e => setMiscDate(e.target.value)} />
          <button className="bg-blue-500 text-white px-2" onClick={() => {
            addMisc(miscDate, Math.round(parseFloat(miscAmount) * 100), miscDesc);
            setMiscDesc(''); setMiscAmount(''); setMiscDate('');
          }}>Add</button>
        </div>
      </section>

      <section>
        <h2 className="font-semibold">Timeline</h2>
        <table className="w-full text-left border">
          <thead>
            <tr className="border-b"><th className="p-1">Date</th><th className="p-1">Type</th><th className="p-1">Label</th><th className="p-1">Δ</th><th className="p-1">Balance</th></tr>
          </thead>
          <tbody>
            {timeline.map((t) => (
              <tr key={t.date + t.label} className="border-b">
                <td className="p-1">{t.date}</td>
                <td className="p-1">{t.kind}</td>
                <td className="p-1">{t.label}</td>
                <td className="p-1">{cents(t.delta)}</td>
                <td className="p-1">{cents(t.projectedBalance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
