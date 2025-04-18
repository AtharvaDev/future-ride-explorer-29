
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { gsap } from '@/lib/gsap';

interface NavigationConfig {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useNavigation = ({ mobileMenuOpen, setMobileMenuOpen }: NavigationConfig) => {
  let navigate;
  let location;
  
  try {
    navigate = useNavigate();
    location = useLocation();
  } catch (error) {
    // Router hooks not available, we'll handle navigation differently
  }

  const handleNavigation = (href: string) => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
    
    if (href === '#contact') {
      const phoneNumber = '+917066569090'; // Replace with actual number
      window.location.href = `tel:${phoneNumber}`;
      toast.success("Calling The Chauffeur Co. customer service");
      return;
    }
    
    // Handle navigation to home page when clicking fleet on another page
    if (href === '/#fleet' && location && location.pathname !== '/') {
      navigate('/');
      
      // Set a timeout to scroll to the element after navigation
      setTimeout(() => {
        const element = document.getElementById('fleet');
        if (element) {
          gsap.to(window, {
            duration: 1,
            scrollTo: {
              y: element,
              offsetY: 80
            },
            ease: "power2.inOut"
          });
        }
      }, 500);
      return;
    }
    
    // Special handling for section navigation when not on home page
    if (href.startsWith('#') && location && location.pathname !== '/') {
      navigate('/');
      
      // Set a timeout to scroll to the element after navigation
      setTimeout(() => {
        const element = document.getElementById(href.substring(1));
        if (element) {
          gsap.to(window, {
            duration: 1,
            scrollTo: {
              y: element,
              offsetY: 80
            },
            ease: "power2.inOut"
          });
        }
      }, 500);
      return;
    }
    
    // Normal section navigation on home page
    if (href.startsWith('#') && (location?.pathname === '/' || !location)) {
      const element = document.getElementById(href.substring(1));
      if (element) {
        gsap.to(window, {
          duration: 1,
          scrollTo: {
            y: element,
            offsetY: 80
          },
          ease: "power2.inOut"
        });
      }
    } else if (navigate) {
      navigate(href);
    } else {
      window.location.href = href;
    }
  };

  const isAdminPage = location?.pathname === '/admin';
  const isHomePage = location?.pathname === '/';
  const isBookingPage = location?.pathname.includes('/booking');
  
  return { 
    handleNavigation, 
    location, 
    isAdminPage,
    isHomePage,
    isBookingPage
  };
};
