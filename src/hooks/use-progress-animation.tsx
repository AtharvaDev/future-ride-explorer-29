
import React from 'react';
import { gsap } from '@/lib/gsap';

export function useProgressAnimation(activeStep: number, totalSteps: number) {
  const [animationProgress, setAnimationProgress] = React.useState(0);
  const progressPercentage = Math.round((activeStep / (totalSteps - 1)) * 100);
  
  React.useEffect(() => {
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
  }, [activeStep, progressPercentage]);
  
  return {
    animationProgress,
    progressPercentage
  };
}
