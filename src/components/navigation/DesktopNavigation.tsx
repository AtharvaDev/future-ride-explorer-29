
import React from 'react';
import { cn } from '@/lib/utils';
import { NavLink } from './NavigationLinks';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

interface DesktopNavigationProps {
  links: NavLink[];
  handleNavigation: (href: string) => void;
  activeRoute?: string;
  scrolled: boolean;
  menuItemsRef: React.MutableRefObject<HTMLLIElement[]>;
}

export const DesktopNavigation: React.FC<DesktopNavigationProps> = ({ 
  links, 
  handleNavigation, 
  activeRoute, 
  scrolled,
  menuItemsRef
}) => {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        {links.map((link, index) => (
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
                (activeRoute === link.href || 
                 (activeRoute === '/' && link.href.startsWith('#')))
                  ? "bg-primary/10 text-primary font-medium" 
                  : "",
                link.name === "Contact" ? "text-green-600 hover:text-green-700" : "",
                scrolled || activeRoute !== "/" ? "text-gray-800" : "text-white"
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
  );
};
