
import React from 'react';
import { Link } from 'react-router-dom';

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
      className="flex items-center gap-2 hover:opacity-90 transition-all duration-300 hover:scale-105"
      onClick={onClick}
    >
      <img 
        src="/lovable-uploads/c2f979be-0f33-4679-b957-f06b239b7aab.png" 
        alt="The Chauffeur Co. Logo" 
        className="h-12 w-auto" 
      />
      <span className="sr-only">{brandName}</span>
    </Link>
  );
};
