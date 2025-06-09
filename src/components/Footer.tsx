'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Globe,
  Mail,
  Phone,
  MapPin,
  ExternalLink
} from 'lucide-react';

// Custom Social Media Icons
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12.017 0C8.396 0 7.989.013 7.041.048 6.094.082 5.52.204 5.02.43a5.105 5.105 0 00-1.852 1.207 5.105 5.105 0 00-1.207 1.852C1.734 4.02 1.612 4.594 1.578 5.541 1.544 6.489 1.53 6.896 1.53 10.517s.013 4.028.048 4.976c.034.947.156 1.521.382 2.021a5.105 5.105 0 001.207 1.852 5.105 5.105 0 001.852 1.207c.5.226 1.074.348 2.021.382.948.035 1.355.048 4.976.048s4.028-.013 4.976-.048c.947-.034 1.521-.156 2.021-.382a5.105 5.105 0 001.852-1.207 5.105 5.105 0 001.207-1.852c.226-.5.348-1.074.382-2.021.035-.948.048-1.355.048-4.976s-.013-4.028-.048-4.976c-.034-.947-.156-1.521-.382-2.021a5.105 5.105 0 00-1.207-1.852A5.105 5.105 0 0018.994.43c-.5-.226-1.074-.348-2.021-.382C16.025.013 15.618 0 12.017 0zM12.017 2.17c3.557 0 3.97.013 4.897.048.847.038 1.306.177 1.612.295.405.157.694.345.998.649.304.304.492.593.649.998.118.306.257.765.295 1.612.035.927.048 1.34.048 4.897s-.013 3.97-.048 4.897c-.038.847-.177 1.306-.295 1.612-.157.405-.345.694-.649.998-.304.304-.593.492-.998.649-.306.118-.765.257-1.612.295-.927.035-1.34.048-4.897.048s-3.97-.013-4.897-.048c-.847-.038-1.306-.177-1.612-.295a2.678 2.678 0 01-.998-.649 2.678 2.678 0 01-.649-.998c-.118-.306-.257-.765-.295-1.612-.035-.927-.048-1.34-.048-4.897s.013-3.97.048-4.897c.038-.847.177-1.306.295-1.612.157-.405.345-.694.649-.998.304-.304.593-.492.998-.649.306-.118.765-.257 1.612-.295.927-.035 1.34-.048 4.897-.048zM12.017 5.838a4.679 4.679 0 100 9.358 4.679 4.679 0 000-9.358zm0 7.718a3.04 3.04 0 110-6.078 3.04 3.04 0 010 6.078zM18.846 5.594a1.093 1.093 0 11-2.186 0 1.093 1.093 0 012.186 0z"/>
  </svg>
);

// TypeScript interfaces
interface FooterLink {
  name: string;
  href: string;
}

interface SocialLink {
  name: string;
  href: string;
  icon: string;
  color: string;
}

