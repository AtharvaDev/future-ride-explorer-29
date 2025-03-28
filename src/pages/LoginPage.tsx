
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoginForm from '@/components/LoginForm';
import { useAuth } from '@/contexts/AuthContext';

const LoginPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const returnUrl = (location.state as { returnUrl?: string })?.returnUrl || '/';
  
  useEffect(() => {
    // If user is already logged in, redirect to the return URL or home
    if (user && !loading) {
      navigate(returnUrl);
    }
  }, [user, loading, navigate, returnUrl]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 blur-xl rounded-xl"></div>
          <div className="relative z-10">
            <LoginForm returnUrl={returnUrl} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;
