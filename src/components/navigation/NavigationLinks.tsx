
import { Home, Car, Phone, Book, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UI_STRINGS } from '@/constants/uiStrings';

export type NavLink = {
  name: string;
  href: string;
  icon: React.ElementType;
};

export const useNavigationLinks = () => {
  const { user, isAdmin } = useAuth();
  
  const links: NavLink[] = [
    { name: UI_STRINGS.NAVIGATION.HOME, href: "/", icon: Home },
    { name: UI_STRINGS.NAVIGATION.FLEET, href: "#fleet", icon: Car },
    { name: UI_STRINGS.NAVIGATION.CONTACT, href: "#contact", icon: Phone },
  ];
  
  if (user) {
    links.push({ name: UI_STRINGS.NAVIGATION.MY_BOOKINGS, href: "/my-bookings", icon: Book });
  }
  
  if (isAdmin) {
    links.push({ name: UI_STRINGS.NAVIGATION.ADMIN, href: "/admin", icon: Shield });
  }
  
  return links;
};
