
import { Home, Car, Phone, Book, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UI_STRINGS } from '@/constants/uiStrings';

export type NavLink = {
  name: string;
  href: string;
  icon: React.ElementType;
};

export const useNavigationLinks = () => {
  // Initialize defaults
  let user = null;
  let isAdmin = false;
  
  try {
    // Try to use auth context, but handle the case where it might not be available yet
    const auth = useAuth();
    user = auth?.user || null;
    isAdmin = auth?.isAdmin || false;
  } catch (error) {
    console.warn("Auth context not available yet in NavigationLinks, using default links");
    // Continue with default links
  }
  
  // Default links that don't require authentication
  const links: NavLink[] = [
    { name: UI_STRINGS.NAVIGATION.HOME, href: "/", icon: Home },
    { name: UI_STRINGS.NAVIGATION.FLEET, href: "/#fleet", icon: Car },
    { name: UI_STRINGS.NAVIGATION.CONTACT, href: "#contact", icon: Phone },
  ];
  
  // Add authenticated links if user is logged in
  if (user) {
    links.push({ name: UI_STRINGS.NAVIGATION.MY_BOOKINGS, href: "/my-bookings", icon: Book });
  }
  
  // Add admin link if user is an admin
  if (isAdmin) {
    links.push({ name: UI_STRINGS.NAVIGATION.ADMIN, href: "/admin", icon: Shield });
  }
  
  return links;
};
