import { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import { Target, Users, BarChart3, Globe, Mail, Phone, Download } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Iklan & Kerjasama - PontigramID',
  description: 'Jangkau audiens yang tepat dengan beriklan di PontigramID. Berbagai paket iklan dan kerjasama untuk kebutuhan promosi Anda.',
  keywords: 'iklan pontigramid, advertising, promosi, banner, sponsored content, kerjasama',
  openGraph: {
    title: 'Iklan & Kerjasama - PontigramID',
    description: 'Jangkau audiens yang tepat dengan beriklan di PontigramID. Berbagai paket iklan dan kerjasama untuk kebutuhan promosi Anda.',
    type: 'website',
  },
};

const audienceStats = [
  { icon: Users, label: 'Pembaca Bulanan', value: '2.5 Juta+' },
  { icon: Globe, label: 'Jangkauan Nasional', value: '34 Provinsi' },
  { icon: BarChart3, label: 'Engagement Rate', value: '8.5%' },
  { icon: Target, label: 'Target Demografis', value: '18-55 Tahun' }
];

const adPackages = [
  {
    title: 'Banner Display',
    description: 'Iklan banner di berbagai posisi strategis website',
    features: ['Header Banner', 'Sidebar Banner', 'Article Banner', 'Footer Banner'],
    price: 'Mulai dari Rp 5.000.000/bulan'
  },
  {
    title: 'Sponsored Content',
    description: 'Artikel promosi yang terintegrasi dengan konten editorial',
    features: ['Native Advertising', 'SEO Optimized', 'Social Media Share', 'Analytics Report'],
    price: 'Mulai dari Rp 10.000.000/artikel'
  },
  {
    title: 'Newsletter Sponsorship',
    description: 'Promosi melalui newsletter dengan 500K+ subscriber',
    features: ['Email Blast', 'Targeted Audience', 'Click Tracking', 'Performance Report'],
    price: 'Mulai dari Rp 15.000.000/campaign'
  }
];

export default function Iklan() {
  return (
    <PageLayout
      title="Iklan & Kerjasama"
      description="Jangkau jutaan pembaca PontigramID dengan berbagai solusi iklan dan kerjasama yang efektif untuk bisnis Anda."
      breadcrumbs={[
        { label: 'Iklan & Kerjasama' }
      ]}
    >
      <div className="space-y-12">
        {/* Introduction */}
        <div className="text-center">
          <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto mb-8">
            Bergabunglah dengan ratusan brand terpercaya yang telah mempercayakan promosi mereka 
            kepada PontigramID. Jangkau audiens yang tepat dengan solusi iklan yang efektif.
          </p>
        </div>

        {/* Audience Statistics */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Jangkauan Audiens</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {audienceStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ad Packages */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Paket Iklan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {adPackages.map((pkg, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{pkg.title}</h3>
                <p className="text-gray-600 mb-4">{pkg.description}</p>
                <ul className="space-y-2 mb-6">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="text-lg font-semibold text-blue-600">{pkg.price}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Mengapa Pilih PontigramID?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Kredibilitas Tinggi</h3>
              <p className="text-gray-600 text-sm">
                Portal berita terpercaya dengan reputasi yang solid di mata pembaca Indonesia.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Audiens Berkualitas</h3>
              <p className="text-gray-600 text-sm">
                Pembaca yang aktif dan engaged dengan daya beli yang baik.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Targeting Presisi</h3>
              <p className="text-gray-600 text-sm">
                Kemampuan targeting berdasarkan demografi, lokasi, dan minat pembaca.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Laporan Transparan</h3>
              <p className="text-gray-600 text-sm">
                Analytics dan reporting yang detail untuk mengukur efektivitas kampanye.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-blue-600 text-white p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Siap Memulai Kampanye Anda?</h2>
          <p className="text-lg mb-6 opacity-90">
            Tim advertising kami siap membantu merancang strategi promosi yang tepat untuk bisnis Anda.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8">
            <a 
              href="mailto:iklan@pontigramid.com" 
              className="flex items-center bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              <Mail className="h-5 w-5 mr-2" />
              iklan@pontigramid.com
            </a>
            <a 
              href="tel:+622112345679" 
              className="flex items-center bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              <Phone className="h-5 w-5 mr-2" />
              +62 21-1234-5679
            </a>
          </div>
        </div>

        {/* Media Kit */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Media Kit</h2>
          <p className="text-gray-600 mb-6">
            Unduh media kit lengkap untuk informasi detail tentang audiens, rate card, dan spesifikasi teknis.
          </p>
          <button className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors">
            <Download className="h-5 w-5 mr-2" />
            Download Media Kit (PDF)
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
