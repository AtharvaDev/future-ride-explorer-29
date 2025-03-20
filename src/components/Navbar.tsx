
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  useEffect(() => {
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

  const navigationLinks = [
    { name: "Home", href: "/" },
    { name: "Fleet", href: "#fleet" },
    { name: "Pricing", href: "#pricing" },
    { name: "About", href: "#about" },
  ];

  const handleNavigation = (href: string) => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
    
    if (href.startsWith('#') && window.location.pathname === '/') {
      const element = document.getElementById(href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(href);
    }
  };

  return (
    <header 
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
              to="/" 
              className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-80 transition-opacity"
            >
              FutureRide
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          {!isMobile && (
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                {navigationLinks.map((link) => (
                  <NavigationMenuItem key={link.name}>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
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
              onClick={() => handleNavigation('#contact')}
              className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              Contact
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          {isMobile && (
            <DropdownMenu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Menu">
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px] mt-2">
                {navigationLinks.map((link) => (
                  <DropdownMenuItem 
                    key={link.name}
                    className="cursor-pointer"
                    onClick={() => handleNavigation(link.href)}
                  >
                    {link.name}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem 
                  className="cursor-pointer bg-primary/10 text-primary hover:bg-primary/20 mt-2"
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
