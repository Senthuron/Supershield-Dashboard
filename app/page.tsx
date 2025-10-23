'use client';

import { useState, useEffect } from 'react';

// Helper function to format the date
const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString('en-IN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

// Define the enquiry type for better typing
interface Enquiry {
  _id: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  email?: string;
  phone?: string;
  location?: {
    city?: string;
    state?: string;
  };
  customerCategory?: string;
  type: 'contact' | 'enquiry' | 'career';
  resume?: string;
  subject?: string;
  message?: string;
  createdAt?: string;
}

export default function DashboardPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'contact' | 'enquiry' | 'career'>('all');

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/enquiries', {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_DASHBOARD_SECRET_KEY}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch data');
        }

        const data = await response.json();
        setEnquiries(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiries();
  }, []);

  // Filter enquiries based on the active tab
  const filteredEnquiries = enquiries.filter((enquiry:any) => {
    if (activeFilter === 'all') return true;
    return enquiry.type === activeFilter;
  });

  const tabStyle =
    'px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c50022]';
  const activeTabStyle = 'bg-[#c50022] text-white';
  const inactiveTabStyle = 'bg-white text-gray-700 hover:bg-gray-50';

  return (
    <div className="w-full">
      <main className="flex-1 bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Contact Form Submissions</h1>
        </header>

        {/* Filter Tabs */}
        <div className="mb-6 flex space-x-2">
          {['all', 'enquiry', 'contact', 'career'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter as typeof activeFilter)}
              className={`${tabStyle} ${
                activeFilter === filter ? activeTabStyle : inactiveTabStyle
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        {loading && <p className="text-center text-gray-500">Loading submissions...</p>}
        {error && <p className="text-center text-red-500 bg-red-100 p-4 rounded-md">Error: {error}</p>}

        {!loading && !error && (
          <div className="bg-white rounded-lg shadow-md overflow-x-auto scrollbar-hide">
            <table className="max-w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-50 text-xs text-gray-800 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Company</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Phone</th>
                  <th className="px-6 py-3">City</th>
                  <th className="px-6 py-3">Customer Category</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Resume</th>
                  <th className="px-6 py-3">State</th>
                  <th className="px-6 py-3">Subject</th>
                  <th className="px-6 py-3">Message</th>
                  <th className="px-6 py-3">Submitted On</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnquiries.length > 0 ? (
                  filteredEnquiries.map((enquiry) => (
                    <tr
                      key={enquiry._id}
                      className="bg-white border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        {enquiry.fullName ||
                          `${enquiry.firstName || ''} ${enquiry.lastName || ''}`.trim() ||
                          'N/A'}
                      </td>
                      <td className="px-6 py-4">{enquiry.companyName || 'N/A'}</td>
                      <td className="px-6 py-4">{enquiry.email || 'N/A'}</td>
                      <td className="px-6 py-4">{enquiry.phone || 'N/A'}</td>
                      <td className="px-6 py-4">{enquiry.location?.city || 'N/A'}</td>
                      <td className="px-6 py-4">{enquiry.customerCategory || 'N/A'}</td>

                      <td className="px-6 py-4">
                        <span
                          className={`capitalize text-xs font-semibold px-3 py-1 rounded-full ${
                            enquiry.type === 'career'
                              ? 'bg-blue-100 text-blue-800'
                              : enquiry.type === 'enquiry'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {enquiry.type}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {enquiry.type === 'career' && enquiry.resume ? (
                          <span className="text-green-600 font-semibold">Submitted</span>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>

                      <td className="px-6 py-4">{enquiry.location?.state || 'N/A'}</td>
                      <td className="px-6 py-4">{enquiry.subject || 'N/A'}</td>
                      <td
                        className="px-6 py-4 max-w-xs truncate"
                        title={enquiry.message}
                      >
                        {enquiry.message || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatDate(enquiry.createdAt)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={12}
                      className="text-center text-gray-500 py-10"
                    >
                      No submissions found for this category.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
