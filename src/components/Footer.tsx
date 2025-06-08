'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Globe,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ExternalLink
} from 'lucide-react';

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
    href: 'https://facebook.com/pontigramid',
    icon: 'Facebook',
    color: 'hover:text-blue-600'
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/pontigramid',
    icon: 'Twitter',
    color: 'hover:text-blue-400'
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/pontigramid',
    icon: 'Instagram',
    color: 'hover:text-pink-600'
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com/pontigramid',
    icon: 'Youtube',
    color: 'hover:text-red-600'
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
    email: 'info@pontigramid.com',
    phone: '+62 21-1234-5678',
    address: {
      street: 'Jl. Sudirman No. 123',
      city: 'Jakarta Pusat',
      postalCode: '10220',
      country: 'Indonesia'
    }
  };
  const companyInfo = footerData?.companyInfo || {
    name: 'PontigramID',
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
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Ikuti Kami</h3>

            {/* Social Media Icons */}
            <div className="flex space-x-3 sm:space-x-4 mb-6 sm:mb-8">
              {socialLinks.map((social: SocialLink) => {
                // Map icon names to components
                const getIconComponent = (iconName: string) => {
                  switch (iconName) {
                    case 'Facebook': return Facebook;
                    case 'Twitter': return Twitter;
                    case 'Instagram': return Instagram;
                    case 'Youtube': return Youtube;
                    default: return ExternalLink;
                  }
                };
                const IconComponent = getIconComponent(social.icon);

                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`bg-gray-800 p-2 sm:p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${social.color} hover:bg-gray-700`}
                    aria-label={`Follow us on ${social.name}`}
                  >
                    <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
                  </a>
                );
              })}
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
