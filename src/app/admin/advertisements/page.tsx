'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Filter,
  BarChart3,
  ExternalLink
} from 'lucide-react';

interface Advertisement {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  placementZone: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  clickCount: number;
  impressionCount: number;
  priority: number;
  createdAt: string;
}

export default function AdvertisementsPage() {
  const router = useRouter();
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterZone, setFilterZone] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const fetchAdvertisements = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterZone) params.append('placementZone', filterZone);
      if (filterStatus) params.append('isActive', filterStatus);

      const response = await fetch(`/api/admin/advertisements?${params}`);
      const data = await response.json();

      if (data.success) {
        setAdvertisements(data.data);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching advertisements:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterZone, filterStatus]);

  useEffect(() => {
    fetchAdvertisements();
  }, [fetchAdvertisements]);



  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus iklan ini?')) return;

    try {
      const response = await fetch(`/api/admin/advertisements/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAdvertisements(advertisements.filter(ad => ad._id !== id));
      }
    } catch (error) {
      console.error('Error deleting advertisement:', error);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch('/api/admin/advertisements', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'bulk-status',
          data: { adIds: [id], isActive: !currentStatus }
        }),
      });

      if (response.ok) {
        setAdvertisements(advertisements.map(ad => 
          ad._id === id ? { ...ad, isActive: !currentStatus } : ad
        ));
      }
    } catch (error) {
      console.error('Error updating advertisement status:', error);
    }
  };

  const getZoneBadgeColor = (zone: string) => {
    const colors: { [key: string]: string } = {
      header: 'bg-blue-100 text-blue-800',
      sidebar: 'bg-green-100 text-green-800',
      content: 'bg-purple-100 text-purple-800',
      footer: 'bg-orange-100 text-orange-800',
      'mobile-inline': 'bg-pink-100 text-pink-800'
    };
    return colors[zone] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manajemen Iklan</h1>
            <p className="text-gray-600">Kelola iklan dan banner website</p>
          </div>
          <Button 
            onClick={() => router.push('/admin/advertisements/create')}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Tambah Iklan
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cari iklan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={filterZone}
              onChange={(e) => setFilterZone(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Zona</option>
              <option value="header">Header</option>
              <option value="sidebar">Sidebar</option>
              <option value="content">Content</option>
              <option value="footer">Footer</option>
              <option value="mobile-inline">Mobile Inline</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Status</option>
              <option value="true">Aktif</option>
              <option value="false">Tidak Aktif</option>
            </select>

            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Iklan</p>
                <p className="text-2xl font-bold text-gray-900">{advertisements.length}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Iklan Aktif</p>
                <p className="text-2xl font-bold text-green-600">
                  {advertisements.filter(ad => ad.isActive).length}
                </p>
              </div>
              <Eye className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Klik</p>
                <p className="text-2xl font-bold text-purple-600">
                  {advertisements.reduce((sum, ad) => sum + ad.clickCount, 0)}
                </p>
              </div>
              <ExternalLink className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Impressi</p>
                <p className="text-2xl font-bold text-orange-600">
                  {advertisements.reduce((sum, ad) => sum + ad.impressionCount, 0)}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Advertisements List */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Iklan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Zona
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statistik
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {advertisements.map((ad) => (
                  <tr key={ad._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img
                            className="h-12 w-12 rounded-lg object-cover"
                            src={ad.imageUrl}
                            alt={ad.title}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 line-clamp-1">
                            {ad.title}
                          </div>
                          {ad.description && (
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {ad.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getZoneBadgeColor(ad.placementZone)}>
                        {ad.placementZone}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={ad.isActive ? "default" : "secondary"}>
                        {ad.isActive ? 'Aktif' : 'Tidak Aktif'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>Klik: {ad.clickCount}</div>
                      <div>Impressi: {ad.impressionCount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(ad.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleStatus(ad._id, ad.isActive)}
                        >
                          {ad.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/admin/advertisements/edit/${ad._id}`)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(ad._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {advertisements.length === 0 && (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Iklan</h3>
              <p className="text-gray-500 mb-4">Mulai dengan membuat iklan pertama Anda</p>
              <Button onClick={() => router.push('/admin/advertisements/create')}>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Iklan
              </Button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
