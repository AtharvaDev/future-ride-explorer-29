
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from 'lucide-react';
import { AuthUser } from '@/contexts/AuthContext';
import { UI_STRINGS } from '@/constants/uiStrings';

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
        <Button 
          onClick={handleAuthAction}
          variant="default"
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-md"
        >
          <LogOut className="h-4 w-4 mr-2" />
          {UI_STRINGS.NAVIGATION.LOGOUT}
        </Button>
      ) : (
        <Button 
          onClick={handleAuthAction}
          variant="default"
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-md"
        >
          <LogIn className="h-4 w-4 mr-2" />
          {UI_STRINGS.NAVIGATION.LOGIN}
        </Button>
      )}
    </div>
  );
};
