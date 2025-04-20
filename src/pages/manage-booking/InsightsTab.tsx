
import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';

const data = [
  { month: "2025-03", earnings: 30000, expenses: 16000, revenue: 14000 },
  { month: "2025-04", earnings: 34000, expenses: 17000, revenue: 17000 }
];

const InsightsTab: React.FC = () => {
  const [range, setRange] = useState("all");

  // TODO: Add datepicker for custom range

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Insights</h2>
      {/* Date range picker could go here for more advanced filtering */}
      <div className="w-full max-w-3xl mx-auto py-6">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="earnings" fill="#10b981" name="Earnings" />
            <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
            <Bar dataKey="revenue" fill="#9b87f5" name="Revenue" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default InsightsTab;
