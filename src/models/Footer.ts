import mongoose from 'mongoose';

export interface IFooterStatics extends mongoose.Model<IFooter> {
  getOrCreateDefault(): Promise<IFooter>;
}

export interface IFooter extends mongoose.Document {
  footerLinks: {
    about: Array<{ name: string; href: string }>;
    categories: Array<{ name: string; href: string }>;
    quickLinks: Array<{ name: string; href: string }>;
    legal: Array<{ name: string; href: string }>;
  };
  socialLinks: Array<{
    name: string;
    href: string;
    icon: string;
    color: string;
  }>;
  contactInfo: {
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      postalCode: string;
      country: string;
    };
  };
  companyInfo: {
    name: string;
    description: string;
    copyright: string;
    poweredBy: string;
    hostedOn: string;
  };
  newsletter: {
    title: string;
    description: string;
    placeholder: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const FooterSchema = new mongoose.Schema<IFooter>({
  footerLinks: {
    about: [{
      name: { type: String, required: true },
      href: { type: String, required: true }
    }],
    categories: [{
      name: { type: String, required: true },
      href: { type: String, required: true }
    }],
    quickLinks: [{
      name: { type: String, required: true },
      href: { type: String, required: true }
    }],
    legal: [{
      name: { type: String, required: true },
      href: { type: String, required: true }
    }]
  },
  socialLinks: [{
    name: { type: String, required: true },
    href: { type: String, required: true },
    icon: { type: String, required: true },
    color: { type: String, required: true }
  }],
  contactInfo: {
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true }
    }
  },
  companyInfo: {
    name: { type: String, required: true },
    description: { type: String, required: true },
    copyright: { type: String, required: true },
    poweredBy: { type: String, default: 'Next.js' },
    hostedOn: { type: String, default: 'Vercel' }
  },
  newsletter: {
    title: { type: String, default: 'Newsletter' },
    description: { type: String, default: 'Dapatkan ringkasan berita terbaru langsung di email Anda.' },
    placeholder: { type: String, default: 'Email Anda' }
  }
}, {
  timestamps: true
});

// Create default footer data if none exists
FooterSchema.statics.getOrCreateDefault = async function() {
  let footer = await this.findOne();
  
  if (!footer) {
    footer = await this.create({
      footerLinks: {
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
      },
      socialLinks: [
        { name: 'Facebook', href: 'https://facebook.com/pontigramid', icon: 'Facebook', color: 'hover:text-blue-600' },
        { name: 'Twitter', href: 'https://twitter.com/pontigramid', icon: 'Twitter', color: 'hover:text-blue-400' },
        { name: 'Instagram', href: 'https://instagram.com/pontigramid', icon: 'Instagram', color: 'hover:text-pink-600' },
        { name: 'YouTube', href: 'https://youtube.com/pontigramid', icon: 'Youtube', color: 'hover:text-red-600' }
      ],
      contactInfo: {
        email: 'info@pontigramid.com',
        phone: '+62 21-1234-5678',
        address: {
          street: 'Jl. Sudirman No. 123',
          city: 'Jakarta Pusat',
          postalCode: '10220',
          country: 'Indonesia'
        }
      },
      companyInfo: {
        name: 'PontigramID',
        description: 'Portal berita terpercaya yang menyajikan informasi terkini dan akurat dari berbagai kategori. Komitmen kami adalah memberikan berita berkualitas untuk masyarakat Indonesia.',
        copyright: 'All rights reserved. Made with ❤️ in Indonesia',
        poweredBy: 'Next.js',
        hostedOn: 'Vercel'
      },
      newsletter: {
        title: 'Newsletter',
        description: 'Dapatkan ringkasan berita terbaru langsung di email Anda.',
        placeholder: 'Email Anda'
      }
    });
  }
  
  return footer;
};

export default (mongoose.models.Footer as IFooterStatics) || mongoose.model<IFooter, IFooterStatics>('Footer', FooterSchema);
