
import React from 'react';
// For demo, fake loading/entries; you should wire to Firestore with your auth/roles setup
const bookings = [
  { id: 'bk1', user: 'Amit Kumar', car: 'Innova', date: '2025-04-21', status: 'confirmation pending', source: 'Delhi', destination: 'Jaipur', cost: 8000 },
  { id: 'bk2', user: 'Sonal Jain', car: 'Fortuner', date: '2025-04-20', status: 'confirmed', source: 'Delhi', destination: 'Agra', cost: 9000 }
];

const BookingManagementTab: React.FC = () => {
  const onAccept = (id: string) => {
    // TODO: update status to confirmed in Firestore & notify user/admin
    alert(`Accepted booking ${id} (update in Firestore and send notification)`);
  };

  const onReject = (id: string) => {
    // TODO: update status to cancelled in Firestore, process refund, notify user/admin
    alert(`Rejected booking ${id} (cancel in Firestore, process refund, send notifications)`);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Active Bookings</h2>
      <table className="w-full table-auto bg-white shadow rounded">
        <thead>
          <tr className="bg-muted">
            <th className="p-2">Date</th>
            <th className="p-2">User</th>
            <th className="p-2">Car</th>
            <th className="p-2">Source</th>
            <th className="p-2">Destination</th>
            <th className="p-2">Total Cost</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b.id} className="border-b">
              <td className="p-2">{b.date}</td>
              <td className="p-2">{b.user}</td>
              <td className="p-2">{b.car}</td>
              <td className="p-2">{b.source}</td>
              <td className="p-2">{b.destination}</td>
              <td className="p-2">₹{b.cost}</td>
              <td className="p-2">{b.status}</td>
              <td className="p-2 flex gap-2">
                {b.status === 'confirmation pending' && (
                  <>
                    <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={() => onAccept(b.id)}>Accept</button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => onReject(b.id)}>Reject</button>
                  </>
                )}
                {b.status !== 'confirmation pending' && <span>-</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default BookingManagementTab;
