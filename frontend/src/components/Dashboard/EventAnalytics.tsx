import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useEventAnalytics } from '../../hooks/useApi';

interface ViewData {
  date: string;
  count: number;
}

interface SaleData {
  date: string;
  quantity: number;
  revenue: number;
}

interface AnalyticsData {
  views: ViewData[];
  sales: SaleData[];
  totalViews: number;
  totalTickets: number;
  totalRevenue: number;
  viewsChange: number;
  ticketsChange: number;
  revenueChange: number;
}

interface ChartData {
  dailyViews: ViewData[];
  ticketsSold: Array<{ date: string; count: number }>;
  revenue: Array<{ date: string; amount: number }>;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface EventAnalyticsProps {
  eventId: number;
}

const EventAnalytics: React.FC<EventAnalyticsProps> = ({ eventId }) => {
  const { data: analytics, isLoading, error } = useEventAnalytics(eventId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="text-center text-gray-500 h-64 flex items-center justify-center">
        Failed to load analytics data
      </div>
    );
  }

  const chartData: ChartData = {
    dailyViews: analytics.views,
    ticketsSold: analytics.sales.map((s) => ({ date: s.date, count: s.quantity })),
    revenue: analytics.sales.map((s) => ({ date: s.date, amount: s.revenue }))
  };
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  const viewsData = {
    labels: chartData.dailyViews.map((item: ViewData) => item.date),
    datasets: [
      {
        label: 'Daily Views',
        data: chartData.dailyViews.map((item: ViewData) => item.count),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const salesData = {
    labels: chartData.ticketsSold.map((item: { date: string }) => item.date),
    datasets: [
      {
        label: 'Tickets Sold',
        data: chartData.ticketsSold.map((item: { count: number }) => item.count),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'Revenue (₹)',
        data: chartData.revenue.map((item: { amount: number }) => item.amount),
        yAxisID: 'revenue',
        type: 'line' as const,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const salesOptions = {
    ...chartOptions,
    scales: {
      revenue: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Views Trend</h3>
        <Line options={chartOptions} data={viewsData} />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Sales & Revenue</h3>
        <Bar options={salesOptions} data={salesData} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-blue-700 font-medium mb-1">Total Views</h4>
          <p className="text-2xl font-bold text-blue-900">
            {analytics.totalViews.toLocaleString()}
          </p>
          <span className={`text-sm ${
            analytics.viewsChange >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {analytics.viewsChange >= 0 ? '+' : ''}{analytics.viewsChange}% vs last period
          </span>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="text-green-700 font-medium mb-1">Total Tickets</h4>
          <p className="text-2xl font-bold text-green-900">
            {analytics.totalTickets.toLocaleString()}
          </p>
          <span className={`text-sm ${
            analytics.ticketsChange >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {analytics.ticketsChange >= 0 ? '+' : ''}{analytics.ticketsChange}% vs last period
          </span>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="text-purple-700 font-medium mb-1">Total Revenue</h4>
          <p className="text-2xl font-bold text-purple-900">
            ₹{analytics.totalRevenue.toLocaleString()}
          </p>
          <span className={`text-sm ${
            analytics.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {analytics.revenueChange >= 0 ? '+' : ''}{analytics.revenueChange}% vs last period
          </span>
        </div>
      </div>
    </div>
  );
};

export default EventAnalytics;
