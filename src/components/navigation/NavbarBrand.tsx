
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
        src="/lovable-uploads/1fb1ee26-e11e-43d3-897d-2054f89c95d8.png" 
        alt="The Chauffeur Co. Logo" 
        className="h-12 w-auto" 
      />
      <span className="sr-only">{brandName}</span>
    </Link>
  );
};
