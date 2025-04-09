
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Shield } from 'lucide-react';

const RefundPage = () => {
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
            <h1 className="text-3xl font-bold">Refund Policy</h1>
          </div>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>The Chauffeur Co. is committed to providing excellent service. Our refund policy is designed to be fair and transparent.</p>
            
            <h2>1. Cancellation Timeframes</h2>
            <p>Our refund policy is based on how far in advance you cancel your reservation:</p>
            <ul>
              <li><strong>More than 48 hours before pickup:</strong> Full refund with no cancellation fee</li>
              <li><strong>24-48 hours before pickup:</strong> 75% refund of the total booking amount</li>
              <li><strong>12-24 hours before pickup:</strong> 50% refund of the total booking amount</li>
              <li><strong>Less than 12 hours before pickup:</strong> No refund</li>
            </ul>
            
            <h2>2. No-Shows</h2>
            <p>If you fail to show up for your reservation without notice, no refund will be provided, and the full amount will be charged.</p>
            
            <h2>3. Early Returns</h2>
            <p>If you return the vehicle earlier than scheduled, a refund may be provided for the unused days minus a one-day early return fee, subject to our discretion.</p>
            
            <h2>4. Vehicle Dissatisfaction</h2>
            <p>If the vehicle does not meet the standards described on our website or has mechanical issues, please notify us immediately. We will work to provide a replacement vehicle or issue a refund if a suitable replacement is not available.</p>
            
            <h2>5. Refund Processing</h2>
            <p>Approved refunds will be processed to the original payment method within 5-10 business days, depending on your financial institution.</p>
            
            <h2>6. Prepaid Reservations</h2>
            <p>Special rates or prepaid reservations may have different cancellation and refund terms as specified at the time of booking.</p>
            
            <h2>7. Weather and Force Majeure</h2>
            <p>In the event of severe weather conditions or other unforeseeable circumstances beyond our control, we may issue a full credit for future use rather than a refund.</p>
            
            <h2>8. Insurance and Add-ons</h2>
            <p>Insurance and add-on products may be non-refundable once the rental period has begun.</p>
            
            <h2>9. Requesting a Refund</h2>
            <p>To request a refund, please contact our customer service team at refunds@thechauffeurco.com or call us at 1-800-123-4567.</p>
            
            <h2>10. Disputes</h2>
            <p>If you believe a refund has been incorrectly denied, please contact our customer service team with relevant documentation to support your claim.</p>
            
            <p className="mt-8 text-sm text-gray-500">Last updated: April 9, 2025</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RefundPage;
