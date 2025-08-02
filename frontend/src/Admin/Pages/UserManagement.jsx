import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Eye,
  Trash2,
  UserCheck,
  UserX,
  Mail,
  Phone,
  MoreVertical,
  Shield,
  Crown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../Components/AdminDashboardHeader';
import { adminAPI } from '../../services/api';

const AdminUsers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, statusFilter, pagination.currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter })
      });
      
      const response = await adminAPI.getAllUsers(`?${params}`);
      
      if (response.success) {
        setUsers(response.data.users);
        setPagination(response.data.pagination);
      } else {
        setError(response.message || 'Failed to fetch users');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await adminAPI.deleteUser(userId);
        if (response.success) {
          fetchUsers();
        } else {
          alert('Failed to delete user: ' + response.message);
        }
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('Failed to delete user');
      }
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      const response = await adminAPI.updateUserStatus(userId, { status: newStatus });
      if (response.success) {
        fetchUsers();
      } else {
        alert('Failed to update user status: ' + response.message);
      }
    } catch (err) {
      console.error('Error updating user status:', err);
      alert('Failed to update user status');
    }
  };

  const handleViewUser = (userId) => {
    navigate(`/admin/viewuserdetails`, { state: { userId } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
        <AdminHeader currentPage="users" />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            <span className="ml-3 text-lg text-gray-600">Loading users...</span>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
        <AdminHeader currentPage="users" />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-red-600 text-lg mb-2">{error}</div>
              <button 
                onClick={fetchUsers} 
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
      <AdminHeader currentPage="users" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Premium Header Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold bg-gradient-to-r from-slate-900 to-orange-600 bg-clip-text text-transparent">
                User Management
              </h1>
              <p className="text-slate-600 mt-1">Oversee and manage all platform users</p>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/50 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Users</p>
                  <p className="text-3xl font-bold text-slate-900">{users.length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/50 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Users</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {users.filter(u => u.status === 'active').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/50 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Suspended</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {users.filter(u => u.status === 'suspended').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center">
                  <UserX className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Search and Filter Section */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Enhanced Search */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="block w-full pl-12 pr-4 py-3 border-0 rounded-2xl bg-slate-50/50 placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all duration-200 outline-none"
              />
            </div>

            {/* Premium Status Filter */}
            <div className="flex items-center space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                className="px-6 py-3 border-0 rounded-2xl bg-slate-50/50 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all duration-200 outline-none appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="active">Active Users</option>
                <option value="suspended">Suspended Users</option>
              </select>
            </div>
          </div>
        </div>

        {/* Premium Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {users.map(user => (
            <div key={user.id} className="group bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              {/* User Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-16 h-16 rounded-2xl object-cover shadow-lg"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                      user.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 group-hover:text-orange-600 transition-colors">
                      {user.name}
                    </h3>
                    <p className="text-sm text-slate-500">{user.email}</p>
                  </div>
                </div>
                
                {/* Status Badge */}
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user.status === 'active'
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : 'bg-red-100 text-red-700 border border-red-200'
                  }`}>
                    {user.status}
                  </span>
                  
                  {/* Account Type Badge */}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.accountType === 'Premium'
                      ? 'bg-amber-100 text-amber-700 border border-amber-200'
                      : 'bg-gray-100 text-gray-700 border border-gray-200'
                  }`}>
                    {user.accountType}
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3 text-sm text-slate-600">
                  <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Mail className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-slate-600">
                  <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Phone className="w-4 h-4 text-orange-600" />
                  </div>
                  <span>{user.phone}</span>
                </div>
              </div>

              {/* Action Buttons - Edit Button Removed */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleViewUser(user)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                    title="View User Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleSuspendUser(user.id)}
                    className={`p-2 rounded-xl transition-all duration-200 ${
                      user.status === 'active'
                        ? 'text-slate-400 hover:text-orange-600 hover:bg-orange-50'
                        : 'text-slate-400 hover:text-green-600 hover:bg-green-50'
                    }`}
                    title={user.status === 'active' ? 'Suspend User' : 'Activate User'}
                  >
                    {user.status === 'active' ? (
                      <UserX className="w-4 h-4" />
                    ) : (
                      <UserCheck className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                    title="Delete User"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Premium Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center">
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-2 shadow-xl border border-white/50">
              <div className="flex items-center space-x-1">
                <button 
                  onClick={() => handlePageChange(Math.max(pagination.currentPage - 1, 1))}
                  disabled={pagination.currentPage === 1}
                  className="px-4 py-2 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {[...Array(Math.min(5, pagination.totalPages))].map((_, index) => {
                  const pageNum = index + 1;
                  return (
                    <button 
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                        pagination.currentPage === pageNum
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                          : 'text-slate-600 hover:text-orange-600 hover:bg-orange-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button 
                  onClick={() => handlePageChange(Math.min(pagination.currentPage + 1, pagination.totalPages))}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-4 py-2 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminUsers;
