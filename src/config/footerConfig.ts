
/**
 * Footer Configuration
 * 
 * This file contains all configuration settings for the footer.
 * Modify this file to change the footer content and appearance.
 */

import { UI_STRINGS } from '@/constants/uiStrings';

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface SocialMedia {
  platform: string;
  icon: string; // SVG content or icon name
  href: string;
  ariaLabel: string;
}

export interface ContactInfo {
  address: string[];
  phone: string;
  email: string;
}

export interface FooterConfig {
  brandName: string;
  description: string;
  columns: FooterColumn[];
  socialMedia: SocialMedia[];
  contactInfo: ContactInfo;
  copyright: string;
}

const footerConfig: FooterConfig = {
  brandName: UI_STRINGS.COMPANY.NAME,
  description: UI_STRINGS.COMPANY.DESCRIPTION,
  columns: [
    {
      title: UI_STRINGS.FOOTER.QUICK_LINKS.TITLE,
      links: [
        { label: UI_STRINGS.NAVIGATION.HOME, href: '/' },
        { label: UI_STRINGS.NAVIGATION.FLEET, href: '/#fleet' },
        { label: UI_STRINGS.FOOTER.QUICK_LINKS.PRICING, href: '/#pricing' },
        { label: UI_STRINGS.FOOTER.QUICK_LINKS.BOOKING, href: '/booking' },
        { label: UI_STRINGS.FOOTER.QUICK_LINKS.ABOUT_US, href: '/about' }
      ]
    },
    {
      title: UI_STRINGS.FOOTER.SUPPORT.TITLE,
      links: [
        { label: UI_STRINGS.FOOTER.SUPPORT.FAQ, href: '/faq' },
        { label: UI_STRINGS.FOOTER.SUPPORT.CONTACT_US, href: '/contact' },
        { label: UI_STRINGS.FOOTER.SUPPORT.TERMS, href: '/terms' },
        { label: UI_STRINGS.FOOTER.SUPPORT.PRIVACY, href: '/privacy' },
        { label: UI_STRINGS.FOOTER.SUPPORT.REFUND, href: '/refund' }
      ]
    }
  ],
  socialMedia: [
    {
      platform: 'Twitter',
      icon: 'twitter',
      href: 'https://twitter.com',
      ariaLabel: 'Twitter'
    },
    {
      platform: 'Instagram',
      icon: 'instagram',
      href: 'https://instagram.com',
      ariaLabel: 'Instagram'
    },
    {
      platform: 'Facebook',
      icon: 'facebook',
      href: 'https://facebook.com',
      ariaLabel: 'Facebook'
    }
  ],
  contactInfo: {
    address: UI_STRINGS.COMPANY.ADDRESS,
    phone: UI_STRINGS.COMPANY.PHONE,
    email: UI_STRINGS.COMPANY.EMAIL
  },
  copyright: UI_STRINGS.FOOTER.COPYRIGHT
};

export default footerConfig;
