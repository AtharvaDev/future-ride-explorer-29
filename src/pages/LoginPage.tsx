
import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoginForm from '@/components/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { gsap } from '@/lib/gsap';
import { fadeInUp, staggerElements } from '@/utils/animations';

const LoginPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const returnUrl = (location.state as { returnUrl?: string })?.returnUrl || '/';
  
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  // Prevent scrolling to bottom on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  useEffect(() => {
    // If user is already logged in, redirect to the return URL or home
    if (user && !loading) {
      navigate(returnUrl);
    }
  }, [user, loading, navigate, returnUrl]);

  // Animations
  useEffect(() => {
    if (containerRef.current && logoRef.current && formRef.current && bgRef.current) {
      const tl = gsap.timeline();
      
      // Background animation
      tl.fromTo(bgRef.current, 
        { opacity: 0, scale: 1.1 }, 
        { opacity: 1, scale: 1, duration: 1, ease: "power3.out" }
      );
      
      // Logo animation
      tl.fromTo(logoRef.current,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.7)" },
        "-=0.5"
      );
      
      // Form container animation
      tl.fromTo(formRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.5"
      );
      
      // Find all animatable elements inside the form
      const animatableElements = formRef.current.querySelectorAll('.animate-item');
      if (animatableElements.length) {
        staggerElements(Array.from(animatableElements), 0.1, 'fadeInUp');
      }
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background" ref={containerRef}>
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-4 py-24">
        <div 
          ref={bgRef} 
          className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black z-0"
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        </div>
        
        <div className="max-w-md w-full relative z-10 flex flex-col items-center">
          <img 
            ref={logoRef}
            src="/lovable-uploads/c2f979be-0f33-4679-b957-f06b239b7aab.png" 
            alt="The Chauffeur Co. Logo" 
            className="h-24 w-auto mb-8 drop-shadow-lg" 
          />
          
          <div ref={formRef} className="w-full">
            <LoginForm returnUrl={returnUrl} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;
