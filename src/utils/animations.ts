import { gsap, ScrollTrigger } from '@/lib/gsap';

// Entrance animations
export const fadeInUp = (element: Element, delay: number = 0, duration: number = 0.6) => {
  return gsap.fromTo(
    element,
    { 
      opacity: 0, 
      y: 30 
    },
    { 
      opacity: 1, 
      y: 0, 
      duration: duration, 
      delay: delay,
      ease: 'power2.out'
    }
  );
};

export const fadeInLeft = (element: Element, delay: number = 0, duration: number = 0.6) => {
  return gsap.fromTo(
    element,
    { 
      opacity: 0, 
      x: -30 
    },
    { 
      opacity: 1, 
      x: 0, 
      duration: duration, 
      delay: delay,
      ease: 'power2.out'
    }
  );
};

export const fadeInRight = (element: Element, delay: number = 0, duration: number = 0.6) => {
  return gsap.fromTo(
    element,
    { 
      opacity: 0, 
      x: 30 
    },
    { 
      opacity: 1, 
      x: 0, 
      duration: duration, 
      delay: delay,
      ease: 'power2.out'
    }
  );
};

export const scaleIn = (element: Element, delay: number = 0, duration: number = 0.6) => {
  return gsap.fromTo(
    element,
    { 
      opacity: 0, 
      scale: 0.9 
    },
    { 
      opacity: 1, 
      scale: 1, 
      duration: duration, 
      delay: delay,
      ease: 'back.out(1.7)'
    }
  );
};

// Hover animations
export const createHoverAnimation = (element: Element, scale: number = 1.05) => {
  const hoverIn = () => {
    gsap.to(element, { scale: scale, duration: 0.3, ease: 'power2.out' });
  };
  
  const hoverOut = () => {
    gsap.to(element, { scale: 1, duration: 0.3, ease: 'power2.out' });
  };
  
  element.addEventListener('mouseenter', hoverIn);
  element.addEventListener('mouseleave', hoverOut);
  
  // Return cleanup function
  return () => {
    element.removeEventListener('mouseenter', hoverIn);
    element.removeEventListener('mouseleave', hoverOut);
  };
};

// Scroll animations
export const createScrollAnimation = (element: Element, options: any = {}) => {
  return ScrollTrigger.create({
    trigger: element,
    start: options.start || 'top 80%',
    end: options.end || 'bottom 20%',
    onEnter: () => {
      gsap.to(element, { 
        opacity: 1, 
        y: 0, 
        duration: options.duration || 0.6,
        ease: options.ease || 'power2.out'
      });
    },
    onLeave: options.onLeave,
    onEnterBack: options.onEnterBack,
    onLeaveBack: () => {
      if (options.animateOut) {
        gsap.to(element, { 
          opacity: 0, 
          y: 30, 
          duration: options.duration || 0.6
        });
      }
    },
    toggleActions: options.toggleActions || 'play none none none',
    markers: options.markers || false
  });
};

// Stagger animations for multiple elements
export const staggerElements = (elements: Element[], staggerTime: number = 0.1, animation: string = 'fadeInUp') => {
  const animations: any = {
    fadeInUp: {
      from: { opacity: 0, y: 30 },
      to: { opacity: 1, y: 0, ease: 'power2.out' }
    },
    fadeInLeft: {
      from: { opacity: 0, x: -30 },
      to: { opacity: 1, x: 0, ease: 'power2.out' }
    },
    fadeInRight: {
      from: { opacity: 0, x: 30 },
      to: { opacity: 1, x: 0, ease: 'power2.out' }
    },
    scaleIn: {
      from: { opacity: 0, scale: 0.9 },
      to: { opacity: 1, scale: 1, ease: 'back.out(1.7)' }
    }
  };
  
  const selectedAnimation = animations[animation];
  
  return gsap.fromTo(
    elements,
    selectedAnimation.from,
    {
      ...selectedAnimation.to,
      duration: 0.6,
      stagger: staggerTime
    }
  );
};

// Initialize animations on page load
export const initPageAnimations = () => {
  // Animate elements with data-animate attribute
  document.querySelectorAll('[data-animate]').forEach(element => {
    const animationType = element.getAttribute('data-animate') || 'fadeInUp';
    const delay = parseFloat(element.getAttribute('data-delay') || '0');
    
    switch(animationType) {
      case 'fadeInUp':
        fadeInUp(element, delay);
        break;
      case 'fadeInLeft':
        fadeInLeft(element, delay);
        break;
      case 'fadeInRight':
        fadeInRight(element, delay);
        break;
      case 'scaleIn':
        scaleIn(element, delay);
        break;
      default:
        fadeInUp(element, delay);
    }
  });
  
  // Set up scroll animations
  document.querySelectorAll('[data-scroll-animate]').forEach(element => {
    gsap.set(element, { opacity: 0, y: 30 });
    createScrollAnimation(element, {
      animateOut: element.getAttribute('data-animate-out') === 'true'
    });
  });
};
