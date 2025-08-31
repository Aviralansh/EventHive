import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Ticket,
  Calendar,
  Clock,
  MapPin,
  Star,
  Download,
  Share2,
  ChevronRight,
  Filter,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMyBookings } from '../../hooks/useApi';
import QRCode from 'react-qr-code';

const AttendeeDashboard: React.FC = () => {
  const { data: bookings, isLoading } = useMyBookings();
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'past'>('all');

  const filterBookings = (bookings: any[]) => {
    if (!bookings) return [];
    const now = new Date();
    
    return bookings.filter(booking => {
      const eventDate = new Date(booking.event.start_date);
      switch (filterStatus) {
        case 'upcoming':
          return eventDate > now;
        case 'past':
          return eventDate <= now;
        default:
          return true;
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      </div>
    );
  }

  const filteredBookings = filterBookings(bookings);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Events</h1>
          <p className="text-gray-600">Manage your event bookings and tickets</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === 'all'
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Events
          </button>
          <button
            onClick={() => setFilterStatus('upcoming')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === 'upcoming'
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilterStatus('past')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === 'past'
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Past Events
          </button>
        </div>

        {/* Bookings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map((booking: any) => (
            <motion.div
              key={booking.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Event Image */}
              <div className="relative h-48">
                <img
                  src={booking.event.image_url || '/placeholder.jpg'}
                  alt={booking.event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-gradient-to-t from-black/60 to-transparent">
                  <h3 className="text-white font-semibold truncate">
                    {booking.event.title}
                  </h3>
                </div>
              </div>

              {/* Event Details */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center text-gray-600 text-sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(booking.event.start_date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Clock className="h-4 w-4 mr-2" />
                      {new Date(booking.event.start_date).toLocaleTimeString()}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin className="h-4 w-4 mr-2" />
                      {booking.event.location}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Ticket className="h-4 w-4 mr-2" />
                      {booking.quantity} {booking.quantity > 1 ? 'tickets' : 'ticket'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900">
                      ₹{booking.total_amount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">Total Paid</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="flex items-center space-x-2 text-purple-600 hover:text-purple-700"
                  >
                    <span>View Ticket</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-600 hover:text-purple-600 transition-colors">
                      <Download className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-purple-600 transition-colors">
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Ticket className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-6">
              {filterStatus === 'all'
                ? "You haven't made any bookings yet."
                : filterStatus === 'upcoming'
                ? "You don't have any upcoming events."
                : "You don't have any past events."}
            </p>
            <Link
              to="/events"
              className="inline-flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Calendar className="h-5 w-5" />
              <span>Browse Events</span>
            </Link>
          </div>
        )}

        {/* Ticket Modal */}
        <AnimatePresence>
          {selectedBooking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBooking(null)}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden"
              >
                <div className="relative p-6">
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                  >
                    <span className="sr-only">Close</span>
                    ×
                  </button>

                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {selectedBooking.event.title}
                    </h3>
                    <p className="text-gray-600">{selectedBooking.booking_id}</p>
                  </div>

                  <div className="flex justify-center mb-6">
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <QRCode value={selectedBooking.qr_code} size={180} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Attendee</span>
                      <span className="font-medium text-gray-900">
                        {selectedBooking.attendee_name}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Event Date</span>
                      <span className="font-medium text-gray-900">
                        {new Date(selectedBooking.event.start_date).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Ticket Type</span>
                      <span className="font-medium text-gray-900">
                        {selectedBooking.ticket_type.name}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Quantity</span>
                      <span className="font-medium text-gray-900">
                        {selectedBooking.quantity}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Amount</span>
                      <span className="font-medium text-gray-900">
                        ₹{selectedBooking.total_amount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-center space-x-4">
                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                      <Share2 className="h-4 w-4" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AttendeeDashboard;
