
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Shield } from 'lucide-react';

const TermsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex items-center">
            <Shield className="h-8 w-8 mr-3 text-primary" />
            <h1 className="text-3xl font-bold">Terms & Conditions</h1>
          </div>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2>1. Rental Agreement</h2>
            <p>These Terms and Conditions constitute a contract between you and The Chauffeur Co. ("we", "us", "our"). When you book our service, you accept these terms.</p>
            
            <h2>2. Reservation and Payment</h2>
            <p>A valid credit card and government-issued ID are required to confirm a reservation. Full payment is required at the time of booking.</p>
            
            <h2>3. Age Requirements</h2>
            <p>The primary renter must be at least 25 years of age to rent most vehicles. Drivers between 21-24 may be eligible with an additional young driver fee.</p>
            
            <h2>4. Insurance</h2>
            <p>Basic liability insurance is included with all rentals. Additional coverage options are available for purchase.</p>
            
            <h2>5. Vehicle Use Restrictions</h2>
            <p>Vehicles may only be driven on paved roads and highways. Off-road driving is strictly prohibited. Vehicles may not be taken outside the country without prior written consent.</p>
            
            <h2>6. Vehicle Return</h2>
            <p>Vehicles must be returned on the date specified in the reservation, with a full tank of fuel, and in the same condition as at pickup. Late returns are subject to additional daily charges.</p>
            
            <h2>7. Cancellations</h2>
            <p>Free cancellation is available up to 48 hours before the scheduled pickup time. Cancellations made within 48 hours may be subject to a fee equivalent to one day's rental.</p>
            
            <h2>8. Prohibited Activities</h2>
            <p>Smoking is not permitted in any vehicle. Using the vehicle for commercial purposes, illegal activities, or racing is prohibited.</p>
            
            <h2>9. Damage and Loss</h2>
            <p>The renter is responsible for any damage to the vehicle during the rental period, regardless of fault. Damage should be reported immediately.</p>
            
            <h2>10. Modifications</h2>
            <p>We reserve the right to modify these terms and conditions at any time. Updated terms will be posted on our website.</p>
            
            <h2>11. Governing Law</h2>
            <p>This agreement is governed by the laws of the jurisdiction in which the rental originates, without regard to its conflict of law principles.</p>
            
            <p className="mt-8 text-sm text-gray-500">Last updated: April 9, 2025</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsPage;
