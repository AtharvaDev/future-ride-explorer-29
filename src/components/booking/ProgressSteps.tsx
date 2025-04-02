
import React from "react";
import { cn } from "@/lib/utils";

interface ProgressStepsProps {
  activeStep: number;
  steps?: string[];
}

const defaultSteps = ["Login", "Contact", "Dates", "Review", "Payment"];

const ProgressSteps: React.FC<ProgressStepsProps> = ({ 
  activeStep = 0,
  steps = defaultSteps 
}) => {
  return (
    <div className="relative">
      <div className="flex items-center justify-between w-full">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {/* Step Circle */}
            <div
              className={cn(
                "relative z-10 flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium border",
                index <= activeStep
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-muted"
              )}
            >
              {index < activeStep ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                index + 1
              )}
            </div>

            {/* Step Label */}
            <div
              className={cn(
                "absolute top-10 transform -translate-x-1/2 text-xs font-medium",
                index <= activeStep ? "text-primary" : "text-muted-foreground"
              )}
              style={{ left: `calc(${(index / (steps.length - 1)) * 100}%)` }}
            >
              {step}
            </div>

            {/* Connector (not for the last step) */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "absolute h-[2px]",
                  index < activeStep ? "bg-primary" : "bg-muted"
                )}
                style={{
                  left: `calc(${(index / (steps.length - 1)) * 100}% + 16px)`,
                  right: `calc(${100 - ((index + 1) / (steps.length - 1)) * 100}% + 16px)`,
                  top: "14px",
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="h-16" />
    </div>
  );
};

export default ProgressSteps;
