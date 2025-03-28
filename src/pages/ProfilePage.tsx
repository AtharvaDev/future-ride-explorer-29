
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookingHistory from '@/components/BookingHistory';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const ProfilePage: React.FC = () => {
  const { user, loading, updateUserPhone } = useAuth();
  const [phone, setPhone] = useState(user?.phone || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();
  
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
  
  if (!user) {
    navigate('/login');
    return null;
  }
  
  const handlePhoneUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone.trim()) {
      toast.error('Please enter a valid phone number');
      return;
    }
    
    setIsUpdating(true);
    try {
      await updateUserPhone(phone);
    } catch (error) {
      console.error('Error updating phone:', error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p>{user.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Role</Label>
                  <p className="capitalize">{user.role}</p>
                </div>
                <form onSubmit={handlePhoneUpdate} className="space-y-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? 'Updating...' : 'Update Phone'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <BookingHistory />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
