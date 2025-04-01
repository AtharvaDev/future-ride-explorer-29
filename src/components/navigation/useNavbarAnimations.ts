
import { useEffect } from 'react';
import gsap from 'gsap';

export const useNavbarAnimations = (
  navbarRef: React.RefObject<HTMLElement>,
  logoRef: React.RefObject<HTMLAnchorElement>,
  menuItemsRef: React.MutableRefObject<HTMLLIElement[]>,
  actionButtonRef: React.RefObject<HTMLButtonElement>,
  mobileMenuButtonRef: React.RefObject<HTMLButtonElement>,
  mobileMenuOpen: boolean
) => {
  // Initial animations on mount
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    
    if (navbarRef.current) {
      tl.fromTo(
        navbarRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 }
      );
    }
    
    if (logoRef.current) {
      tl.fromTo(
        logoRef.current,
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4 },
        "-=0.4"
      );
    }
    
    if (menuItemsRef.current.length > 0) {
      tl.fromTo(
        menuItemsRef.current,
        { y: -10, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.4 },
        "-=0.2"
      );
    }
    
    if (actionButtonRef.current) {
      tl.fromTo(
        actionButtonRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4 },
        "-=0.2"
      );
    }
    
    if (mobileMenuButtonRef.current) {
      tl.fromTo(
        mobileMenuButtonRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4 },
        "-=0.4"
      );
    }
  }, [navbarRef, logoRef, menuItemsRef, actionButtonRef, mobileMenuButtonRef]);

  // Mobile menu animations
  useEffect(() => {
    if (mobileMenuOpen) {
      gsap.fromTo(
        ".dropdown-menu-content",
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
      );
    }
  }, [mobileMenuOpen]);
};
