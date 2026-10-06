import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import { 
  Users, Search, Shield, Key, CheckCircle, 
  XCircle, AlertTriangle, UserCheck, RefreshCw 
} from 'lucide-react';

export default function AdminUserManagementPage() {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Password Reset Modal
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [targetUser, setTargetUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    fetchUsers(0);
  }, [roleFilter, statusFilter]);

  const fetchUsers = async (pageNumber = 0) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', pageNumber);
      params.append('size', 10);
      if (roleFilter) params.append('role', roleFilter);
      if (statusFilter) params.append('status', statusFilter);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await api.get(`/admin/users?${params.toString()}`);
      const data = res.data;
      setUsers(data.content || []);
      setTotalPages(data.totalPages || 1);
      setPage(pageNumber);
    } catch (error) {
      showToast('Error loading user accounts', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await api.patch(`/admin/users/${userId}/status?status=${nextStatus}`);
      showToast(`User status updated to ${nextStatus}`, 'success');
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: nextStatus } : u));
    } catch (error) {
      showToast('Failed to update user status', 'error');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.patch(`/admin/users/${userId}/role?role=${newRole}`);
      showToast(`Role updated to ${newRole}`, 'success');
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, roles: [newRole] } : u));
    } catch (error) {
      showToast('Failed to update user role', 'error');
    }
  };

  const openResetModal = (user) => {
    setTargetUser(user);
    setNewPassword('JobConnect2026!');
    setResetModalOpen(true);
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!targetUser || !newPassword) return;

    setResetting(true);
    try {
      await api.post(`/admin/users/${targetUser.id}/reset-password`, { newPassword });
      showToast(`Password successfully reset for ${targetUser.email}`, 'success');
      setResetModalOpen(false);
    } catch (error) {
      showToast('Failed to reset password', 'error');
    } finally {
      setResetting(false);
    }
  };

  const allRoles = ['JOB_SEEKER', 'EMPLOYER', 'ADMIN', 'SUPER_ADMIN', 'RECRUITER', 'SUPPORT'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Directory & RBAC</h1>
          <p className="text-sm text-gray-500">
            Control platform access, enforce security roles, suspend accounts, and handle password resets.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="card p-4 flex flex-wrap items-center gap-3">
        <div className="w-full sm:w-64">
          <Input
            placeholder="Search email, name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchUsers(0)}
          />
        </div>

        <div className="w-44">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="select text-xs py-2 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            <option value="">All Roles</option>
            {allRoles.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div className="w-44">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="select text-xs py-2 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="SUSPENDED">SUSPENDED</option>
            <option value="PENDING_VERIFICATION">PENDING_VERIFICATION</option>
          </select>
        </div>

        <button
          onClick={() => fetchUsers(0)}
          className="btn btn-sm btn-primary ml-auto flex items-center gap-1 text-xs"
        >
          <Search size={13} /> Filter
        </button>
      </div>

      {/* Users Table */}
      {loading ? (
        <LoadingSpinner text="Loading user accounts..." />
      ) : users.length === 0 ? (
        <div className="card p-12 text-center text-gray-500">
          <Users size={36} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
          <p className="text-sm font-semibold">No accounts match the selected filters.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-500 font-semibold border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Email Verified</th>
                  <th className="py-3 px-4">Registered At</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {users.map(u => {
                  const roleStr = Array.isArray(u.roles) ? u.roles[0] : (u.role || 'JOB_SEEKER');
                  return (
                    <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                      <td className="py-3 px-4">
                        <p className="font-bold text-gray-900 dark:text-white">
                          {u.firstName} {u.lastName}
                        </p>
                        <p className="text-[11px] text-gray-400">{u.email}</p>
                      </td>

                      <td className="py-3 px-4">
                        <select
                          value={roleStr}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="select text-[11px] py-1 px-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 font-medium"
                        >
                          {allRoles.map(r => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </td>

                      <td className="py-3 px-4">
                        <StatusBadge status={u.status} />
                      </td>

                      <td className="py-3 px-4">
                        {u.emailVerified ? (
                          <span className="badge bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 text-[10px] px-2 py-0.5 rounded-full">
                            Verified
                          </span>
                        ) : (
                          <span className="badge bg-amber-50 text-amber-600 dark:bg-amber-950/40 text-[10px] px-2 py-0.5 rounded-full">
                            Unverified
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-gray-400">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleStatusToggle(u.id, u.status)}
                            className={`btn btn-xs ${
                              u.status === 'ACTIVE' 
                                ? 'btn-outline text-rose-600 border-rose-300 hover:bg-rose-50' 
                                : 'btn-outline text-emerald-600 border-emerald-300 hover:bg-emerald-50'
                            }`}
                            title={u.status === 'ACTIVE' ? 'Suspend Account' : 'Activate Account'}
                          >
                            {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                          </button>

                          <button
                            onClick={() => openResetModal(u)}
                            className="btn btn-xs btn-outline p-1.5"
                            title="Reset User Password"
                          >
                            <Key size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-3 border-t border-gray-100 dark:border-gray-800">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => fetchUsers(p)}
            />
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      <Modal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title={`Reset Password: ${targetUser?.email}`}
      >
        <form onSubmit={handleResetSubmit} className="space-y-4">
          <p className="text-xs text-gray-500">
            Enter a new temporary password for this user. The password will be immediately hashed using BCrypt.
          </p>

          <Input
            label="New Password *"
            type="text"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-200 dark:border-gray-800">
            <button
              type="button"
              onClick={() => setResetModalOpen(false)}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <Button
              type="submit"
              variant="primary"
              loading={resetting}
              className="flex items-center gap-1.5"
            >
              <Key size={14} /> Update Password
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
