
import React, { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';
import { UI_STRINGS } from '@/constants/uiStrings';
import twilioConfig from '@/config/twilioConfig';
import whatsAppConfig from '@/config/whatsAppConfig';

const WhatsAppButton: React.FC = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Check if the button should be visible on this page
    const path = location.pathname;
    
    // Hide on home page and booking pages
    const shouldHide = 
      path === '/' || 
      path.includes('/booking') ||
      // Hide if WhatsApp service is disabled in Twilio config
      !twilioConfig.enabled || 
      !twilioConfig.services.whatsapp.enabled ||
      !whatsAppConfig.enabled;
    
    setIsVisible(!shouldHide);
  }, [location]);
  
  const handleWhatsAppClick = () => {
    // Get WhatsApp number from config, remove the 'whatsapp:+' prefix if present
    let phoneNumber = whatsAppConfig.sender.phone;
    phoneNumber = phoneNumber.replace(/\D/g, ''); // Remove all non-digit characters
    
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(UI_STRINGS.WHATSAPP.DEFAULT_MESSAGE)}`, '_blank');
  };

  return (
    <div 
      className={cn(
        "fixed bottom-6 right-6 z-50 transition-all duration-300 transform",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
      )}
    >
      <button
        onClick={handleWhatsAppClick}
        className="bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="h-7 w-7" />
      </button>
    </div>
  );
};

export default WhatsAppButton;
