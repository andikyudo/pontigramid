'use client';

import { useState, useEffect } from 'react';
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
  Calendar,
  MapPin,
  Users,
  Star,
  Clock,
  Settings,
  Zap
} from 'lucide-react';
import EventRunningTextSettings from '@/components/admin/EventRunningTextSettings';

interface Event {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  date: string;
  time: string;
  location: string;
  category: string;
  organizer: string;
  slug: string;
  isActive: boolean;
  isFeatured: boolean;
  maxParticipants?: number;
  currentParticipants: number;
  registrationRequired: boolean;
  price?: {
    amount: number;
    currency: string;
    isFree: boolean;
  };
  createdAt: string;
}

export default function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [activeTab, setActiveTab] = useState('events');

  useEffect(() => {
    fetchEvents();
  }, [searchTerm, filterCategory, filterStatus]);

  const fetchEvents = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterCategory) params.append('category', filterCategory);
      if (filterStatus) params.append('isActive', filterStatus);

      const response = await fetch(`/api/admin/events?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setEvents(data.data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus event ini?')) return;

    try {
      const response = await fetch(`/api/admin/events/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEvents(events.filter(event => event._id !== id));
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch('/api/admin/events', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'bulk-status',
          data: { eventIds: [id], isActive: !currentStatus }
        }),
      });

      if (response.ok) {
        setEvents(events.map(event => 
          event._id === id ? { ...event, isActive: !currentStatus } : event
        ));
      }
    } catch (error) {
      console.error('Error updating event status:', error);
    }
  };

  const toggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const response = await fetch('/api/admin/events', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'bulk-featured',
          data: { eventIds: [id], isFeatured: !currentFeatured }
        }),
      });

      if (response.ok) {
        setEvents(events.map(event => 
          event._id === id ? { ...event, isFeatured: !currentFeatured } : event
        ));
      }
    } catch (error) {
      console.error('Error updating event featured status:', error);
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    const colors: { [key: string]: string } = {
      konferensi: 'bg-blue-100 text-blue-800',
      seminar: 'bg-green-100 text-green-800',
      workshop: 'bg-purple-100 text-purple-800',
      pameran: 'bg-orange-100 text-orange-800',
      festival: 'bg-pink-100 text-pink-800',
      olahraga: 'bg-red-100 text-red-800',
      budaya: 'bg-yellow-100 text-yellow-800',
      pendidikan: 'bg-indigo-100 text-indigo-800',
      teknologi: 'bg-cyan-100 text-cyan-800',
      bisnis: 'bg-emerald-100 text-emerald-800',
      kesehatan: 'bg-teal-100 text-teal-800',
      lainnya: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.lainnya;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) > new Date();
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
            <h1 className="text-2xl font-bold text-gray-900">Manajemen Event</h1>
            <p className="text-gray-600">Kelola event dan acara website</p>
          </div>
          <Button
            onClick={() => router.push('/admin/events/create')}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Tambah Event
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('events')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'events'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Daftar Event
            </button>
            <button
              onClick={() => setActiveTab('running-text')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'running-text'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Zap className="w-4 h-4 inline mr-2" />
              Running Text
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'events' ? (
          <>
            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cari event..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Kategori</option>
              <option value="konferensi">Konferensi</option>
              <option value="seminar">Seminar</option>
              <option value="workshop">Workshop</option>
              <option value="pameran">Pameran</option>
              <option value="festival">Festival</option>
              <option value="olahraga">Olahraga</option>
              <option value="budaya">Budaya</option>
              <option value="pendidikan">Pendidikan</option>
              <option value="teknologi">Teknologi</option>
              <option value="bisnis">Bisnis</option>
              <option value="kesehatan">Kesehatan</option>
              <option value="lainnya">Lainnya</option>
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
                <p className="text-sm text-gray-600">Total Event</p>
                <p className="text-2xl font-bold text-gray-900">{events.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Event Aktif</p>
                <p className="text-2xl font-bold text-green-600">
                  {events.filter(event => event.isActive).length}
                </p>
              </div>
              <Eye className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Event Unggulan</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {events.filter(event => event.isFeatured).length}
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Event Mendatang</p>
                <p className="text-2xl font-bold text-purple-600">
                  {events.filter(event => isUpcoming(event.date)).length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal & Waktu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Peserta
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map((event) => (
                  <tr key={event._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          {event.imageUrl ? (
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={event.imageUrl}
                              alt={event.title}
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                              <Calendar className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 line-clamp-1">
                            {event.title}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {event.organizer}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getCategoryBadgeColor(event.category)}>
                        {event.category}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {formatDate(event.date)}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {event.time} WIB
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <Badge variant={event.isActive ? "default" : "secondary"}>
                          {event.isActive ? 'Aktif' : 'Tidak Aktif'}
                        </Badge>
                        {event.isFeatured && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            Unggulan
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        {event.currentParticipants}
                        {event.maxParticipants && `/${event.maxParticipants}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleFeatured(event._id, event.isFeatured)}
                          className={event.isFeatured ? 'text-yellow-600' : ''}
                        >
                          <Star className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleStatus(event._id, event.isActive)}
                        >
                          {event.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/admin/events/edit/${event._id}`)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(event._id)}
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
          
          {events.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Event</h3>
              <p className="text-gray-500 mb-4">Mulai dengan membuat event pertama Anda</p>
              <Button onClick={() => router.push('/admin/events/create')}>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Event
              </Button>
            </div>
          )}
        </div>
          </>
        ) : (
          /* Running Text Settings Tab */
          <EventRunningTextSettings />
        )}
      </div>
    </AdminLayout>
  );
}
