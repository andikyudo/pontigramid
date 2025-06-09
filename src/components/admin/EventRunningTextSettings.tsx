'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown, 
  Save,
  RefreshCw,
  Zap,
  Calendar
} from 'lucide-react';

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
  isFeatured: boolean;
  isActive: boolean;
  runningTextEnabled?: boolean;
  runningTextPriority?: number;
}

interface RunningTextSettings {
  enabled: boolean;
  speed: number;
  pauseOnHover: boolean;
  selectedEvents: string[];
}

export default function EventRunningTextSettings() {
  const [events, setEvents] = useState<Event[]>([]);
  const [settings, setSettings] = useState<RunningTextSettings>({
    enabled: true,
    speed: 60,
    pauseOnHover: true,
    selectedEvents: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchEvents();
    loadSettings();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/admin/events?isActive=true');
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

  const loadSettings = () => {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('eventRunningTextSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      // Save to localStorage (in a real app, this would be an API call)
      localStorage.setItem('eventRunningTextSettings', JSON.stringify(settings));
      
      // Update events with running text settings
      for (const eventId of settings.selectedEvents) {
        await fetch(`/api/admin/events/${eventId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            runningTextEnabled: true,
            runningTextPriority: settings.selectedEvents.indexOf(eventId) + 1
          }),
        });
      }
      
      alert('Pengaturan berhasil disimpan!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Gagal menyimpan pengaturan');
    } finally {
      setSaving(false);
    }
  };

  const toggleEventSelection = (eventId: string) => {
    setSettings(prev => ({
      ...prev,
      selectedEvents: prev.selectedEvents.includes(eventId)
        ? prev.selectedEvents.filter(id => id !== eventId)
        : [...prev.selectedEvents, eventId]
    }));
  };

  const moveEventUp = (eventId: string) => {
    setSettings(prev => {
      const currentIndex = prev.selectedEvents.indexOf(eventId);
      if (currentIndex > 0) {
        const newSelectedEvents = [...prev.selectedEvents];
        [newSelectedEvents[currentIndex], newSelectedEvents[currentIndex - 1]] = 
        [newSelectedEvents[currentIndex - 1], newSelectedEvents[currentIndex]];
        return { ...prev, selectedEvents: newSelectedEvents };
      }
      return prev;
    });
  };

  const moveEventDown = (eventId: string) => {
    setSettings(prev => {
      const currentIndex = prev.selectedEvents.indexOf(eventId);
      if (currentIndex < prev.selectedEvents.length - 1) {
        const newSelectedEvents = [...prev.selectedEvents];
        [newSelectedEvents[currentIndex], newSelectedEvents[currentIndex + 1]] = 
        [newSelectedEvents[currentIndex + 1], newSelectedEvents[currentIndex]];
        return { ...prev, selectedEvents: newSelectedEvents };
      }
      return prev;
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Pengaturan Event Running Text</h2>
            <p className="text-gray-600">Kelola tampilan event berjalan di homepage</p>
          </div>
        </div>
        <Button 
          onClick={saveSettings} 
          disabled={saving}
          className="flex items-center gap-2"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
        </Button>
      </div>

      {/* General Settings */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Pengaturan Umum
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Enable/Disable */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status Running Text
            </label>
            <Button
              variant={settings.enabled ? "default" : "outline"}
              onClick={() => setSettings(prev => ({ ...prev, enabled: !prev.enabled }))}
              className="w-full flex items-center gap-2"
            >
              {settings.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              {settings.enabled ? 'Aktif' : 'Nonaktif'}
            </Button>
          </div>

          {/* Speed */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kecepatan Scroll (detik)
            </label>
            <Input
              type="number"
              min="20"
              max="120"
              value={settings.speed}
              onChange={(e) => setSettings(prev => ({ ...prev, speed: parseInt(e.target.value) }))}
              className="w-full"
            />
          </div>

          {/* Pause on Hover */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pause saat Hover
            </label>
            <Button
              variant={settings.pauseOnHover ? "default" : "outline"}
              onClick={() => setSettings(prev => ({ ...prev, pauseOnHover: !prev.pauseOnHover }))}
              className="w-full"
            >
              {settings.pauseOnHover ? 'Ya' : 'Tidak'}
            </Button>
          </div>
        </div>
      </div>

      {/* Event Selection */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Pilih Event untuk Running Text
        </h3>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Pilih event yang akan ditampilkan dalam running text. Event yang dipilih akan muncul sesuai urutan prioritas.
          </p>
        </div>

        {/* Selected Events */}
        {settings.selectedEvents.length > 0 && (
          <div className="mb-6">
            <h4 className="text-md font-medium text-gray-900 mb-3">Event Terpilih ({settings.selectedEvents.length})</h4>
            <div className="space-y-2">
              {settings.selectedEvents.map((eventId, index) => {
                const event = events.find(e => e._id === eventId);
                if (!event) return null;
                
                return (
                  <div key={eventId} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge variant="secondary">#{index + 1}</Badge>
                      <div>
                        <h5 className="font-medium text-gray-900">{event.title}</h5>
                        <p className="text-sm text-gray-600">{formatDate(event.date)} • {event.time} WIB</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveEventUp(eventId)}
                        disabled={index === 0}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveEventDown(eventId)}
                        disabled={index === settings.selectedEvents.length - 1}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleEventSelection(eventId)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <EyeOff className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Available Events */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">Event Tersedia</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {events
              .filter(event => !settings.selectedEvents.includes(event._id))
              .map((event) => (
                <div key={event._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                  <div className="flex items-center space-x-3">
                    {event.imageUrl && (
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <h5 className="font-medium text-gray-900 line-clamp-1">{event.title}</h5>
                      <p className="text-sm text-gray-600">{formatDate(event.date)} • {event.time} WIB</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">{event.category}</Badge>
                        {event.isFeatured && <Badge className="text-xs bg-yellow-100 text-yellow-800">Unggulan</Badge>}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleEventSelection(event._id)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
