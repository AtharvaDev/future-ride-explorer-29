
import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Progress } from "@/components/ui/progress";
import { gsap } from "@/lib/gsap";

interface ProgressStepsProps {
  activeStep: number;
  steps?: string[];
}

const defaultSteps = ["Login", "Contact", "Dates", "Review", "Payment"];

const ProgressSteps: React.FC<ProgressStepsProps> = ({
  activeStep = 0,
  steps = defaultSteps
}) => {
  const isMobile = useIsMobile();
  const [animationProgress, setAnimationProgress] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  // Calculate percentage completion
  const progressPercentage = Math.round((activeStep / (steps.length - 1)) * 100);
  
  React.useEffect(() => {
    // Animate the progress indicator
    gsap.to(containerRef.current?.querySelectorAll('.step-circle-inner'), {
      scale: 1,
      duration: 0.5,
      stagger: 0.1,
      ease: "back.out(1.7)",
    });
    
    // Animate the progress when step changes
    gsap.fromTo(
      [containerRef.current?.querySelector('.progress-value')],
      { width: `${(activeStep - 1) / (steps.length - 1) * 100}%` },
      { 
        width: `${activeStep / (steps.length - 1) * 100}%`, 
        duration: 0.8,
        ease: "power2.out"
      }
    );
    
    // Animate progress percentage
    let value = 0;
    const targetValue = progressPercentage;
    const duration = 1;
    const start = performance.now();
    
    const animate = (time: number) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      value = Math.floor(progress * targetValue);
      setAnimationProgress(value);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [activeStep, progressPercentage, steps.length]);
  
  return (
    <div ref={containerRef} className="w-full mb-8 relative">
      {/* Progress Percentage Display */}
      <div className="mb-2 flex justify-between items-center">
        <h3 className="text-sm font-medium text-muted-foreground">Progress</h3>
        <div className="text-sm font-medium">{animationProgress}%</div>
      </div>
      
      {/* Progress Bar */}
      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden mb-8">
        <div 
          className="h-full bg-primary rounded-full progress-value transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      {/* Steps Container */}
      <div className="flex items-center justify-between w-full relative">
        {/* Connector Line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-muted -translate-y-1/2" />
        
        {/* Steps */}
        {steps.map((step, index) => (
          <div 
            key={index} 
            className={cn(
              "relative z-10 flex flex-col items-center",
              isMobile ? "px-1" : ""
            )}
          >
            {/* Step Circle */}
            <div
              className={cn(
                "w-12 h-12 rounded-full border-2 flex items-center justify-center relative",
                index <= activeStep
                  ? "border-primary bg-primary bg-opacity-10"
                  : "border-muted bg-background"
              )}
            >
              <div
                className={cn(
                  "step-circle-inner w-8 h-8 rounded-full flex items-center justify-center transition-all",
                  index < activeStep
                    ? "bg-primary text-primary-foreground"
                    : index === activeStep
                    ? "bg-primary text-primary-foreground animate-pulse-light"
                    : "bg-muted text-muted-foreground"
                )}
                style={{ transform: 'scale(0)' }} // Initial state for animation
              >
                {index < activeStep ? (
                  <Check className="h-5 w-5 stroke-[3]" />
                ) : (
                  <span className="text-sm font-bold">{index + 1}</span>
                )}
              </div>
            </div>
            
            {/* Step Label */}
            <span
              className={cn(
                "mt-2 text-xs font-medium whitespace-nowrap",
                isMobile ? "text-[10px]" : "text-xs",
                index <= activeStep ? "text-primary" : "text-muted-foreground"
              )}
            >
              {isMobile ? (
                index === activeStep ? step : ""
              ) : (
                step
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressSteps;
