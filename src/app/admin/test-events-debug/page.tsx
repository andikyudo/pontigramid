'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminAuth from '@/components/admin/AdminAuth';

interface Event {
  _id: string;
  title: string;
  slug: string;
  isActive: boolean;
  date: string;
}

export default function TestEventsDebugPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [publicEvents, setPublicEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch admin events
      const adminResponse = await fetch('/api/admin/events');
      const adminData = await adminResponse.json();
      
      // Fetch public events
      const publicResponse = await fetch('/api/public-events');
      const publicData = await publicResponse.json();
      
      console.log('Admin events:', adminData);
      console.log('Public events:', publicData);
      
      if (adminData.success) {
        setEvents(adminData.data || []);
      }
      
      if (publicData.success) {
        setPublicEvents(publicData.data || []);
      }
      
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const testEventDetailPage = async (slug: string) => {
    try {
      const response = await fetch(`/api/public-events/${slug}`);
      const data = await response.json();
      console.log(`Event detail for ${slug}:`, data);
      
      if (data.success) {
        alert(`Event found: ${data.data.event.title}`);
        window.open(`/event/${slug}`, '_blank');
      } else {
        alert(`Event not found: ${slug}`);
      }
    } catch (err) {
      console.error('Error testing event detail:', err);
      alert(`Error testing event: ${err}`);
    }
  };

  if (loading) {
    return (
      <AdminAuth>
        <AdminLayout>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </AdminLayout>
      </AdminAuth>
    );
  }

  return (
    <AdminAuth>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Event Debug Test</h1>
            <p className="text-gray-600">Debug event data and test event detail pages</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">Error: {error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Admin Events */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Admin Events ({events.length})
              </h2>
              <div className="space-y-3">
                {events.map((event) => (
                  <div key={event._id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{event.title}</h3>
                        <p className="text-sm text-gray-600">Slug: {event.slug}</p>
                        <p className="text-sm text-gray-600">
                          Status: {event.isActive ? 'Active' : 'Inactive'}
                        </p>
                        <p className="text-sm text-gray-600">Date: {event.date}</p>
                      </div>
                      <button
                        onClick={() => testEventDetailPage(event.slug)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        Test
                      </button>
                    </div>
                  </div>
                ))}
                {events.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No admin events found</p>
                )}
              </div>
            </div>

            {/* Public Events */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Public Events ({publicEvents.length})
              </h2>
              <div className="space-y-3">
                {publicEvents.map((event) => (
                  <div key={event._id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{event.title}</h3>
                        <p className="text-sm text-gray-600">Slug: {event.slug}</p>
                        <p className="text-sm text-gray-600">
                          Status: {event.isActive ? 'Active' : 'Inactive'}
                        </p>
                        <p className="text-sm text-gray-600">Date: {event.date}</p>
                      </div>
                      <button
                        onClick={() => testEventDetailPage(event.slug)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Test
                      </button>
                    </div>
                  </div>
                ))}
                {publicEvents.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No public events found</p>
                )}
              </div>
            </div>
          </div>

          {/* Test Actions */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Actions</h2>
            <div className="flex space-x-4">
              <button
                onClick={fetchData}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Refresh Data
              </button>
              <button
                onClick={() => window.open('/', '_blank')}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Test Homepage
              </button>
              <button
                onClick={() => testEventDetailPage('lomba-mewarnai-')}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Test Known Event
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
    </AdminAuth>
  );
}
