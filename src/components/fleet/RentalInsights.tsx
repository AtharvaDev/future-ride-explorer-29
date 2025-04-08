
import React, { useRef, useEffect } from 'react';
import { InfoIcon } from 'lucide-react';
import { gsap } from '@/lib/gsap';

interface RentalInsightsProps {
  insights: string[];
}

const RentalInsights: React.FC<RentalInsightsProps> = ({ insights }) => {
  const insightsRef = useRef<HTMLUListElement>(null);
  
  if (!insights || insights.length === 0) {
    return null;
  }
  
  useEffect(() => {
    if (insightsRef.current) {
      const items = insightsRef.current.querySelectorAll('li');
      gsap.set(items, { opacity: 0, x: -20 });
      
      gsap.to(items, {
        opacity: 1,
        x: 0,
        duration: 0.4,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.5
      });
    }
  }, [insights]);

  return (
    <div className="rental-insights-container h-full flex flex-col justify-center">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-primary">
        <InfoIcon className="h-5 w-5" />
        <span>Rental Insights</span>
      </h3>
      <ul ref={insightsRef} className="space-y-3">
        {insights.map((insight, index) => (
          <li 
            key={index} 
            className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-all duration-300 border border-primary/10 transform hover:-translate-y-1 hover:shadow-md"
          >
            <div className="h-7 w-7 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
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
