import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Crown, Trash2, LogOut, Search, User } from 'lucide-react';

interface UserData {
  id: string;
  username: string;
  nickname: string;
  phone: string;
  isVip: boolean;
  joinDate: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin');
      return;
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVip = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/users/${id}/toggle-vip`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setUsers(users.map(u => u.id === id ? { ...u, isVip: !u.isVip } : u));
      }
    } catch (error) {
      alert('Operation failed');
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setUsers(users.filter(u => u.id !== id));
      }
    } catch (error) {
      alert('Delete failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin');
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.phone.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 text-white p-2 rounded-lg">
            <Users size={20} />
          </div>
          <h1 className="text-xl font-bold text-gray-800">User Management</h1>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-gray-500 text-sm font-medium mb-1">Total Users</div>
            <div className="text-3xl font-bold text-gray-900">{users.length}</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-gray-500 text-sm font-medium mb-1">VIP Members</div>
            <div className="text-3xl font-bold text-indigo-600">
              {users.filter(u => u.isVip).length}
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-gray-500 text-sm font-medium mb-1">New Today</div>
            <div className="text-3xl font-bold text-green-600">0</div>
          </div>
        </div>

        {/* User Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="font-bold text-lg text-gray-800">All Users</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search username or phone..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-900 font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">User Info</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Join Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-400">Loading...</td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-400">No users found</td>
                  </tr>
                ) : (
                  filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                            <User size={20} />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{user.username}</div>
                            <div className="text-xs text-gray-400">{user.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {user.isVip ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                            <Crown size={12} className="fill-current" /> VIP Member
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            Ordinary
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {user.joinDate}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => toggleVip(user.id)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                              user.isVip 
                                ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' 
                                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                            }`}
                          >
                            {user.isVip ? 'Remove VIP' : 'Set as VIP'}
                          </button>
                          <button 
                            onClick={() => deleteUser(user.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete User"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
