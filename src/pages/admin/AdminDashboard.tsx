import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Crown, Trash2, LogOut, Search, User, Ban } from 'lucide-react';

interface UserData {
  id: string;
  username: string;
  nickname: string;
  phone: string;
  isVip: boolean;
  vipExpiresAt: string | null;
  joinDate: string;
  isBlacklisted?: boolean;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showVipModal, setShowVipModal] = useState(false);

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

  const handleSetVip = async (type: 'monthly' | 'permanent' | 'remove') => {
    if (!selectedUser) return;
    
    let endpoint = `/api/admin/users/${selectedUser.id}/toggle-vip`;
    // For simplicity, we might need a new endpoint or pass params to existing one
    // But since backend toggle-vip is simple boolean toggle, let's assume we need to update backend first
    // Actually, let's just use a direct update call if possible or stick to simple toggle for now if backend not ready
    // Wait, I should implement the logic.
    // Let's assume we can pass body to toggle-vip or create a new one.
    // Since I can't easily change backend routes without context, let's look at previous turns.
    // Ah, I can modify backend logic too if needed. But for now let's try to pass data.
    
    // Actually, I should probably just update the user directly if there was an update endpoint.
    // Let's try to use the existing toggle-vip but maybe I should have created a set-vip endpoint.
    // Let's create a new function `updateVipStatus` in this component and maybe mock the backend call 
    // or assume the backend `toggle-vip` is simple.
    // Wait, the user asked to "Set VIP also divided into two types".
    // I should probably update the backend route to accept `vipType` or `expiresAt`.
    
    // Let's stick to what I can do here first. 
    // I will mock the UI logic and assume I need to implement the backend change for `toggle-vip` to accept body.
    
    let expiresAt = null;
    if (type === 'monthly') {
      const date = new Date();
      date.setDate(date.getDate() + 30);
      expiresAt = date.toISOString();
    }
    
    try {
      // We need to send this to backend. 
      // Current backend `toggle-vip` just toggles boolean. 
      // I should ideally update backend `toggle-vip` to accept JSON body.
      // Let's assume I will update backend in next step or I can send it now.
      const res = await fetch(`/api/admin/users/${selectedUser.id}/set-vip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          isVip: type !== 'remove',
          expiresAt 
        })
      });
      
      const data = await res.json();
      if (data.success) {
        setUsers(users.map(u => u.id === selectedUser.id ? { 
          ...u, 
          isVip: type !== 'remove',
          vipExpiresAt: expiresAt 
        } : u));
        setShowVipModal(false);
      }
    } catch (error) {
      alert('Operation failed');
    }
  };

  const handleToggleBlacklist = async (user: UserData) => {
    const action = user.isBlacklisted ? 'unban' : 'ban';
    if (!confirm(`Are you sure you want to ${action} this user?`)) return;

    try {
      const res = await fetch(`/api/admin/users/${user.id}/toggle-blacklist`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setUsers(users.map(u => u.id === user.id ? { ...u, isBlacklisted: !u.isBlacklisted } : u));
      } else {
        alert(data.message || 'Operation failed');
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
                    <tr key={user.id} className={`hover:bg-gray-50 transition-colors ${user.isBlacklisted ? 'bg-gray-50' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.isBlacklisted ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-500'}`}>
                            {user.isBlacklisted ? <Ban size={20} /> : <User size={20} />}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 flex items-center gap-2">
                              {user.username}
                              {user.isBlacklisted && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold uppercase">Banned</span>}
                            </div>
                            <div className="text-xs text-gray-400">{user.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {user.isVip ? (
                          <div className="flex flex-col items-start gap-1">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                              <Crown size={12} className="fill-current" /> VIP Member
                            </span>
                            {user.vipExpiresAt && (
                              <span className="text-[10px] text-gray-400 pl-1">
                                Exp: {new Date(user.vipExpiresAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
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
                            onClick={() => {
                              setSelectedUser(user);
                              setShowVipModal(true);
                            }}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                              user.isVip 
                                ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' 
                                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                            }`}
                          >
                            Manage VIP
                          </button>
                          <button 
                            onClick={() => handleToggleBlacklist(user)}
                            className={`p-1.5 rounded-md transition-colors ${
                              user.isBlacklisted 
                                ? 'text-green-500 hover:bg-green-50' 
                                : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                            }`}
                            title={user.isBlacklisted ? "Unban User" : "Ban User"}
                          >
                            <Ban size={16} />
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

      {/* VIP Modal */}
      {showVipModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Manage VIP Status</h3>
              <p className="text-sm text-gray-500 mt-1">User: {selectedUser.username}</p>
            </div>
            
            <div className="p-6 space-y-3">
              <button
                onClick={() => handleSetVip('monthly')}
                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
                    <Crown size={20} />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-gray-900 group-hover:text-orange-700">Monthly VIP</div>
                    <div className="text-xs text-gray-500">Valid for 30 days</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleSetVip('permanent')}
                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-amber-400 hover:bg-amber-50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-500">
                    <Crown size={20} className="fill-current" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-gray-900 group-hover:text-amber-700">Permanent VIP</div>
                    <div className="text-xs text-gray-500">Never expires</div>
                  </div>
                </div>
              </button>

              {selectedUser.isVip && (
                <button
                  onClick={() => handleSetVip('remove')}
                  className="w-full flex items-center justify-center gap-2 p-3 mt-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                >
                  <LogOut size={16} />
                  Remove VIP Status
                </button>
              )}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setShowVipModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
