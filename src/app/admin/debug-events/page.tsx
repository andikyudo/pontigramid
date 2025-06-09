'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminAuth from '@/components/admin/AdminAuth';
import { Button } from '@/components/ui/button';

export default function DebugEventsPage() {
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allEvents, setAllEvents] = useState<any>(null);
  const [featuredEvents, setFeaturedEvents] = useState<any>(null);

  const testPublicAPI = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Testing /api/events endpoint...');
      const response = await fetch('/api/events?featured=true&upcoming=true&limit=10');
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      setApiResponse(data);
      
    } catch (err: any) {
      console.error('API Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testAllEvents = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Testing /api/events (all events)...');
      const response = await fetch('/api/events?limit=20');
      console.log('All events response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('All Events Response:', data);
      setAllEvents(data);
      
    } catch (err: any) {
      console.error('All Events API Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testFeaturedOnly = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Testing /api/events (featured only)...');
      const response = await fetch('/api/events?featured=true&limit=10');
      console.log('Featured events response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Featured Events Response:', data);
      setFeaturedEvents(data);
      
    } catch (err: any) {
      console.error('Featured Events API Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createTestEvent = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      
      // Create a test event with future date
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7); // 7 days from now
      
      formData.append('title', 'Test Event - Debug API');
      formData.append('description', 'This is a test event created for debugging the API endpoint. It should appear in the EventRunningTextOptimized component.');
      formData.append('date', futureDate.toISOString().split('T')[0]);
      formData.append('time', '14:00');
      formData.append('location', 'Debug Location, Pontianak');
      formData.append('category', 'teknologi');
      formData.append('organizer', 'Debug Team');
      formData.append('isActive', 'true');
      formData.append('isFeatured', 'true'); // Make it featured so it shows in the component
      formData.append('registrationRequired', 'false');
      formData.append('isFree', 'true');

      console.log('Creating test event...');
      const response = await fetch('/api/admin/events', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Event creation response:', data);
      
      if (data.success) {
        alert('Test event created successfully! Now test the API endpoints.');
      } else {
        throw new Error(data.error || 'Failed to create event');
      }

    } catch (err: any) {
      console.error('Event creation error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminAuth>
      <AdminLayout>
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Debug Events API</h1>
            <p className="text-gray-600">Debug the /api/events endpoint and EventRunningTextOptimized component</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Test Controls */}
            <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Test Controls</h3>
              
              <Button
                onClick={createTestEvent}
                disabled={loading}
                className="w-full"
                variant="outline"
              >
                {loading ? 'Creating...' : 'Create Test Event'}
              </Button>

              <Button
                onClick={testPublicAPI}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Testing...' : 'Test Featured + Upcoming API'}
              </Button>

              <Button
                onClick={testAllEvents}
                disabled={loading}
                className="w-full"
                variant="outline"
              >
                {loading ? 'Testing...' : 'Test All Events API'}
              </Button>

              <Button
                onClick={testFeaturedOnly}
                disabled={loading}
                className="w-full"
                variant="outline"
              >
                {loading ? 'Testing...' : 'Test Featured Only API'}
              </Button>
            </div>

            {/* Current Status */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h3>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-red-800">Error:</h4>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                </div>
              )}

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">API Endpoint:</span>
                  <span className="font-mono text-blue-600">/api/events</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Expected Query:</span>
                  <span className="font-mono text-blue-600">?featured=true&upcoming=true&limit=10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Component:</span>
                  <span className="text-gray-900">EventRunningTextOptimized</span>
                </div>
              </div>
            </div>
          </div>

          {/* API Response Display */}
          {(apiResponse || allEvents || featuredEvents) && (
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">API Responses</h3>
              
              {apiResponse && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">Featured + Upcoming Events:</h4>
                  <pre className="bg-gray-50 p-4 rounded-lg text-xs overflow-auto max-h-64">
                    {JSON.stringify(apiResponse, null, 2)}
                  </pre>
                </div>
              )}

              {allEvents && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">All Events:</h4>
                  <pre className="bg-gray-50 p-4 rounded-lg text-xs overflow-auto max-h-64">
                    {JSON.stringify(allEvents, null, 2)}
                  </pre>
                </div>
              )}

              {featuredEvents && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">Featured Only Events:</h4>
                  <pre className="bg-gray-50 p-4 rounded-lg text-xs overflow-auto max-h-64">
                    {JSON.stringify(featuredEvents, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-medium text-blue-800 mb-3">Debug Instructions:</h4>
            <ol className="text-sm text-blue-700 space-y-2">
              <li>1. <strong>Create Test Event:</strong> Creates a featured event with future date</li>
              <li>2. <strong>Test APIs:</strong> Check if the /api/events endpoint returns data</li>
              <li>3. <strong>Check Console:</strong> Open browser dev tools to see detailed logs</li>
              <li>4. <strong>Verify Data:</strong> Ensure events have isActive=true, isFeatured=true, future date</li>
              <li>5. <strong>Component Test:</strong> Check if EventRunningTextOptimized receives the data</li>
            </ol>
          </div>

          {/* Expected Data Structure */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h4 className="font-medium text-gray-900 mb-3">Expected API Response Structure:</h4>
            <pre className="text-xs text-gray-700">
{`{
  "success": true,
  "data": [
    {
      "_id": "...",
      "title": "Event Title",
      "description": "Event Description",
      "imageUrl": "...",
      "date": "2024-12-31T00:00:00.000Z",
      "time": "14:00",
      "location": "Event Location",
      "category": "teknologi",
      "organizer": "Organizer Name",
      "slug": "event-title",
      "isFeatured": true,
      "isActive": true,
      "price": {...},
      "tags": [...]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}`}
            </pre>
          </div>
        </div>
      </AdminLayout>
    </AdminAuth>
  );
}
