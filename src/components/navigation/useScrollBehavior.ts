
import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

export const useScrollBehavior = () => {
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      // Use a smaller threshold for mobile devices and larger for desktop
      const threshold = isMobile ? 30 : 50;
      const isScrolled = window.scrollY > threshold;
      
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    // Initialize scroll state
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled, isMobile]);

  return scrolled;
};
