import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Home, 
  TrendingUp, 
  DollarSign,
  Eye,
  UserCheck,
  UserX,
  Calendar,
  User,
  Settings,
  BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../Components/AdminDashboardHeader';
import { adminAPI } from '../../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    suspendedUsers: 0,
    totalProperties: 0,
    availableProperties: 0,
    rentedProperties: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const response = await adminAPI.getDashboardStats();
        
        if (response.success) {
          const { stats: apiStats } = response.data;
          setStats({
            totalUsers: apiStats.users.total,
            activeUsers: apiStats.users.active,
            suspendedUsers: apiStats.users.total - apiStats.users.active,
            totalProperties: apiStats.properties.total,
            availableProperties: apiStats.properties.active,
            rentedProperties: apiStats.properties.total - apiStats.properties.active
          });
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const handleManageUsers = () => {
    navigate('/admin/users');
  };

  const handleManageProperties = () => {
    navigate('/admin/properties');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <AdminHeader currentPage="dashboard" />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            <span className="ml-3 text-lg text-gray-600">Loading dashboard...</span>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <AdminHeader currentPage="dashboard" />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-red-600 text-lg mb-2">{error}</div>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <AdminHeader currentPage="dashboard" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Premium Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-serif font-bold text-gray-900 mb-4">
            Admin <span className="text-orange-600">Dashboard</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive control center for your premium rental property platform
          </p>
        </div>

        {/* Premium Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Users Overview */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">User Management</p>
                <p className="text-4xl font-bold text-gray-900 mt-1">{stats.totalUsers.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-gray-700">Active Users</span>
                </div>
                <span className="text-xl font-bold text-green-600">{stats.activeUsers}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="font-medium text-gray-700">Suspended Users</span>
                </div>
                <span className="text-xl font-bold text-red-600">{stats.suspendedUsers}</span>
              </div>
            </div>
          </div>

          {/* Properties Overview */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Home className="w-8 h-8 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Property Management</p>
                <p className="text-4xl font-bold text-gray-900 mt-1">{stats.totalProperties}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-gray-700">Available Properties</span>
                </div>
                <span className="text-xl font-bold text-green-600">{stats.availableProperties}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-medium text-gray-700">Rented Properties</span>
                </div>
                <span className="text-xl font-bold text-blue-600">{stats.rentedProperties}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* User Management Card */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3">User Management</h3>
              <p className="text-orange-100 mb-6 leading-relaxed">
                Comprehensive user control system with advanced permissions, analytics, and real-time monitoring capabilities.
              </p>
              
              <button 
                onClick={handleManageUsers}
                className="bg-white text-orange-600 px-8 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Manage Users
              </button>
            </div>
          </div>

          {/* Property Management Card */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Home className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3">Property Management</h3>
              <p className="text-blue-100 mb-6 leading-relaxed">
                Complete property lifecycle management with intelligent pricing, availability tracking, and performance insights.
              </p>
              
              <button 
                onClick={handleManageProperties}
                className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Manage Properties
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
