import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import {
  Briefcase, PlusCircle, Users, Edit, Trash2,
  RefreshCw, CheckCircle, Clock, Eye, AlertCircle, Calendar, Info
} from 'lucide-react';

export default function EmployerJobsPage() {
  const { showToast } = useToast();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/jobs/employer/my-jobs');
      setJobs(res.data || []);
    } catch (error) {
      showToast('Failed to load your job postings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      await api.patch(`/jobs/${jobId}/status?status=${newStatus}`);
      showToast(`Job status updated to ${newStatus}`, 'success');
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: newStatus } : j));
    } catch (error) {
      showToast('Failed to update job status', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await api.delete(`/jobs/${deleteTargetId}`);
      showToast('Job posting deleted successfully', 'success');
      setJobs(prev => prev.filter(j => j.id !== deleteTargetId));
    } catch (error) {
      showToast('Failed to delete job', 'error');
    } finally {
      setIsDeleteOpen(false);
      setDeleteTargetId(null);
    }
  };

  const filtered = jobs.filter(j => {
    if (filterStatus === 'ALL') return true;
    return j.status === filterStatus;
  });

  const statuses = ['ALL', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'DRAFT', 'CLOSED', 'EXPIRED'];

  if (loading) {
    return <LoadingSpinner text="Loading posted vacancies..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Vacancies</h1>
          <p className="text-sm text-gray-500">
            Post vacancies for admin review, track candidate submissions, and manage job listings. <span className="text-amber-600 font-medium">New jobs require admin approval before appearing publicly.</span>
          </p>
        </div>
        <Link to="/employer/jobs/new" className="btn btn-primary flex items-center gap-1.5 self-start sm:self-auto shadow">
          <PlusCircle size={16} /> Post New Job
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
        {statuses.map(st => {
          const count = st === 'ALL' ? jobs.length : jobs.filter(j => j.status === st).length;
          return (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                filterStatus === st
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              {st} ({count})
            </button>
          );
        })}
      </div>

      {/* Info message about approval process */}
      {filterStatus === 'PENDING_REVIEW' && jobs.length > 0 && (
        <div className="card p-4 bg-amber-50 dark:bg-amber-950/30 border-l-4 border-l-amber-500">
          <div className="flex items-start gap-3">
            <Info size={18} className="text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Admin Review Required</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Your job postings are currently pending admin approval. Once approved by administrators, they will become visible to candidates on the public job listing page.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Jobs List */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <Briefcase className="mx-auto text-gray-300 dark:text-gray-600 mb-3" size={40} />
          <h3 className="font-bold text-gray-800 dark:text-gray-200">No vacancies found</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            There are currently no job postings matching the selected filter. Post your first job to get started!
          </p>
          <div className="mt-4">
            <Link to="/employer/jobs/new" className="btn btn-sm btn-primary">
              Create Job Listing
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(job => (
            <div key={job.id} className="card p-5 border border-gray-200 dark:border-gray-800 hover:shadow-md transition">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {job.title}
                    </h3>
                    <StatusBadge status={job.status} />
                    <span className="badge badge-secondary text-xs">{job.jobType}</span>
                    {job.status === 'PENDING_REVIEW' && (
                      <span className="badge bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full font-medium">
                        Awaiting Approval
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                    <span>{job.department || 'General'}</span>
                    <span>•</span>
                    <span>{job.location || 'Colombo'}</span>
                    <span>•</span>
                    <span>Level: {job.experienceLevel || 'Mid-Level'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> Deadline: {new Date(job.deadline).toLocaleDateString()}
                    </span>
                  </div>

                  {job.requiredSkills && job.requiredSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {job.requiredSkills.map(sk => (
                        <span key={sk.id || sk.name} className="badge bg-blue-50 dark:bg-blue-950/40 text-primary-700 dark:text-primary-300 text-[10px] px-2 py-0.5 rounded">
                          {sk.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right controls */}
                <div className="flex flex-wrap items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0">
                  <Link 
                    to={`/employer/jobs/${job.id}/applicants`}
                    className="btn btn-sm btn-primary flex items-center gap-1 shadow"
                  >
                    <Users size={14} /> Applicants ({job.applicantCount || 0})
                  </Link>

                  <Link 
                    to={`/employer/jobs/${job.id}/edit`}
                    className="btn btn-sm btn-outline flex items-center gap-1"
                    title="Edit Job"
                  >
                    <Edit size={14} /> Edit
                  </Link>

                  <Link 
                    to={`/jobs/${job.id}`}
                    className="btn btn-sm btn-outline flex items-center gap-1"
                    title="Public View"
                  >
                    <Eye size={14} />
                  </Link>

                  {job.status === 'APPROVED' ? (
                    <button
                      onClick={() => handleStatusChange(job.id, 'CLOSED')}
                      className="btn btn-sm btn-outline text-amber-600 border-amber-300 hover:bg-amber-50"
                      title="Close Job"
                    >
                      Close
                    </button>
                  ) : job.status === 'CLOSED' || job.status === 'EXPIRED' ? (
                    <button
                      onClick={() => handleStatusChange(job.id, 'APPROVED')}
                      className="btn btn-sm btn-outline text-emerald-600 border-emerald-300 hover:bg-emerald-50"
                      title="Reactivate Job"
                    >
                      Reopen
                    </button>
                  ) : job.status === 'PENDING_REVIEW' ? (
                    <span className="text-[10px] text-gray-400">Awaiting Review</span>
                  ) : null}

                  <button
                    onClick={() => {
                      setDeleteTargetId(job.id);
                      setIsDeleteOpen(true);
                    }}
                    className="btn btn-sm btn-danger p-2"
                    title="Delete Job"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Job Vacancy"
        message="Are you sure you want to permanently delete this job posting? This action cannot be reversed."
        confirmText="Yes, Delete"
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
