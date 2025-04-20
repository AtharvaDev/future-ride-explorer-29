
import React, { useState } from 'react';

interface ExpenseEntry {
  id: string;
  date: string;
  type: string;
  amount: number;
  description?: string;
}

const expenseTypes = [
  "Fuel",
  "Salary",
  "EMI",
  "Car Damage",
  "Insurance",
  "Other"
];

const initialExpenses: ExpenseEntry[] = [
  { id: "ex1", date: "2025-04-15", type: "Fuel", amount: 1200, description: "Diesel for Innova" }
];

const ExpensesTab: React.FC = () => {
  const [entries, setEntries] = useState(initialExpenses);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<ExpenseEntry, 'id'>>({ date: '', type: expenseTypes[0], amount: 0, description: '' });

  const handleAdd = () => setShowForm(true);

  const handleEdit = (id: string) => {
    const entry = entries.find(e => e.id === id);
    if (entry) {
      setForm({ ...entry, id: undefined } as any);
      setShowForm(true);
    }
  };

  const handleDelete = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.amount && form.date && form.type) {
      setEntries(prev => [
        ...prev.filter(e => !(showForm && (e.type === form.type && e.date === form.date))),
        { ...form, id: `ex${Date.now()}` }
      ]);
      setShowForm(false);
      setForm({ date: '', type: expenseTypes[0], amount: 0, description: '' });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Expenses</h2>
      <button className="bg-primary text-white px-4 py-2 rounded mb-4" onClick={handleAdd}>+ Add Expense</button>
      {showForm && (
        <form className="mb-4 p-4 border rounded" onSubmit={handleFormSubmit}>
          <div className="flex flex-wrap gap-2 mb-2">
            <input className="border p-1" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} placeholder="Date" type="date" required />
            <select className="border p-1" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              {expenseTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
            <input className="border p-1" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: Number(e.target.value) }))} placeholder="Amount" type="number" required />
            <input className="border p-1" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description" />
            <button className="bg-green-500 text-white px-2 rounded" type="submit">Save</button>
            <button className="bg-gray-300 px-2 rounded" type="button" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}
      <table className="w-full table-auto bg-white shadow rounded">
        <thead>
          <tr className="bg-muted">
            <th className="p-2">Date</th>
            <th className="p-2">Type</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Description</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(e => (
            <tr key={e.id}>
              <td className="p-2">{e.date}</td>
              <td className="p-2">{e.type}</td>
              <td className="p-2">₹{e.amount}</td>
              <td className="p-2">{e.description}</td>
              <td className="p-2">
                <button className="bg-yellow-400 px-2 rounded mr-2" onClick={() => handleEdit(e.id)}>Edit</button>
                <button className="bg-red-500 text-white px-2 rounded" onClick={() => handleDelete(e.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpensesTab;
