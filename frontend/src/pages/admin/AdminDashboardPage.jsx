import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import { 
  Users, Briefcase, Building2, ShieldCheck, AlertTriangle, 
  FileText, Activity, ArrowRight, CheckCircle, Clock
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { showToast } = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch (error) {
      showToast('Error loading platform metrics', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading system administration dashboard..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div 
        className="card text-white p-6 border-0 shadow-lg"
        style={{ background: 'linear-gradient(135deg, #111827 0%, #312e81 100%)' }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="badge" style={{ backgroundColor: 'rgba(129,140,248,0.25)', color: '#c7d2fe', marginBottom: '0.5rem', display: 'inline-block' }}>
              LankaHire Enterprise Governance
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
              Platform Master Administration
            </h1>
            <p style={{ color: '#a5b4fc', fontSize: '0.875rem', maxWidth: '560px' }}>
              System health, employer compliance, vacancy moderation, user accounts, and immutable audit logs.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link to="/admin/verifications" className="btn" style={{ backgroundColor: '#4f46e5', color: '#fff', fontWeight: 600, fontSize: '0.8125rem' }}>
              <ShieldCheck size={14} /> Pending Verifications
            </Link>
            <Link to="/admin/audit-logs" className="btn" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', fontWeight: 600, fontSize: '0.8125rem' }}>
              <Activity size={14} /> Audit Trail
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Total Registered Users', value: stats?.totalUsers || 0, icon: Users, bg: '#dbeafe', color: '#2563eb' },
          { label: 'Employers / Companies', value: stats?.totalEmployers || 0, icon: Building2, bg: '#ede9fe', color: '#7c3aed' },
          { label: 'Active Job Postings', value: stats?.activeJobs || 0, icon: Briefcase, bg: '#d1fae5', color: '#059669' },
          { label: 'Pending Complaints', value: stats?.pendingComplaints || stats?.openComplaints || 0, icon: AlertTriangle, bg: '#fef3c7', color: '#d97706' }
        ].map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: m.bg, color: m.color, borderRadius: 'var(--radius-lg)' }}>
                <Icon size={24} />
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>{m.label}</p>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-main)' }}>{m.value}</h3>
              </div>
            </div>
          );
        })}
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Admin Shortcuts & Health */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-5">
            <h3 className="font-bold text-gray-900 dark:text-white text-base pb-3 border-b border-gray-200 dark:border-gray-800 mb-4">
              Governance & Management Modules
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/admin/users" className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-primary-500 transition hover:shadow bg-gray-50/50 dark:bg-gray-850 flex items-start gap-3">
                <div className="p-2.5 bg-blue-100 text-blue-600 rounded-lg shrink-0">
                  <Users size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">User Directory & RBAC</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Manage 6 distinct roles, activate/suspend accounts, reset passwords.
                  </p>
                </div>
              </Link>

              <Link to="/admin/jobs" className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-primary-500 transition hover:shadow bg-gray-50/50 dark:bg-gray-850 flex items-start gap-3">
                <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-lg shrink-0">
                  <Briefcase size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">Job Vacancy Moderation</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Review published vacancies across Sri Lanka, flag fraudulent or expired posts.
                  </p>
                </div>
              </Link>

              <Link to="/admin/verifications" className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-primary-500 transition hover:shadow bg-gray-50/50 dark:bg-gray-850 flex items-start gap-3">
                <div className="p-2.5 bg-amber-100 text-amber-600 rounded-lg shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">Company Verification Queue</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Inspect uploaded Business Registration Certificates (BRC) and award verified badges.
                  </p>
                </div>
              </Link>

              <Link to="/admin/complaints" className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-primary-500 transition hover:shadow bg-gray-50/50 dark:bg-gray-850 flex items-start gap-3">
                <div className="p-2.5 bg-rose-100 text-rose-600 rounded-lg shrink-0">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">Complaints & Disputes</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Investigate reports submitted by job seekers or employers regarding platform misconduct.
                  </p>
                </div>
              </Link>
            </div>
          </div>

          {/* System Security & Integrity */}
          <div className="card p-5">
            <h3 className="font-bold text-gray-900 dark:text-white text-base pb-3 border-b border-gray-200 dark:border-gray-800 mb-3">
              Platform Integrity Status
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300">
                <span className="flex items-center gap-2">
                  <CheckCircle size={14} /> BCrypt 10-round salted password hashing active
                </span>
                <span className="font-semibold">SECURE</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300">
                <span className="flex items-center gap-2">
                  <CheckCircle size={14} /> Automated job expiration cron job running daily at midnight
                </span>
                <span className="font-semibold">ACTIVE</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300">
                <span className="flex items-center gap-2">
                  <CheckCircle size={14} /> Apache PDFBox server-side CV generation service
                </span>
                <span className="font-semibold">READY</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Quick Links & Summary */}
        <div className="space-y-6">
          <div className="card p-5">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm pb-3 border-b border-gray-200 dark:border-gray-800 mb-3">
              Quick Operations
            </h3>
            <div className="space-y-2">
              <Link to="/admin/verifications" className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300">
                <span>Review Pending BRCs</span>
                <span className="badge bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {stats?.pendingVerifications || stats?.pendingEmployers || 0}
                </span>
              </Link>

              <Link to="/admin/audit-logs" className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300">
                <span>View Security Audit Trail</span>
                <ArrowRight size={13} className="text-gray-400" />
              </Link>

              <Link to="/support/tickets" className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300">
                <span>Support Ticketing Queue</span>
                <span className="badge bg-rose-100 text-rose-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {stats?.openComplaints || stats?.pendingComplaints || 0}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
