import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import { 
  Briefcase, Users, Heart, Calendar, PlusCircle, 
  Search, ArrowRight, CheckCircle2, AlertCircle, Building2, Eye
} from 'lucide-react';

export default function EmployerDashboardPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [companyProfile, setCompanyProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [likedCandidates, setLikedCandidates] = useState([]);
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    fetchEmployerData();
  }, []);

  const fetchEmployerData = async () => {
    setLoading(true);
    try {
      // 1. Company Profile
      try {
        const pRes = await api.get('/employers/profile');
        setCompanyProfile(pRes.data);
      } catch (err) {
        console.warn('Could not fetch employer profile', err);
      }

      // 2. Jobs
      try {
        const jRes = await api.get('/jobs/employer/my-jobs');
        setJobs(jRes.data || []);
      } catch (err) {
        console.warn('Could not fetch jobs', err);
      }

      // 3. Liked Candidates
      try {
        const lRes = await api.get('/employers/candidates/liked');
        const data = lRes.data.content || lRes.data || [];
        setLikedCandidates(Array.isArray(data) ? data : []);
      } catch (err) {
        console.warn('Could not fetch liked candidates', err);
      }

      // 4. Interviews
      try {
        const iRes = await api.get('/interviews/employer');
        const data = iRes.data.content || iRes.data || [];
        setInterviews(Array.isArray(data) ? data : []);
      } catch (err) {
        console.warn('Could not fetch interviews', err);
      }
    } catch (error) {
      showToast('Error loading employer dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading employer dashboard..." />;
  }

  const activeJobs = jobs.filter(j => j.status === 'ACTIVE');
  const totalApplicants = jobs.reduce((acc, curr) => acc + (curr.applicantCount || 0), 0);
  const isVerified = companyProfile?.verificationStatus === 'VERIFIED';
  const isPending = companyProfile?.verificationStatus === 'PENDING';

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div 
        className="card text-white p-6 border-0 shadow-lg relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, var(--color-primary) 100%)' }}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge" style={{ backgroundColor: 'rgba(96,165,250,0.2)', color: '#bfdbfe', fontSize: '0.75rem' }}>
                Employer Portal
              </span>
              {isVerified ? (
                <span className="badge" style={{ backgroundColor: 'rgba(16,185,129,0.25)', color: '#a7f3d0' }}>
                  <CheckCircle2 size={12} /> Verified Enterprise
                </span>
              ) : isPending ? (
                <span className="badge" style={{ backgroundColor: 'rgba(245,158,11,0.25)', color: '#fde68a' }}>
                  <AlertCircle size={12} /> Verification Under Review
                </span>
              ) : (
                <span className="badge" style={{ backgroundColor: 'rgba(244,63,94,0.25)', color: '#fecdd3' }}>
                  <AlertCircle size={12} /> Unverified (Action Needed)
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
              {companyProfile?.companyName || user?.firstName || 'LankaHire Partner'}
            </h1>
            <p className="text-blue-100 text-sm max-w-xl">
              Post high-impact vacancies, review applications, like candidate profiles, and schedule seamless interviews.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link to="/employer/jobs/new" className="btn btn-primary" style={{ fontWeight: 600 }}>
              <PlusCircle size={16} /> Post New Job
            </Link>
            <Link to="/employer/candidates" className="btn" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', fontWeight: 600 }}>
              <Search size={16} /> Search Candidates
            </Link>
          </div>
        </div>
      </div>

      {/* Verification Notice if not verified */}
      {!isVerified && (
        <div className="card p-4 border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-950/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg text-amber-600">
              <AlertCircle size={24} />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                Complete Business Verification for Trusted Badge
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Upload your Business Registration Certificate (BRC) or proof of company registration to unlock top-tier candidate visibility.
              </p>
            </div>
          </div>
          <Link to="/employer/profile" className="btn btn-sm btn-primary shrink-0">
            Submit Documents
          </Link>
        </div>
      )}

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Active Postings', value: activeJobs.length, icon: Briefcase, bg: '#dbeafe', color: 'var(--color-primary)' },
          { label: 'Total Applicants', value: totalApplicants, icon: Users, bg: '#d1fae5', color: '#059669' },
          { label: 'Liked Candidates', value: likedCandidates.length, icon: Heart, bg: '#ffe4e6', color: '#e11d48' },
          { label: 'Interviews', value: interviews.length, icon: Calendar, bg: '#ede9fe', color: '#7c3aed' }
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
        {/* Left 2 Cols: Active Job Postings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-5">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800 mb-4">
              <div className="flex items-center gap-2">
                <Briefcase className="text-primary-600" size={20} />
                <h3 className="font-bold text-gray-900 dark:text-white">Active Vacancies</h3>
              </div>
              <Link to="/employer/jobs" className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                Manage All ({jobs.length}) <ArrowRight size={14} />
              </Link>
            </div>

            {jobs.length === 0 ? (
              <div className="text-center py-8">
                <Briefcase className="mx-auto text-gray-300 dark:text-gray-600 mb-2" size={36} />
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">No Jobs Posted Yet</h4>
                <p className="text-xs text-gray-500 mt-1 mb-4">Publish a vacancy to begin receiving candidate applications.</p>
                <Link to="/employer/jobs/new" className="btn btn-sm btn-primary">
                  Post Your First Job
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {jobs.slice(0, 5).map(job => (
                  <div key={job.id} className="p-3.5 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-primary-300 transition">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                          {job.title}
                        </h4>
                        <StatusBadge status={job.status} />
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {job.jobType} • {job.location || 'Colombo'} • Closes {new Date(job.deadline).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Link to={`/employer/jobs/${job.id}/applicants`} className="btn btn-xs btn-primary flex items-center gap-1">
                        <Users size={12} /> View Applicants ({job.applicantCount || 0})
                      </Link>
                      <Link to={`/jobs/${job.id}`} className="btn btn-xs btn-outline">
                        <Eye size={12} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Sourcing: Liked Candidates Preview */}
          <div className="card p-5">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800 mb-4">
              <div className="flex items-center gap-2">
                <Heart className="text-rose-500" size={20} />
                <h3 className="font-bold text-gray-900 dark:text-white">Favorited Talent Pool</h3>
              </div>
              <Link to="/employer/liked-candidates" className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                View All ({likedCandidates.length}) <ArrowRight size={14} />
              </Link>
            </div>

            {likedCandidates.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <Heart size={28} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                <p className="text-xs">Browse the candidate database and click the Heart icon to bookmark top candidates.</p>
                <Link to="/employer/candidates" className="btn btn-xs btn-outline mt-3">
                  Search Candidate Pool
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {likedCandidates.slice(0, 4).map(c => (
                  <div key={c.id} className="p-3 rounded-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800">
                    <h5 className="font-semibold text-gray-900 dark:text-white text-xs">
                      {c.fullName || 'Software Engineer'}
                    </h5>
                    <p className="text-[11px] text-gray-500 truncate">{c.headline || 'Full-Stack Developer'}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] text-gray-400">{c.location || 'Colombo'}</span>
                      <Link to={`/employer/candidates`} className="text-xs text-primary-600 hover:underline">
                        View Profile
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Upcoming Interviews & Quick Links */}
        <div className="space-y-6">
          {/* Upcoming Interviews */}
          <div className="card p-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800 mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="text-primary-600" size={18} />
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">Upcoming Interviews</h3>
              </div>
              <Link to="/employer/interviews" className="text-xs text-primary-600 hover:underline">
                Schedule
              </Link>
            </div>

            {interviews.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <Calendar className="mx-auto text-gray-300 dark:text-gray-600 mb-2" size={30} />
                <p className="text-xs">No interviews scheduled.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {interviews.slice(0, 3).map(i => (
                  <div key={i.id} className="p-3 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 text-xs">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {i.candidateName || 'Candidate Interview'}
                    </p>
                    <p className="text-gray-500 text-[11px]">{i.jobTitle}</p>
                    <p className="text-primary-600 font-medium text-[11px] mt-1">
                      {new Date(i.scheduledAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="card p-5">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm pb-3 border-b border-gray-200 dark:border-gray-800 mb-3">
              Employer Quick Actions
            </h3>
            <div className="space-y-2">
              <Link to="/employer/jobs/new" className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300">
                <span className="flex items-center gap-2">
                  <PlusCircle size={15} className="text-primary-600" /> Post New Vacancy
                </span>
                <ArrowRight size={13} className="text-gray-400" />
              </Link>

              <Link to="/employer/candidates" className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300">
                <span className="flex items-center gap-2">
                  <Search size={15} className="text-emerald-600" /> Source & Like Candidates
                </span>
                <ArrowRight size={13} className="text-gray-400" />
              </Link>

              <Link to="/employer/profile" className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300">
                <span className="flex items-center gap-2">
                  <Building2 size={15} className="text-blue-600" /> Company Profile & BRC
                </span>
                <ArrowRight size={13} className="text-gray-400" />
              </Link>

              <Link to="/messages" className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300">
                <span className="flex items-center gap-2">
                  <Users size={15} className="text-purple-600" /> Direct Candidate Chat
                </span>
                <ArrowRight size={13} className="text-gray-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
