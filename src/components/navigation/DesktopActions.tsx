
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User } from 'lucide-react';
import { AuthUser } from '@/contexts/AuthContext';

interface DesktopActionsProps {
  user: AuthUser | null;
  handleNavigation: (href: string) => void;
  handleAuthAction: () => void;
  scrolled: boolean;
}

export const DesktopActions: React.FC<DesktopActionsProps> = ({ 
  user, 
  handleNavigation, 
  handleAuthAction, 
  scrolled 
}) => {
  return (
    <div className="hidden md:flex items-center gap-2">
      {user ? (
        <>
          <Button 
            onClick={() => handleNavigation('/profile')}
            variant="outline"
            className={cn(
              "transition-all duration-300 hover:scale-105 flex items-center gap-2",
              scrolled ? "text-gray-800 border-gray-300 hover:text-gray-900 dark:text-white dark:border-gray-600" : 
              "text-white border-white/20 hover:text-white hover:bg-white/20"
            )}
          >
            <User className="h-4 w-4" />
            Profile
          </Button>
          <Button 
            onClick={handleAuthAction}
            variant="default"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-md"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </>
      ) : (
        <Button 
          onClick={handleAuthAction}
          variant="default"
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-md"
        >
          <LogIn className="h-4 w-4 mr-2" />
          Login
        </Button>
      )}
    </div>
  );
};
