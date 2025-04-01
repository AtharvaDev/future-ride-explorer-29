
import { Car } from 'lucide-react';
import { Link } from 'react-router-dom';
import React from 'react';

interface NavbarBrandProps {
  onClick: (e: React.MouseEvent) => void;
  logoRef: React.RefObject<HTMLAnchorElement>;
}

export const NavbarBrand: React.FC<NavbarBrandProps> = ({ onClick, logoRef }) => {
  const brandName = "The Chauffeur Co.";
  
  return (
    <Link 
      ref={logoRef}
      to="/" 
      className="text-2xl font-bold flex items-center gap-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500 hover:opacity-80 transition-all duration-300 hover:scale-105"
      onClick={onClick}
    >
      <Car className="h-6 w-6 text-purple-500" />
      <span>{brandName}</span>
    </Link>
  );
};
