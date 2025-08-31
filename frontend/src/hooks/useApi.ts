import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsAPI, bookingsAPI, userAPI, categoriesAPI } from '../lib/api';
import { useAuthStore } from '../store/authStore';

// Events hooks
export const useEvents = (params?: Parameters<typeof eventsAPI.getAllEvents>[0]) => {
  return useQuery(['events', params], () => eventsAPI.getAllEvents(params));
};

export const useEvent = (id: number) => {
  return useQuery(['event', id], () => eventsAPI.getEventById(id), {
    enabled: !!id,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation(eventsAPI.createEvent, {
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
    },
  });
};

export const useUpdateEvent = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation(
    (data: Parameters<typeof eventsAPI.updateEvent>[1]) => eventsAPI.updateEvent(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['events']);
        queryClient.invalidateQueries(['event', id]);
      },
    }
  );
};

// Categories hooks
export const useCategories = () => {
  return useQuery(['categories'], categoriesAPI.getAllCategories);
};

// Bookings hooks
export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation(bookingsAPI.createBooking, {
    onSuccess: () => {
      queryClient.invalidateQueries(['myBookings']);
    },
  });
};

export const useMyBookings = () => {
  const { user } = useAuthStore();
  return useQuery(['myBookings'], bookingsAPI.getMyBookings, {
    enabled: !!user,
  });
};

// User hooks
export const useMyEvents = () => {
  const { user } = useAuthStore();
  return useQuery(['myEvents'], userAPI.getMyEvents, {
    enabled: !!user && user.role === 'organizer',
  });
};

export const useDashboardStats = () => {
  const { user } = useAuthStore();
  return useQuery(['dashboardStats'], userAPI.getDashboardStats, {
    enabled: !!user,
  });
};

// Event analytics hooks
export const useEventAnalytics = (eventId: number) => {
  return useQuery(
    ['eventAnalytics', eventId],
    () => eventsAPI.getEventAnalytics(eventId),
    {
      enabled: !!eventId,
    }
  );
};
