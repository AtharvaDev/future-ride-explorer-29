
import { Home, Car, Phone, Book, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export type NavLink = {
  name: string;
  href: string;
  icon: React.ElementType;
};

export const useNavigationLinks = () => {
  const { user, isAdmin } = useAuth();
  
  const links: NavLink[] = [
    { name: "Home", href: "/", icon: Home },
    { name: "Fleet", href: "#fleet", icon: Car },
    { name: "Contact", href: "#contact", icon: Phone },
  ];
  
  if (user) {
    links.push({ name: "My Bookings", href: "/my-bookings", icon: Book });
  }
  
  if (isAdmin) {
    links.push({ name: "Admin", href: "/admin", icon: Shield });
  }
  
  return links;
};
