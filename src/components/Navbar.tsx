
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 30;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        scrolled 
          ? "py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/20 dark:border-gray-800/20" 
          : "py-5 bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
              FutureRide
            </span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
              Home
            </a>
            <a href="#" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
              Fleet
            </a>
            <a href="#" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
              Pricing
            </a>
            <a href="#" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
              About
            </a>
          </nav>
          <div>
            <button 
              className="hidden md:inline-flex items-center justify-center rounded-md h-10 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              Contact
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
