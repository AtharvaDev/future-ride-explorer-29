
import React from 'react';
import { InfoIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface RentalInsightsProps {
  insights: string[];
}

const RentalInsights: React.FC<RentalInsightsProps> = ({ insights }) => {
  if (!insights || insights.length === 0) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <InfoIcon className="h-5 w-5 text-primary" />
          <span>Rental Insights</span>
        </h3>
        <ul className="space-y-2">
          {insights.map((insight, index) => (
            <li key={index} className="flex items-start gap-2">
              <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold">{index + 1}</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300">{insight}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default RentalInsights;
