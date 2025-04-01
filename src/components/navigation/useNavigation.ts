
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import gsap from 'gsap';

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
      const phoneNumber = '+919876543210'; // Replace with actual number
      window.location.href = `tel:${phoneNumber}`;
      toast.success("Calling FutureRide customer service");
      return;
    }
    
    if (href.startsWith('#') && (window.location.pathname === '/' || !location)) {
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
  
  return { 
    handleNavigation, 
    location, 
    isAdminPage, 
    isHomePage 
  };
};
