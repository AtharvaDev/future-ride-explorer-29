
import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigationLinks } from './navigation/NavigationLinks';
import { NavbarBrand } from './navigation/NavbarBrand';
import { DesktopNavigation } from './navigation/DesktopNavigation';
import { DesktopActions } from './navigation/DesktopActions';
import { MobileNavigation } from './navigation/MobileNavigation';
import { useNavbarAnimations } from './navigation/useNavbarAnimations';
import { useScrollBehavior } from './navigation/useScrollBehavior';
import { useNavigation } from './navigation/useNavigation';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user, signOut } = useAuth();
  
  const navbarRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const menuItemsRef = useRef<HTMLLIElement[]>([]);
  const actionButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

  const scrolled = useScrollBehavior();
  const navigationLinks = useNavigationLinks();
  
  const { handleNavigation, location, isAdminPage, isHomePage } = useNavigation({
    mobileMenuOpen,
    setMobileMenuOpen
  });

  useNavbarAnimations(
    navbarRef,
    logoRef,
    menuItemsRef,
    actionButtonRef,
    mobileMenuButtonRef,
    mobileMenuOpen
  );

  const handleAuthAction = () => {
    if (user) {
      signOut();
    } else {
      handleNavigation('/login');
    }
  };

  return (
    <header 
      ref={navbarRef}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        isHomePage && !scrolled 
          ? "py-5 bg-black/40 backdrop-blur-sm border-b border-white/10" 
          : "py-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200/20 dark:border-gray-800/20 shadow-sm",
        isAdminPage 
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200/20 dark:border-gray-800/20 shadow-sm"
          : ""
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <NavbarBrand 
              onClick={(e) => {
                if (!location) {
                  e.preventDefault();
                  handleNavigation('/');
                }
              }}
              logoRef={logoRef}
            />
          </div>
          
          {!isMobile && (
            <DesktopNavigation 
              links={navigationLinks}
              handleNavigation={handleNavigation}
              activeRoute={location?.pathname}
              scrolled={scrolled}
              menuItemsRef={menuItemsRef}
            />
          )}
          
          {!isMobile && (
            <DesktopActions
              user={user}
              handleNavigation={handleNavigation}
              handleAuthAction={handleAuthAction}
              scrolled={scrolled}
            />
          )}
          
          {isMobile && (
            <MobileNavigation
              links={navigationLinks}
              user={user}
              mobileMenuOpen={mobileMenuOpen}
              setMobileMenuOpen={setMobileMenuOpen}
              handleNavigation={handleNavigation}
              handleAuthAction={handleAuthAction}
              scrolled={scrolled}
              mobileMenuButtonRef={mobileMenuButtonRef}
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
