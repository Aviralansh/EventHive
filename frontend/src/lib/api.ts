import axios from 'axios';

const BASE_URL = '';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  
  register: (userData: {
    email: string;
    password: string;
    full_name: string;
    phone?: string;
    role: 'admin' | 'organizer' | 'attendee';
  }) => api.post('/auth/register', userData),
  
  getCurrentUser: () => api.get('/auth/me'),
};

// Events APIs
export const eventsAPI = {
  getAllEvents: (params?: {
    category?: number;
    search?: string;
    status?: 'draft' | 'published' | 'cancelled';
    featured?: boolean;
    page?: number;
    limit?: number;
  }) => api.get('/events', { params }),
  
  getEventById: (id: number) => api.get(`/events/${id}`),
  
  createEvent: (eventData: {
    title: string;
    description: string;
    location: string;
    start_date: string;
    end_date: string;
    category_id: number;
    max_attendees?: number;
    image_url?: string;
    ticket_types: {
      name: string;
      price: number;
      max_quantity: number;
      sale_start?: string;
      sale_end?: string;
    }[];
  }) => api.post('/events', eventData),
  
  updateEvent: (id: number, eventData: Partial<Parameters<typeof eventsAPI.createEvent>[0]>) =>
    api.put(`/events/${id}`, eventData),
  
  deleteEvent: (id: number) => api.delete(`/events/${id}`),
  
  getEventAnalytics: (id: number) => api.get(`/events/${id}/analytics`),
};

// Categories APIs
export const categoriesAPI = {
  getAllCategories: () => api.get('/categories'),
  getCategoryById: (id: number) => api.get(`/categories/${id}`),
};

// Bookings APIs
export const bookingsAPI = {
  createBooking: (bookingData: {
    event_id: number;
    ticket_type_id: number;
    quantity: number;
    attendee_name: string;
    attendee_email: string;
    attendee_phone?: string;
  }) => api.post('/bookings', bookingData),
  
  getMyBookings: () => api.get('/bookings/me'),
  
  getBookingById: (id: number) => api.get(`/bookings/${id}`),
  
  cancelBooking: (id: number) => api.post(`/bookings/${id}/cancel`),
  
  verifyTicket: (qrCode: string) => api.post('/bookings/verify', { qr_code: qrCode }),
};

// User APIs
export const userAPI = {
  updateProfile: (userData: {
    full_name?: string;
    phone?: string;
    password?: string;
  }) => api.put('/users/me', userData),
  
  getMyEvents: () => api.get('/users/me/events'),
  
  getDashboardStats: () => api.get('/users/me/dashboard'),
};

export default api;
