import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';
import { Activity, Search, Shield, User, Clock, Globe } from 'lucide-react';

export default function AdminAuditLogsPage() {
  const { showToast } = useToast();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [actionFilter, setActionFilter] = useState('');

  useEffect(() => {
    fetchLogs(0);
  }, [actionFilter]);

  const fetchLogs = async (pageNumber = 0) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', pageNumber);
      params.append('size', 15);
      if (actionFilter) params.append('action', actionFilter);

      const res = await api.get(`/admin/audit-logs?${params.toString()}`);
      const data = res.data;
      setLogs(data.content || []);
      setTotalPages(data.totalPages || 1);
      setPage(pageNumber);
    } catch (error) {
      showToast('Failed to load audit logs', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity size={24} className="text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Security & Audit Logs</h1>
          </div>
          <p className="text-sm text-gray-500">
            Immutable transaction records tracking user authentications, permission modifications, job statuses, and verifications.
          </p>
        </div>

        <div className="w-52">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="select text-xs py-2 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            <option value="">All Security Events</option>
            <option value="USER_LOGIN">USER_LOGIN</option>
            <option value="USER_REGISTER">USER_REGISTER</option>
            <option value="JOB_CREATED">JOB_CREATED</option>
            <option value="JOB_EXPIRED">JOB_EXPIRED</option>
            <option value="EMPLOYER_VERIFIED">EMPLOYER_VERIFIED</option>
            <option value="STATUS_CHANGE">STATUS_CHANGE</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      {loading ? (
        <LoadingSpinner text="Querying secure audit ledger..." />
      ) : logs.length === 0 ? (
        <div className="card p-12 text-center text-gray-500">
          <Shield size={36} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
          <p className="text-sm font-semibold">No audit events found.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-500 font-semibold border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action Event</th>
                  <th className="py-3 px-4">Actor / Email</th>
                  <th className="py-3 px-4">Target Entity</th>
                  <th className="py-3 px-4">Details / Metadata</th>
                  <th className="py-3 px-4">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 font-mono">
                {logs.map(l => (
                  <tr key={l.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                    <td className="py-3 px-4 text-gray-500 whitespace-nowrap">
                      {new Date(l.createdAt).toLocaleString()}
                    </td>

                    <td className="py-3 px-4">
                      <span className="badge bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 text-[10px] px-2 py-0.5 rounded font-bold">
                        {l.action}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-sans text-gray-800 dark:text-gray-200">
                      {l.userEmail || (l.userId ? `User #${l.userId}` : 'SYSTEM_CRON')}
                    </td>

                    <td className="py-3 px-4 text-gray-500">
                      {l.entityType ? `${l.entityType} #${l.entityId}` : 'N/A'}
                    </td>

                    <td className="py-3 px-4 font-sans text-gray-600 dark:text-gray-300 max-w-xs truncate">
                      {l.details || '—'}
                    </td>

                    <td className="py-3 px-4 text-gray-400 whitespace-nowrap">
                      {l.ipAddress || '127.0.0.1'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 border-t border-gray-100 dark:border-gray-800">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => fetchLogs(p)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
