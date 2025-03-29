
import React from 'react';
import { cn } from "@/lib/utils";

export type BookingStep = 'contact' | 'dates' | 'payment' | 'confirmation';

interface ProgressStepsProps {
  activeStep: number;
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({ activeStep }) => {
  // Updated step order: contact, dates, payment, confirmation
  const getStepName = (index: number): BookingStep => {
    switch(index) {
      case 0: return 'contact';
      case 1: return 'dates';
      case 2: return 'payment';
      case 3: return 'confirmation';
      default: return 'contact';
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {[0, 1, 2, 3].map((index) => {
          const step = getStepName(index);
          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
                <div 
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    activeStep === index 
                      ? "bg-primary text-white" 
                      : (
                        index <= activeStep 
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
                    index < activeStep 
                      ? "bg-primary" 
                      : "bg-gray-100 dark:bg-gray-800"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressSteps;
