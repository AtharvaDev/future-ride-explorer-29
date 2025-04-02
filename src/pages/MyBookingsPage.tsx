
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookingHistory from '@/components/BookingHistory';
import { initializeAdminUser } from '@/services/authService';
import { toast } from 'sonner';
import { UI_STRINGS } from '@/constants/uiStrings';

const MyBookingsPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if not logged in
    if (!loading && !user) {
      toast.info("Please log in to view your bookings");
      navigate('/login', { state: { returnUrl: '/my-bookings' } });
    }
    
    // Initialize admin user for development
    initializeAdminUser();
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{UI_STRINGS.BOOKING_HISTORY.TITLE}</h1>
        {user ? (
          <BookingHistory />
        ) : (
          <div className="text-center py-12">
            <p>{UI_STRINGS.BOOKING_HISTORY.PLEASE_LOGIN}</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MyBookingsPage;
