
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Shield } from 'lucide-react';

const PrivacyPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 mt-8 flex items-center">
            <Shield className="h-8 w-8 mr-3 text-primary" />
            <h1 className="text-3xl font-bold">Privacy Policy</h1>
          </div>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>At The Chauffeur Co., we take your privacy seriously. This Privacy Policy outlines how we collect, use, and protect your personal information.</p>
            
            <h2>1. Information We Collect</h2>
            <p>We collect information when you make a reservation, register for an account, or use our services. This may include:</p>
            <ul>
              <li>Personal information such as name, address, phone number, and email</li>
              <li>Payment information such as credit card details</li>
              <li>Driver's license information and other verification documents</li>
              <li>Vehicle preferences and rental history</li>
              <li>Location data when using our mobile application</li>
            </ul>
            
            <h2>2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Process and manage your bookings</li>
              <li>Contact you about your rental</li>
              <li>Improve our services and customer experience</li>
              <li>Process payments and prevent fraud</li>
              <li>Send promotional communications, if you have opted in</li>
              <li>Comply with legal obligations</li>
            </ul>
            
            <h2>3. Information Sharing</h2>
            <p>We do not sell your personal information to third parties. We may share information with:</p>
            <ul>
              <li>Service providers who assist in our operations</li>
              <li>Payment processors to complete transactions</li>
              <li>Law enforcement agencies when required by law</li>
              <li>Business partners with your explicit consent</li>
            </ul>
            
            <h2>4. Data Security</h2>
            <p>We implement appropriate security measures to protect your personal information. These measures include encryption, secure servers, and regular security assessments.</p>
            
            <h2>5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access the personal information we hold about you</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt out of marketing communications</li>
              <li>Lodge a complaint with a supervisory authority</li>
            </ul>
            
            <h2>6. Cookies and Tracking</h2>
            <p>Our website uses cookies to enhance your browsing experience. You can adjust your browser settings to disable cookies if you prefer.</p>
            
            <h2>7. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. The most current version will be posted on our website with the effective date.</p>
            
            <h2>8. Contact Us</h2>
            <p>If you have questions about this Privacy Policy or your personal information, please contact our Privacy Officer at privacy@thechauffeurco.com.</p>
            
            <p className="mt-8 text-sm text-gray-500">Last updated: April 9, 2025</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPage;
