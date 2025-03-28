import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Car, Home, Phone, Shield, LogIn, LogOut, User, Book } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import gsap from 'gsap';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user, isAdmin, signOut } = useAuth();
  
  let navigate;
  let location;
  
  try {
    navigate = useNavigate();
    location = useLocation();
  } catch (error) {
    // Router hooks not available, we'll handle navigation differently
  }
  
  const navbarRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const menuItemsRef = useRef<HTMLLIElement[]>([]);
  const actionButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

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

    const handleScroll = () => {
      const isScrolled = window.scrollY > 30;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  useEffect(() => {
    if (mobileMenuOpen) {
      gsap.fromTo(
        ".dropdown-menu-content",
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
      );
    }
  }, [mobileMenuOpen]);

  const getNavigationLinks = () => {
    const links = [
      { name: "Home", href: "/", icon: Home },
      { name: "Fleet", href: "#fleet", icon: Car },
      { name: "Contact", href: "#contact", icon: Phone },
    ];
    
    if (user && !isAdmin) {
      links.push({ name: "My Bookings", href: "/my-bookings", icon: Book });
    }
    
    if (isAdmin) {
      links.push({ name: "Admin", href: "/admin", icon: Shield });
    }
    
    return links;
  };

  const navigationLinks = getNavigationLinks();

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

  const handleAuthAction = () => {
    if (user) {
      signOut();
    } else {
      handleNavigation('/login');
    }
  };

  const isAdminPage = location?.pathname === '/admin';

  return (
    <header 
      ref={navbarRef}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        scrolled || isAdminPage
          ? "py-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200/20 dark:border-gray-800/20 shadow-sm" 
          : "py-5 bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link 
              ref={logoRef}
              to="/" 
              className="text-2xl font-bold flex items-center gap-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-80 transition-all duration-300 hover:scale-105"
              onClick={(e) => {
                if (!navigate) {
                  e.preventDefault();
                  handleNavigation('/');
                }
              }}
            >
              <Car className="h-6 w-6 text-blue-600" />
              <span>FutureRide</span>
            </Link>
          </div>
          
          {!isMobile && (
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                {navigationLinks.map((link, index) => (
                  <NavigationMenuItem 
                    key={link.name}
                    ref={el => {
                      if (el) menuItemsRef.current[index] = el;
                    }}
                  >
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "transition-all duration-300 hover:scale-105 flex items-center gap-2",
                        (location?.pathname === link.href || 
                         (location?.pathname === '/' && link.href.startsWith('#')))
                          ? "bg-primary/10 text-primary font-medium" 
                          : "",
                        link.name === "Contact" ? "text-green-600 hover:text-green-700" : ""
                      )}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigation(link.href);
                      }}
                    >
                      <link.icon className={cn(
                        "h-4 w-4",
                        link.name === "Contact" ? "text-green-600" : ""
                      )} />
                      {link.name}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          )}
          
          <div className="hidden md:block">
            {user ? (
              <Button 
                ref={actionButtonRef}
                onClick={() => handleNavigation('/profile')}
                variant="outline"
                className="mr-2 transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Profile
              </Button>
            ) : null}
            <Button 
              ref={actionButtonRef}
              onClick={handleAuthAction}
              variant="default"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-md"
            >
              {user ? (
                <>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </>
              )}
            </Button>
          </div>
          
          {isMobile && (
            <DropdownMenu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button 
                  ref={mobileMenuButtonRef}
                  variant="ghost" 
                  size="icon" 
                  aria-label="Menu"
                  className="transition-all duration-300 hover:scale-105"
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-56 mt-2 dropdown-menu-content rounded-xl p-2"
              >
                {navigationLinks.map((link) => (
                  <DropdownMenuItem 
                    key={link.name}
                    className={cn(
                      "cursor-pointer transition-all duration-200 hover:scale-105 hover:bg-primary/10 rounded-lg flex items-center gap-2 p-3",
                      link.name === "Contact" ? "text-green-600 hover:text-green-700" : ""
                    )}
                    onClick={() => handleNavigation(link.href)}
                  >
                    <link.icon className={cn(
                      "h-4 w-4",
                      link.name === "Contact" ? "text-green-600" : ""
                    )} />
                    {link.name}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 mt-2 transition-all duration-200 rounded-lg p-3 flex justify-center"
                  onClick={handleAuthAction}
                >
                  {user ? (
                    <>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4 mr-2" />
                      Login
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
