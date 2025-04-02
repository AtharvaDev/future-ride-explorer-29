
import React from 'react';
import { cn } from '@/lib/utils';
import { Menu, X, LogIn, LogOut, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { NavLink } from './NavigationLinks';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { AuthUser } from '@/contexts/AuthContext';

interface MobileNavigationProps {
  links: NavLink[];
  user: AuthUser | null;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleNavigation: (href: string) => void;
  handleAuthAction: () => void;
  scrolled: boolean;
  mobileMenuButtonRef: React.RefObject<HTMLButtonElement>;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  links,
  user,
  mobileMenuOpen,
  setMobileMenuOpen,
  handleNavigation,
  handleAuthAction,
  scrolled,
  mobileMenuButtonRef
}) => {
  return (
    <DropdownMenu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          ref={mobileMenuButtonRef}
          variant="ghost" 
          size="icon" 
          aria-label="Menu"
          className={cn(
            "transition-all duration-300 hover:scale-105",
            scrolled || window.location.pathname !== "/" ? "text-gray-800 hover:bg-gray-100/80" : "text-white hover:bg-white/20" 
          )}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 mt-2 dropdown-menu-content rounded-xl p-2 bg-white/95 backdrop-blur-md"
      >
        {links.map((link) => (
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
        
        {user && (
          <DropdownMenuItem 
            className="cursor-pointer transition-all duration-200 hover:scale-105 hover:bg-primary/10 rounded-lg flex items-center gap-2 p-3"
            onClick={() => handleNavigation('/profile')}
          >
            <User className="h-4 w-4" />
            Profile
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90 mt-2 transition-all duration-200 rounded-lg p-3 flex justify-center"
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
  );
};
