
import React from 'react';
import { InfoIcon } from 'lucide-react';

interface RentalInsightsProps {
  insights: string[];
}

const RentalInsights: React.FC<RentalInsightsProps> = ({ insights }) => {
  if (!insights || insights.length === 0) {
    return null;
  }

  return (
    <div className="rental-insights-container">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-primary">
        <InfoIcon className="h-5 w-5" />
        <span>Rental Insights</span>
      </h3>
      <ul className="space-y-3">
        {insights.map((insight, index) => (
          <li 
            key={index} 
            className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors border border-primary/10"
          >
            <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
              <span className="text-xs font-bold">{index + 1}</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300">{insight}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RentalInsights;
