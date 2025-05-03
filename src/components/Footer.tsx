
import React from 'react';
import footerConfig from '@/config/footerConfig';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const copyrightText = footerConfig.copyright.replace('{{year}}', currentYear.toString());

  // Social media icon mapping
  const getSocialIcon = (iconName: string) => {
    switch(iconName) {
      case 'instagram':
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.045-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
          </svg>
        );
    
      default:
        return null;
    }
  };

  return (
    <footer className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div>
            <div className="mb-4">
              <img 
                src="/lovable-uploads/1fb1ee26-e11e-43d3-897d-2054f89c95d8.png" 
                alt="The Chauffeur Co. Logo" 
                className="h-16 w-auto mb-3"
              />
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {footerConfig.description}
            </p>
            <div className="flex space-x-4">
              {footerConfig.socialMedia.map((social, index) => (
                <a 
                  key={index} 
                  href={social.href} 
                  className="text-gray-500 hover:text-primary transition-colors" 
                  aria-label={social.ariaLabel}
                >
                  <span className="sr-only">{social.platform}</span>
                  {getSocialIcon(social.icon)}
                </a>
              ))}
            </div>
          </div>
          
          {/* Footer Columns from Config */}
          {footerConfig.columns.map((column, columnIndex) => (
            <div key={columnIndex}>
              <h3 className="text-lg font-semibold mb-4">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href={link.href} 
                      className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <address className="not-italic text-gray-600 dark:text-gray-300 space-y-2">
              {footerConfig.contactInfo.address.map((line, index) => (
                <p key={index}>{line}</p>
              ))}
              <p className="mt-4">
                <a href={`tel:${footerConfig.contactInfo.phone}`} className="hover:text-primary transition-colors">
                  {footerConfig.contactInfo.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${footerConfig.contactInfo.email}`} className="hover:text-primary transition-colors">
                  {footerConfig.contactInfo.email}
                </a>
              </p>
            </address>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            {copyrightText}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
