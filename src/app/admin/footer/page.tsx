'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Save,
  Plus,
  Trash2,
  RotateCcw,
  Loader2,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Mail
} from 'lucide-react';

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
  poweredBy: string;
  hostedOn: string;
}

interface Newsletter {
  title: string;
  description: string;
  placeholder: string;
}

interface FooterData {
  footerLinks: {
    about: FooterLink[];
    categories: FooterLink[];
    quickLinks: FooterLink[];
    legal: FooterLink[];
  };
  socialLinks: SocialLink[];
  contactInfo: ContactInfo;
  companyInfo: CompanyInfo;
  newsletter: Newsletter;
}

export default function FooterManagement() {
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchFooterData();
  }, []);

  const fetchFooterData = async () => {
    try {
      const response = await fetch('/api/admin/footer');
      const data = await response.json();
      
      if (data.success) {
        setFooterData(data.footer);
      } else {
        setMessage({ type: 'error', text: 'Gagal memuat data footer' });
      }
    } catch (error) {
      console.error('Error fetching footer data:', error);
      setMessage({ type: 'error', text: 'Terjadi kesalahan saat memuat data' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!footerData) return;
    
    setSaving(true);
    setMessage(null);
    
    try {
      const response = await fetch('/api/admin/footer', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(footerData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Footer berhasil diperbarui!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Gagal memperbarui footer' });
      }
    } catch (error) {
      console.error('Error saving footer:', error);
      setMessage({ type: 'error', text: 'Terjadi kesalahan saat menyimpan' });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Apakah Anda yakin ingin mereset footer ke pengaturan default? Semua perubahan akan hilang.')) {
      return;
    }
    
    setSaving(true);
    setMessage(null);
    
    try {
      const response = await fetch('/api/admin/footer', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setFooterData(data.footer);
        setMessage({ type: 'success', text: 'Footer berhasil direset ke default!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Gagal mereset footer' });
      }
    } catch (error) {
      console.error('Error resetting footer:', error);
      setMessage({ type: 'error', text: 'Terjadi kesalahan saat mereset' });
    } finally {
      setSaving(false);
    }
  };

  const addLink = (section: keyof FooterData['footerLinks']) => {
    if (!footerData) return;
    
    setFooterData({
      ...footerData,
      footerLinks: {
        ...footerData.footerLinks,
        [section]: [
          ...footerData.footerLinks[section],
          { name: '', href: '' }
        ]
      }
    });
  };

  const removeLink = (section: keyof FooterData['footerLinks'], index: number) => {
    if (!footerData) return;
    
    setFooterData({
      ...footerData,
      footerLinks: {
        ...footerData.footerLinks,
        [section]: footerData.footerLinks[section].filter((_, i) => i !== index)
      }
    });
  };

  const updateLink = (section: keyof FooterData['footerLinks'], index: number, field: 'name' | 'href', value: string) => {
    if (!footerData) return;
    
    const updatedLinks = [...footerData.footerLinks[section]];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    
    setFooterData({
      ...footerData,
      footerLinks: {
        ...footerData.footerLinks,
        [section]: updatedLinks
      }
    });
  };

  const addSocialLink = () => {
    if (!footerData) return;
    
    setFooterData({
      ...footerData,
      socialLinks: [
        ...footerData.socialLinks,
        { name: '', href: '', icon: '', color: 'hover:text-blue-600' }
      ]
    });
  };

  const removeSocialLink = (index: number) => {
    if (!footerData) return;
    
    setFooterData({
      ...footerData,
      socialLinks: footerData.socialLinks.filter((_, i) => i !== index)
    });
  };

  const updateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
    if (!footerData) return;
    
    const updatedSocialLinks = [...footerData.socialLinks];
    updatedSocialLinks[index] = { ...updatedSocialLinks[index], [field]: value };
    
    setFooterData({
      ...footerData,
      socialLinks: updatedSocialLinks
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Memuat data footer...</p>
        </div>
      </div>
    );
  }

  if (!footerData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p>Gagal memuat data footer</p>
          <Button onClick={fetchFooterData} className="mt-4">
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kelola Footer</h1>
          <p className="text-gray-600 mt-2">Atur konten dan link di footer website</p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={handleReset}
            variant="outline"
            disabled={saving}
            className="flex items-center"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Default
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Simpan Perubahan
          </Button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg flex items-center ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5 mr-2" />
          ) : (
            <AlertCircle className="h-5 w-5 mr-2" />
          )}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Footer Links */}
        <Card>
          <CardHeader>
            <CardTitle>Link Footer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(footerData.footerLinks).map(([section, links]) => (
              <div key={section}>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold capitalize">{section}</h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addLink(section as keyof FooterData['footerLinks'])}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {links.map((link, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Nama link"
                        value={link.name}
                        onChange={(e) => updateLink(section as keyof FooterData['footerLinks'], index, 'name', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="URL"
                        value={link.href}
                        onChange={(e) => updateLink(section as keyof FooterData['footerLinks'], index, 'href', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeLink(section as keyof FooterData['footerLinks'], index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Media Sosial
              <Button size="sm" variant="outline" onClick={addSocialLink}>
                <Plus className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {footerData.socialLinks.map((social, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Nama platform"
                      value={social.name}
                      onChange={(e) => updateSocialLink(index, 'name', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Icon name"
                      value={social.icon}
                      onChange={(e) => updateSocialLink(index, 'icon', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input
                      type="url"
                      placeholder="URL"
                      value={social.href}
                      onChange={(e) => updateSocialLink(index, 'href', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="CSS hover color"
                      value={social.color}
                      onChange={(e) => updateSocialLink(index, 'color', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 flex items-center text-sm"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Test Link
                    </a>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeSocialLink(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              Informasi Kontak
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={footerData.contactInfo.email}
                onChange={(e) => setFooterData({
                  ...footerData,
                  contactInfo: { ...footerData.contactInfo, email: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Telepon</label>
              <input
                type="tel"
                value={footerData.contactInfo.phone}
                onChange={(e) => setFooterData({
                  ...footerData,
                  contactInfo: { ...footerData.contactInfo, phone: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Alamat</label>
              <input
                type="text"
                placeholder="Jalan"
                value={footerData.contactInfo.address.street}
                onChange={(e) => setFooterData({
                  ...footerData,
                  contactInfo: {
                    ...footerData.contactInfo,
                    address: { ...footerData.contactInfo.address, street: e.target.value }
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Kota"
                  value={footerData.contactInfo.address.city}
                  onChange={(e) => setFooterData({
                    ...footerData,
                    contactInfo: {
                      ...footerData.contactInfo,
                      address: { ...footerData.contactInfo.address, city: e.target.value }
                    }
                  })}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Kode Pos"
                  value={footerData.contactInfo.address.postalCode}
                  onChange={(e) => setFooterData({
                    ...footerData,
                    contactInfo: {
                      ...footerData.contactInfo,
                      address: { ...footerData.contactInfo.address, postalCode: e.target.value }
                    }
                  })}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <input
                type="text"
                placeholder="Negara"
                value={footerData.contactInfo.address.country}
                onChange={(e) => setFooterData({
                  ...footerData,
                  contactInfo: {
                    ...footerData.contactInfo,
                    address: { ...footerData.contactInfo.address, country: e.target.value }
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Company Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Perusahaan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Perusahaan</label>
              <input
                type="text"
                value={footerData.companyInfo.name}
                onChange={(e) => setFooterData({
                  ...footerData,
                  companyInfo: { ...footerData.companyInfo, name: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
              <textarea
                value={footerData.companyInfo.description}
                onChange={(e) => setFooterData({
                  ...footerData,
                  companyInfo: { ...footerData.companyInfo, description: e.target.value }
                })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Copyright Text</label>
              <input
                type="text"
                value={footerData.companyInfo.copyright}
                onChange={(e) => setFooterData({
                  ...footerData,
                  companyInfo: { ...footerData.companyInfo, copyright: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Powered By</label>
                <input
                  type="text"
                  value={footerData.companyInfo.poweredBy}
                  onChange={(e) => setFooterData({
                    ...footerData,
                    companyInfo: { ...footerData.companyInfo, poweredBy: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hosted On</label>
                <input
                  type="text"
                  value={footerData.companyInfo.hostedOn}
                  onChange={(e) => setFooterData({
                    ...footerData,
                    companyInfo: { ...footerData.companyInfo, hostedOn: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
