
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/**
 * Creates a scroll-triggered animation that activates every time an element enters the viewport
 */
export const createRepeatingScrollAnimation = (element: Element, options: {
  animation: 'fadeUp' | 'fadeIn' | 'fadeLeft' | 'fadeRight' | 'scale' | 'custom';
  duration?: number;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  toggleActions?: string;
  customFrom?: gsap.TweenVars;
  customTo?: gsap.TweenVars;
}) => {
  // Define animation presets
  const animations = {
    fadeUp: {
      from: { y: 50, opacity: 0 },
      to: { y: 0, opacity: 1, ease: 'power2.out' }
    },
    fadeIn: {
      from: { opacity: 0 },
      to: { opacity: 1, ease: 'power2.out' }
    },
    fadeLeft: {
      from: { x: -50, opacity: 0 },
      to: { x: 0, opacity: 1, ease: 'power2.out' }
    },
    fadeRight: {
      from: { x: 50, opacity: 0 },
      to: { x: 0, opacity: 1, ease: 'power2.out' }
    },
    scale: {
      from: { scale: 0.9, opacity: 0 },
      to: { scale: 1, opacity: 1, ease: 'back.out(1.2)' }
    },
    custom: {
      from: options.customFrom || {},
      to: options.customTo || {}
    }
  };

  const selectedAnimation = animations[options.animation];
  const duration = options.duration || 0.8;
  
  // Set initial state
  gsap.set(element, selectedAnimation.from);
  
  // Create the scroll trigger animation
  return ScrollTrigger.create({
    trigger: element,
    start: options.start || 'top 80%',
    end: options.end || 'bottom 20%',
    scrub: options.scrub || false,
    toggleActions: options.toggleActions || 'play reverse play reverse', // Play on enter, reverse on leave
    onEnter: () => {
      gsap.to(element, {
        ...selectedAnimation.to,
        duration: duration
      });
    },
    onLeave: () => {
      gsap.to(element, {
        ...selectedAnimation.from,
        duration: duration
      });
    },
    onEnterBack: () => {
      gsap.to(element, {
        ...selectedAnimation.to,
        duration: duration
      });
    },
    onLeaveBack: () => {
      gsap.to(element, {
        ...selectedAnimation.from,
        duration: duration
      });
    }
  });
};

/**
 * Initializes scroll-triggered animations for elements with data-scroll attributes
 */
export const initScrollAnimations = () => {
  // Find all elements with data-scroll attribute
  document.querySelectorAll('[data-scroll]').forEach(element => {
    const animation = element.getAttribute('data-scroll') || 'fadeUp';
    const duration = parseFloat(element.getAttribute('data-duration') || '0.8');
    const delay = parseFloat(element.getAttribute('data-delay') || '0');
    const start = element.getAttribute('data-start') || 'top 80%';
    const end = element.getAttribute('data-end') || 'bottom 20%';
    const scrub = element.getAttribute('data-scrub') === 'true';
    
    // Set initial opacity to 0
    gsap.set(element, { opacity: 0 });
    
    // Create the animation
    createRepeatingScrollAnimation(element, {
      animation: animation as any,
      duration: duration,
      start: start,
      end: end,
      scrub: scrub,
    });
  });
};

/**
 * Creates a staggered scroll animation for a group of elements
 */
export const createStaggerScrollAnimation = (
  elements: Element[],
  options: {
    animation: 'fadeUp' | 'fadeIn' | 'fadeLeft' | 'fadeRight' | 'scale';
    staggerAmount?: number;
    duration?: number;
    start?: string;
    end?: string;
    scrub?: boolean | number;
  }
) => {
  // Define animation presets
  const animations = {
    fadeUp: {
      from: { y: 50, opacity: 0 },
      to: { y: 0, opacity: 1, ease: 'power2.out' }
    },
    fadeIn: {
      from: { opacity: 0 },
      to: { opacity: 1, ease: 'power2.out' }
    },
    fadeLeft: {
      from: { x: -50, opacity: 0 },
      to: { x: 0, opacity: 1, ease: 'power2.out' }
    },
    fadeRight: {
      from: { x: 50, opacity: 0 },
      to: { x: 0, opacity: 1, ease: 'power2.out' }
    },
    scale: {
      from: { scale: 0.9, opacity: 0 },
      to: { scale: 1, opacity: 1, ease: 'back.out(1.2)' }
    }
  };

  const selectedAnimation = animations[options.animation];
  const duration = options.duration || 0.8;
  const staggerAmount = options.staggerAmount || 0.1;
  
  // Set initial state for all elements
  gsap.set(elements, selectedAnimation.from);
  
  // Create the scroll trigger for the parent element
  if (elements.length > 0) {
    const parentElement = elements[0].parentElement;
    
    if (parentElement) {
      ScrollTrigger.create({
        trigger: parentElement,
        start: options.start || 'top 80%',
        end: options.end || 'bottom 20%',
        scrub: options.scrub || false,
        toggleActions: 'play reverse play reverse',
        onEnter: () => {
          gsap.to(elements, {
            ...selectedAnimation.to,
            duration: duration,
            stagger: staggerAmount
          });
        },
        onLeave: () => {
          gsap.to(elements, {
            ...selectedAnimation.from,
            duration: duration,
            stagger: staggerAmount
          });
        },
        onEnterBack: () => {
          gsap.to(elements, {
            ...selectedAnimation.to,
            duration: duration,
            stagger: staggerAmount
          });
        },
        onLeaveBack: () => {
          gsap.to(elements, {
            ...selectedAnimation.from,
            duration: duration,
            stagger: staggerAmount
          });
        }
      });
    }
  }
};
