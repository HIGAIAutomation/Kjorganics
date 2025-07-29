'use client';

import { useEffect, useState } from 'react';
import axiosInstance  from '../../utils/axiosInstance';
import Link from 'next/link';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {
  CurrencyRupeeIcon,
  ShoppingBagIcon,
  UsersIcon,
  ArchiveBoxIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  FireIcon,
  TagIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Order {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  customerName: string;
  createdAt: string;
  user?: { name: string; [key: string]: any };
}

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  ordersGrowth: number;
  revenueGrowth: number;
  customersGrowth: number;
  productsGrowth: number;
  topCategories: { name: string; count: number }[];
  topProducts: { name: string; sales: number }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalProducts: 0,
    ordersGrowth: 0,
    revenueGrowth: 0,
    customersGrowth: 0,
    productsGrowth: 0,
    topCategories: [],
    topProducts: [],
  });

  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [salesData, setSalesData] = useState({
    labels: [] as string[],
    datasets: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch all required data in parallel
        const [ordersRes, usersRes, productsRes, analyticsRes] = await Promise.all([
          axiosInstance.get('/api/orders'),
          axiosInstance.get('/api/users'),
          axiosInstance.get('/api/products'),
          axiosInstance.get('/api/admin/analytics'),
        ]);

        const orders = ordersRes.data;
        const users = usersRes.data;
        const products = productsRes.data;
        const analytics = analyticsRes.data;

        // Calculate total revenue
        const totalRevenue = orders.reduce((sum: number, order: Order) => sum + order.totalAmount, 0);

        setStats({
          totalOrders: orders.length,
          totalRevenue,
          totalCustomers: usersRes.data.length,
          totalProducts: productsRes.data.length,
          ordersGrowth: 0,
          revenueGrowth: 0,
          customersGrowth: 0,
          productsGrowth: 0,
          topCategories: [],
          topProducts: [],
        });

        // Set recent orders
        setRecentOrders(orders.slice(0, 5));

        // Prepare sales data
        const last7Days = [...Array(7)].map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          return d.toLocaleDateString();
        }).reverse();

        const salesByDay = orders.reduce((acc, order) => {
          const date = new Date(order.createdAt).toLocaleDateString();
          acc[date] = (acc[date] || 0) + order.totalAmount;
          return acc;
        }, {});

        setSalesData({
          labels: last7Days,
          datasets: [
            {
              label: 'Daily Sales',
              data: last7Days.map(date => salesByDay[date] || 0),
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Orders" value={stats.totalOrders} icon="📦" />
        <StatCard title="Revenue" value={`₹${stats.totalRevenue.toFixed(2)}`} icon="💰" />
        <StatCard title="Customers" value={stats.totalCustomers} icon="👥" />
        <StatCard title="Products" value={stats.totalProducts} icon="🏷️" />
      </div>

      {/* Sales Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
        <div className="h-[300px]">
          <Line data={salesData} options={{
            responsive: true,
            maintainAspectRatio: false,
          }} />
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{order._id.slice(-6)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.user?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{order.totalAmount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <div className="flex items-center">
      <div className="text-2xl mr-4">{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};
