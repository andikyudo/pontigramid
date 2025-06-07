import { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Users, Newspaper } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Kontak Kami - PontigramID',
  description: 'Hubungi tim PontigramID untuk pertanyaan, saran, tips berita, atau kerjasama. Kami siap melayani Anda 24/7.',
  keywords: 'kontak pontigramid, hubungi kami, alamat redaksi, email, telepon, tips berita',
  openGraph: {
    title: 'Kontak Kami - PontigramID',
    description: 'Hubungi tim PontigramID untuk pertanyaan, saran, tips berita, atau kerjasama. Kami siap melayani Anda 24/7.',
    type: 'website',
  },
};

const contactInfo = [
  {
    icon: Mail,
    title: 'Email',
    details: [
      { label: 'Redaksi', value: 'redaksi@pontigramid.com' },
      { label: 'Umum', value: 'info@pontigramid.com' },
      { label: 'Iklan', value: 'iklan@pontigramid.com' }
    ]
  },
  {
    icon: Phone,
    title: 'Telepon',
    details: [
      { label: 'Redaksi', value: '+62 21-1234-5678' },
      { label: 'Iklan', value: '+62 21-1234-5679' },
      { label: 'WhatsApp', value: '+62 812-3456-7890' }
    ]
  },
  {
    icon: MapPin,
    title: 'Alamat',
    details: [
      { label: 'Kantor Pusat', value: 'Jl. Sudirman No. 123, Jakarta Pusat 10220, Indonesia' },
      { label: 'Kode Pos', value: '10220' }
    ]
  },
  {
    icon: Clock,
    title: 'Jam Operasional',
    details: [
      { label: 'Senin - Jumat', value: '08:00 - 17:00 WIB' },
      { label: 'Sabtu', value: '08:00 - 12:00 WIB' },
      { label: 'Minggu', value: 'Tutup' },
      { label: 'Redaksi 24/7', value: 'Selalu siaga untuk berita breaking' }
    ]
  }
];

const departments = [
  {
    icon: Newspaper,
    title: 'Tim Redaksi',
    description: 'Untuk tips berita, press release, atau informasi yang ingin diliput',
    email: 'redaksi@pontigramid.com',
    phone: '+62 21-1234-5678'
  },
  {
    icon: Users,
    title: 'Customer Service',
    description: 'Untuk pertanyaan umum, saran, atau keluhan mengenai layanan',
    email: 'cs@pontigramid.com',
    phone: '+62 21-1234-5680'
  },
  {
    icon: MessageSquare,
    title: 'Kerjasama & Partnership',
    description: 'Untuk proposal kerjasama, sponsorship, atau kemitraan strategis',
    email: 'partnership@pontigramid.com',
    phone: '+62 21-1234-5681'
  }
];

export default function Kontak() {
  return (
    <PageLayout
      title="Kontak Kami"
      description="Hubungi tim PontigramID untuk pertanyaan, saran, tips berita, atau kerjasama. Kami siap melayani Anda dengan profesional."
      breadcrumbs={[
        { label: 'Kontak Kami' }
      ]}
    >
      <div className="space-y-12">
        {/* Introduction */}
        <div className="text-center">
          <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
            Tim PontigramID siap melayani Anda. Jangan ragu untuk menghubungi kami untuk 
            pertanyaan, saran, tips berita, atau peluang kerjasama.
          </p>
        </div>

        {/* Contact Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {contactInfo.map((contact, index) => {
            const IconComponent = contact.icon;
            return (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <IconComponent className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{contact.title}</h3>
                </div>
                <div className="space-y-3">
                  {contact.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="flex justify-between items-start">
                      <span className="text-gray-600 text-sm font-medium">{detail.label}:</span>
                      <span className="text-gray-900 text-sm text-right flex-1 ml-2">{detail.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Departments */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Departemen Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {departments.map((dept, index) => {
              const IconComponent = dept.icon;
              return (
                <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{dept.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{dept.description}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <a href={`mailto:${dept.email}`} className="text-blue-600 hover:text-blue-700">
                        {dept.email}
                      </a>
                    </div>
                    <div className="flex items-center justify-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <a href={`tel:${dept.phone}`} className="text-blue-600 hover:text-blue-700">
                        {dept.phone}
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Kirim Pesan</h2>
            <p className="text-gray-600">
              Isi formulir di bawah ini dan kami akan merespons dalam 24 jam
            </p>
          </div>
          
          <form className="max-w-2xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan nama lengkap Anda"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="nama@email.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+62 812-3456-7890"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subjek *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Pilih subjek</option>
                  <option value="tips-berita">Tips Berita</option>
                  <option value="pertanyaan-umum">Pertanyaan Umum</option>
                  <option value="kerjasama">Kerjasama</option>
                  <option value="iklan">Iklan</option>
                  <option value="keluhan">Keluhan</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Pesan *
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Tulis pesan Anda di sini..."
              ></textarea>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Send className="h-5 w-5 mr-2" />
                Kirim Pesan
              </button>
            </div>
          </form>
        </div>

        {/* Quick Tips */}
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tips untuk Menghubungi Kami</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Untuk Tips Berita:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Sertakan lokasi dan waktu kejadian</li>
                <li>• Lampirkan foto/video jika ada</li>
                <li>• Berikan kontak yang bisa dihubungi</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Untuk Pertanyaan Umum:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Jelaskan pertanyaan dengan detail</li>
                <li>• Sertakan screenshot jika perlu</li>
                <li>• Cantumkan informasi kontak</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
