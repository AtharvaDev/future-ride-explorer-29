
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
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
} from "@/components/ui/dropdown-menu";
import gsap from 'gsap';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const navbarRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const menuItemsRef = useRef<HTMLLIElement[]>([]);
  const contactButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Animate navbar items on load
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
    
    // Stagger animation for menu items
    if (menuItemsRef.current.length > 0) {
      tl.fromTo(
        menuItemsRef.current,
        { y: -10, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.4 },
        "-=0.2"
      );
    }
    
    if (contactButtonRef.current) {
      tl.fromTo(
        contactButtonRef.current,
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

    // Handle scroll effect
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

  // Animation for dropdown menu
  useEffect(() => {
    if (mobileMenuOpen) {
      gsap.fromTo(
        ".dropdown-menu-content",
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
      );
    }
  }, [mobileMenuOpen]);

  const navigationLinks = [
    { name: "Home", href: "/" },
    { name: "Fleet", href: "#fleet" },
  ];

  const handleNavigation = (href: string) => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
    
    if (href.startsWith('#') && window.location.pathname === '/') {
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
    } else {
      navigate(href);
    }
  };

  return (
    <header 
      ref={navbarRef}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        scrolled 
          ? "py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/20 dark:border-gray-800/20" 
          : "py-5 bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link 
              ref={logoRef}
              to="/" 
              className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-80 transition-all duration-300 hover:scale-105"
            >
              FutureRide
            </Link>
          </div>
          
          {/* Desktop Navigation */}
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
                        "transition-all duration-300 hover:scale-105"
                      )}
                      onClick={() => handleNavigation(link.href)}
                    >
                      {link.name}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          )}
          
          {/* Contact Button (Desktop) */}
          <div className="hidden md:block">
            <Button 
              ref={contactButtonRef}
              onClick={() => handleNavigation('#contact')}
              className="bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-300 hover:scale-105 hover:shadow-md"
            >
              Contact
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
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
                className="w-[200px] mt-2 dropdown-menu-content"
              >
                {navigationLinks.map((link) => (
                  <DropdownMenuItem 
                    key={link.name}
                    className="cursor-pointer transition-all duration-200 hover:scale-105 hover:pl-5"
                    onClick={() => handleNavigation(link.href)}
                  >
                    {link.name}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem 
                  className="cursor-pointer bg-primary/10 text-primary hover:bg-primary/20 mt-2 transition-all duration-200 hover:scale-105"
                  onClick={() => handleNavigation('#contact')}
                >
                  Contact
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
