import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { Briefcase, Search, Building2, Trash2, Eye, ExternalLink, AlertTriangle } from 'lucide-react';

export default function AdminJobModerationPage() {
  const { showToast } = useToast();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    fetchJobs(0);
  }, [statusFilter]);

  const fetchJobs = async (pageNumber = 0) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', pageNumber);
      params.append('size', 10);

      const res = await api.get(`/admin/jobs/pending?${params.toString()}`);
      const data = res.data;
      setJobs(data.content || []);
      setTotalPages(data.totalPages || 1);
      setPage(pageNumber);
    } catch (error) {
      showToast('Failed to load vacancies for moderation', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      await api.post(`/admin/jobs/${jobId}/review`, {
        action: newStatus === 'APPROVED' ? 'APPROVE' : 'REJECT',
        rejectionReason: newStatus === 'REJECTED' ? 'Rejected by admin' : null
      });
      showToast(`Job status set to ${newStatus}`, 'success');
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: newStatus } : j));
    } catch (error) {
      showToast('Failed to change job status', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await api.delete(`/jobs/${deleteTargetId}`);
      showToast('Job listing permanently removed', 'success');
      setJobs(prev => prev.filter(j => j.id !== deleteTargetId));
    } catch (error) {
      showToast('Failed to delete job listing', 'error');
    } finally {
      setIsDeleteOpen(false);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Job Vacancy Moderation</h1>
          <p className="text-sm text-gray-500">
            Audit public listings across LankaHire, flag suspicious postings, and enforce quality guidelines.
          </p>
        </div>

        <div className="w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="select text-xs py-2 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            <option value="">All Statuses</option>
            <option value="PENDING_REVIEW">Pending Review</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Jobs Table */}
      {loading ? (
        <LoadingSpinner text="Loading jobs for moderation..." />
      ) : jobs.length === 0 ? (
        <div className="card p-12 text-center text-gray-500">
          <Briefcase size={36} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
          <p className="text-sm font-semibold">No vacancies found for moderation.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-500 font-semibold border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="py-3 px-4">Vacancy Title</th>
                  <th className="py-3 px-4">Employer / Organization</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Deadline</th>
                  <th className="py-3 px-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {jobs.map(job => (
                  <tr key={job.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                    <td className="py-3 px-4">
                      <p className="font-bold text-gray-900 dark:text-white">{job.title}</p>
                      <p className="text-[11px] text-gray-400">{job.jobType} • {job.department || 'General'}</p>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {job.companyName || 'Registered Enterprise'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-gray-500">
                      {job.location || 'Colombo'}
                    </td>

                    <td className="py-3 px-4">
                      <StatusBadge status={job.status} />
                    </td>

                    <td className="py-3 px-4 text-gray-400">
                      {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/jobs/${job.id}`}
                          className="btn btn-xs btn-outline p-1.5"
                          title="View Public Details"
                        >
                          <Eye size={12} />
                        </Link>

                        {job.status === 'PENDING_REVIEW' ? (
                          <button
                            onClick={() => handleStatusChange(job.id, 'APPROVED')}
                            className="btn btn-xs btn-outline text-emerald-600 border-emerald-300 hover:bg-emerald-50"
                            title="Approve Job"
                          >
                            Approve
                          </button>
                        ) : job.status === 'APPROVED' ? (
                          <button
                            onClick={() => handleStatusChange(job.id, 'REJECTED')}
                            className="btn btn-xs btn-outline text-rose-600 border-rose-300 hover:bg-rose-50"
                            title="Reject Job"
                          >
                            Reject
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(job.id, 'APPROVED')}
                            className="btn btn-xs btn-outline text-emerald-600 border-emerald-300 hover:bg-emerald-50"
                            title="Re-approve Job"
                          >
                            Re-approve
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setDeleteTargetId(job.id);
                            setIsDeleteOpen(true);
                          }}
                          className="btn btn-xs btn-danger p-1.5"
                          title="Permanently Delete Job"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
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
              onPageChange={(p) => fetchJobs(p)}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Permanently Remove Job Listing"
        message="Are you certain you want to purge this vacancy from LankaHire? All candidate applications for this vacancy will be removed."
        confirmText="Yes, Delete Job"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => {
          setIsDeleteOpen(false);
          setDeleteTargetId(null);
        }}
      />
    </div>
  );
}
