
import React from 'react';
import { cn } from "@/lib/utils";

export type BookingStep = 'contact' | 'dates' | 'payment' | 'confirmation';

interface ProgressStepsProps {
  currentStep: BookingStep;
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({ currentStep }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {(['contact', 'dates', 'payment', 'confirmation'] as BookingStep[]).map((step, index) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                  currentStep === step 
                    ? "bg-primary text-white" 
                    : (
                      index <= ['contact', 'dates', 'payment', 'confirmation'].indexOf(currentStep) 
                        ? "bg-primary/20 text-primary" 
                        : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                    )
                )}
              >
                {index + 1}
              </div>
              <span className="text-xs mt-2 hidden sm:block">{
                step === 'contact' ? 'Contact' : 
                step === 'dates' ? 'Dates' : 
                step === 'payment' ? 'Payment' : 
                'Confirmation'
              }</span>
            </div>
            
            {index < 3 && (
              <div 
                className={cn(
                  "flex-1 h-1 mx-2",
                  index < ['contact', 'dates', 'payment', 'confirmation'].indexOf(currentStep) 
                    ? "bg-primary" 
                    : "bg-gray-100 dark:bg-gray-800"
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProgressSteps;
