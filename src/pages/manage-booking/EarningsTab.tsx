
import React, { useState } from 'react';

interface EarningEntry {
  id: string;
  date: string;
  user: string;
  source: string;
  destination: string;
  cost: number;
  offline?: boolean;
}

const initialEarnings: EarningEntry[] = [
  { id: 'er1', date: '2025-04-20', user: 'Sonal', source: 'Delhi', destination: 'Agra', cost: 9000, offline: false },
  { id: 'er2', date: '2025-04-18', user: 'Amit', source: 'Gurgaon', destination: 'Noida', cost: 7000, offline: true }
];

const EarningsTab: React.FC = () => {
  const [entries, setEntries] = useState(initialEarnings);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<EarningEntry, 'id'>>({ date: '', user: '', source: '', destination: '', cost: 0, offline: true });

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
    if (form.user && form.date && form.source && form.destination && form.cost) {
      setEntries(prev => [
        ...prev.filter(e => !(showForm && (e.user === form.user && e.date === form.date))),
        { ...form, id: `er${Date.now()}` }
      ]);
      setShowForm(false);
      setForm({ date: '', user: '', source: '', destination: '', cost: 0, offline: true });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Earnings (Confirmed Bookings & Offline)</h2>
      <button className="bg-primary text-white px-4 py-2 rounded mb-4" onClick={handleAdd}>+ Add Offline Entry</button>
      {showForm && (
        <form className="mb-4 p-4 border rounded" onSubmit={handleFormSubmit}>
          <div className="flex gap-2 mb-2">
            <input className="border p-1" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} placeholder="Date" type="date" required />
            <input className="border p-1" value={form.user} onChange={e => setForm(f => ({ ...f, user: e.target.value }))} placeholder="User Name" required />
            <input className="border p-1" value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))} placeholder="Source" required />
            <input className="border p-1" value={form.destination} onChange={e => setForm(f => ({ ...f, destination: e.target.value }))} placeholder="Destination" required />
            <input className="border p-1" value={form.cost} onChange={e => setForm(f => ({ ...f, cost: Number(e.target.value) }))} placeholder="Cost" type="number" required />
            <button className="bg-green-500 text-white px-2 rounded" type="submit">Save</button>
            <button className="bg-gray-300 px-2 rounded" type="button" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}
      <table className="w-full table-auto bg-white shadow rounded">
        <thead>
          <tr className="bg-muted">
            <th className="p-2">Date</th>
            <th className="p-2">User</th>
            <th className="p-2">Source</th>
            <th className="p-2">Destination</th>
            <th className="p-2">Cost</th>
            <th className="p-2">Offline?</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(e => (
            <tr key={e.id}>
              <td className="p-2">{e.date}</td>
              <td className="p-2">{e.user}</td>
              <td className="p-2">{e.source}</td>
              <td className="p-2">{e.destination}</td>
              <td className="p-2">₹{e.cost}</td>
              <td className="p-2">{e.offline ? 'Yes' : 'No'}</td>
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

export default EarningsTab;
