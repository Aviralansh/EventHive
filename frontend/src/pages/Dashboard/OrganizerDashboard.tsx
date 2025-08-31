import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  IndianRupee,
  TrendingUp,
  Plus,
  Clock,
  Star
} from 'lucide-react';
import { useMyEvents, useMyBookings, useDashboardStats } from '../../hooks/useApi';
import QuickActions from './QuickActions';
import EventAnalytics from './EventAnalytics';

const OrganizerDashboard: React.FC = () => {
  const { data: events, isLoading: eventsLoading } = useMyEvents();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();

  const selectedEventId = events?.[0]?.id;

  if (eventsLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Organizer Dashboard
            </h1>
            <p className="text-gray-600">
              Manage your events and track performance
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-4 md:mt-0 inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
          >
            <Plus className="h-5 w-5" />
            <span>Create Event</span>
          </motion.button>
        </motion.div>

        {/* Quick Actions */}
        <div className="mb-8">
          <QuickActions />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: 'Total Events',
              value: stats?.totalEvents || 0,
              icon: Calendar,
              color: 'bg-gradient-to-r from-purple-500 to-purple-600',
            },
            {
              title: 'Total Revenue',
              value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`,
              icon: IndianRupee,
              color: 'bg-gradient-to-r from-green-500 to-green-600',
            },
            {
              title: 'Total Attendees',
              value: stats?.totalAttendees || 0,
              icon: Users,
              color: 'bg-gradient-to-r from-blue-500 to-blue-600',
            },
            {
              title: 'Average Rating',
              value: stats?.averageRating?.toFixed(1) || '0.0',
              icon: Star,
              color: 'bg-gradient-to-r from-yellow-500 to-orange-500',
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg text-white ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Event Analytics */}
        {selectedEventId && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Event Performance
            </h2>
            <EventAnalytics eventId={selectedEventId} />
          </div>
        )}

        {/* Recent Bookings */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {stats?.recentBookings?.map((booking: any) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-4 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Clock className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      New booking for "{booking.event.title}"
                    </h4>
                    <p className="text-sm text-gray-500">
                      {new Date(booking.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-medium text-purple-600">
                  ₹{booking.total_amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
