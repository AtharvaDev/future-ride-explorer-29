
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookingHistory from '@/components/BookingHistory';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const MyBookingsPage: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
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
      <main className="flex-grow container mx-auto px-4 py-8 mt-24">
        <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
        <BookingHistory />
      </main>
      <Footer />
    </div>
  );
};

export default MyBookingsPage;