interface ContactInfo {
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

interface CompanyInfo {
  name: string;
  description: string;
  copyright: string;
  poweredBy?: string;
  hostedOn?: string;
}

interface FooterLinks {
  about: FooterLink[];
  categories: FooterLink[];
  quickLinks: FooterLink[];
  legal: FooterLink[];
}

// Default footer data as fallback
const defaultFooterLinks = {
  about: [
    { name: 'Tentang Kami', href: '/tentang-kami' },
    { name: 'Tim Redaksi', href: '/redaksi' },
    { name: 'Visi & Misi', href: '/visi-misi' },
    { name: 'Karir', href: '/karir' },
    { name: 'Kontak', href: '/kontak' }
  ],
  categories: [
    { name: 'Politik', href: '/?category=politik' },
    { name: 'Ekonomi', href: '/?category=ekonomi' },
    { name: 'Olahraga', href: '/?category=olahraga' },
    { name: 'Teknologi', href: '/?category=teknologi' }
  ],
  quickLinks: [
    { name: 'Berita Terbaru', href: '/' },
    { name: 'Berita Trending', href: '/?trending=true' },
    { name: 'Iklan', href: '/iklan' },
    { name: 'RSS Feed', href: '/rss' }
  ],
  legal: [
    { name: 'Kebijakan Privasi', href: '/kebijakan-privasi' },
    { name: 'Syarat & Ketentuan', href: '/syarat-ketentuan' },
    { name: 'Disclaimer', href: '/disclaimer' },
    { name: 'Sitemap', href: '/sitemap' }
  ]
};

// Default social links as fallback
const defaultSocialLinks = [
  {
    name: 'Facebook',
    href: 'https://facebook.com/pontigram',
    icon: 'Facebook',
    color: 'hover:text-blue-600'
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/pontigram',
    icon: 'Instagram',
    color: 'hover:text-pink-600'
  }
];

interface FooterData {
  footerLinks?: FooterLinks;
  socialLinks?: SocialLink[];
  contactInfo?: ContactInfo;
  companyInfo?: CompanyInfo;
}

export default function Footer() {
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetchFooterData();
  }, []);

  const fetchFooterData = async () => {
    try {
      const response = await fetch('/api/admin/footer');
      const data = await response.json();

      if (data.success) {
        setFooterData(data.footer);
      }
    } catch (error) {
      console.error('Error fetching footer data:', error);
    }
  };

  // Use dynamic data if available, otherwise use default
  const footerLinks = footerData?.footerLinks || defaultFooterLinks;
  const socialLinks = footerData?.socialLinks || defaultSocialLinks;
  const contactInfo = footerData?.contactInfo || {
    email: 'info@pontigram.com',
    phone: '+62 21-1234-5678',
    address: {
      street: 'Jl. Sudirman No. 123',
      city: 'Jakarta Pusat',
      postalCode: '10220',
      country: 'Indonesia'
    }
  };
  const companyInfo = footerData?.companyInfo || {
    name: 'Pontigram',
    description: 'Portal berita terpercaya yang menyajikan informasi terkini dan akurat dari berbagai kategori.',
    copyright: 'All rights reserved. Made with ❤️ in Indonesia'
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          
          {/* About Us Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="relative p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg mr-3">
                <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full"></div>
              </div>
              <span className="text-xl sm:text-2xl font-bold">{companyInfo.name}</span>
            </div>

            <p className="text-gray-300 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
              {companyInfo.description}
            </p>

            {/* Contact Info - Hidden on mobile, shown on larger screens */}
            <div className="hidden sm:block space-y-3">
              <div className="flex items-center text-gray-300 text-sm">
                <Mail className="h-4 w-4 mr-3 text-blue-500" />
                <a href={`mailto:${contactInfo.email}`} className="hover:text-white transition-colors">
                  {contactInfo.email}
                </a>
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <Phone className="h-4 w-4 mr-3 text-blue-500" />
                <a href={`tel:${contactInfo.phone}`} className="hover:text-white transition-colors">
                  {contactInfo.phone}
                </a>
              </div>
              <div className="flex items-start text-gray-300 text-sm">
                <MapPin className="h-4 w-4 mr-3 mt-1 text-blue-500 flex-shrink-0" />
                <span>
                  {contactInfo.address.street}<br />
                  {contactInfo.address.city} {contactInfo.address.postalCode}<br />
                  {contactInfo.address.country}
                </span>
              </div>
            </div>
          </div>

          {/* Categories Column */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Kategori Berita</h3>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.categories.map((link: FooterLink) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group text-sm sm:text-base"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* About links - only show on larger screens */}
            <div className="hidden lg:block">
              <h4 className="text-md font-semibold mt-6 sm:mt-8 mb-3 sm:mb-4">Lainnya</h4>
              <ul className="space-y-2 sm:space-y-3">
                {footerLinks.about.map((link: FooterLink) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group text-sm"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick Links Column - Hidden on mobile */}
          <div className="hidden lg:block">
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link: FooterLink) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group text-sm"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {link.name}
                    </span>
                    {link.href.startsWith('http') && (
                      <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="text-md font-semibold mt-8 mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link: FooterLink) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group text-sm"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 flex items-center">
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Ikuti Kami
              </span>
              <div className="ml-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            </h3>

            {/* Social Media Icons - Enhanced */}
            <div className="flex flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8">
              {socialLinks.map((social: SocialLink) => {
                // Map icon names to components
                const getIconComponent = (iconName: string) => {
                  switch (iconName) {
                    case 'Facebook': return FacebookIcon;
                    case 'Instagram': return InstagramIcon;
                    default: return ExternalLink;
                  }
                };
                const IconComponent = getIconComponent(social.icon);

                // Enhanced styling per platform - harmonized with site colors
                const getPlatformStyle = (iconName: string) => {
                  switch (iconName) {
                    case 'Facebook':
                      return 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-blue-500/50';
                    case 'Instagram':
                      return 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-purple-500/50';
                    default:
                      return 'bg-gray-600 hover:bg-gray-700';
                  }
                };

                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${getPlatformStyle(social.icon)} p-3 sm:p-4 rounded-xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 hover:shadow-lg group`}
                    aria-label={`Follow us on ${social.name}`}
                    title={`Follow us on ${social.name}`}
                  >
                    <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-white group-hover:scale-110 transition-transform duration-300" />
                  </a>
                );
              })}
            </div>

            {/* Follow CTA */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-lg mb-6">
              <p className="text-white text-sm font-medium mb-2">
                🔔 Jangan lewatkan update terbaru!
              </p>
              <p className="text-blue-100 text-xs">
                Follow media sosial kami untuk berita terkini dan konten eksklusif.
              </p>
            </div>

            {/* Newsletter Signup - Only on larger screens */}
            <div className="hidden sm:block bg-gray-800 p-4 sm:p-6 rounded-lg">
              <h4 className="text-sm sm:text-md font-semibold mb-3">Newsletter</h4>
              <p className="text-gray-300 text-xs sm:text-sm mb-4">
                Dapatkan ringkasan berita terbaru langsung di email Anda.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Email Anda"
                  className="flex-1 px-3 py-2 bg-gray-700 text-white placeholder-gray-400 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button className="bg-blue-600 hover:bg-blue-700 px-3 sm:px-4 py-2 rounded-r-md transition-colors duration-300">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </div>
            </div>

            {/* Contact info for mobile */}
            <div className="block sm:hidden mt-6 space-y-2">
              <div className="flex items-center text-gray-300 text-sm">
                <Mail className="h-4 w-4 mr-2 text-blue-500" />
                <a href={`mailto:${contactInfo.email}`} className="hover:text-white transition-colors">
                  {contactInfo.email}
                </a>
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <Phone className="h-4 w-4 mr-2 text-blue-500" />
                <a href={`tel:${contactInfo.phone}`} className="hover:text-white transition-colors">
                  {contactInfo.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              <p className="flex items-center">
                © {currentYear} {companyInfo.name}. {companyInfo.copyright}
              </p>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <Link href="/sitemap" className="hover:text-white transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
