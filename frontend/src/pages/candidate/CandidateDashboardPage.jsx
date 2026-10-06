import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import ProfileProgressBar from '../../components/common/ProfileProgressBar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import { 
  Briefcase, Heart, Calendar, FileText, ArrowRight, 
  MapPin, DollarSign, Clock, CheckCircle, AlertCircle, Building2
} from 'lucide-react';

export default function CandidateDashboardPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [likedCount, setLikedCount] = useState(0);
  const [interviews, setInterviews] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch profile
      try {
        const pRes = await api.get('/candidates/profile/me');
        setProfile(pRes.data);
      } catch (err) {
        console.warn('Could not fetch candidate profile', err);
      }

      // 2. Fetch recent applications
      try {
        const appRes = await api.get('/applications/my-applications');
        setApplications(appRes.data || []);
      } catch (err) {
        console.warn('Could not fetch applications', err);
      }

      // 3. Fetch liked count
      try {
        const likesRes = await api.get('/candidates/my-likes');
        setLikedCount(Array.isArray(likesRes.data) ? likesRes.data.length : 0);
      } catch (err) {
        console.warn('Could not fetch likes', err);
      }

      // 4. Fetch interviews
      try {
        const intRes = await api.get('/interviews/my-interviews');
        setInterviews(intRes.data || []);
      } catch (err) {
        console.warn('Could not fetch interviews', err);
      }

      // 5. Fetch recommended jobs
      try {
        const jobsRes = await api.get('/jobs?size=4');
        setRecommendedJobs(jobsRes.data?.content || []);
      } catch (err) {
        console.warn('Could not fetch recommended jobs', err);
      }
    } catch (error) {
      showToast('Error loading dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading candidate dashboard..." />;
  }

  const completionPercentage = profile?.profileCompletionPct ?? profile?.profileCompletionPercentage ?? 0;
  const recentApps = applications.slice(0, 4);
  const upcomingInterviews = interviews.filter(i => i.status === 'SCHEDULED').slice(0, 3);

  const candidateDisplayName = user?.fullName?.split(' ')[0] || user?.firstName || profile?.fullName?.split(' ')[0] || 'Candidate';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Welcome Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #0f172a 0%, var(--color-primary) 100%)',
        color: '#ffffff',
        padding: '2rem',
        border: 'none',
        borderRadius: 'var(--radius-xl)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#bfdbfe', marginBottom: '0.75rem', display: 'inline-block' }}>
              Job Seeker Portal
            </span>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.35rem' }}>
              Welcome back, {candidateDisplayName}!
            </h1>
            <p style={{ color: '#93c5fd', fontSize: '0.875rem', maxWidth: '560px' }}>
              Track your applications, interview invitations, and profile views from top Sri Lankan employers in real time.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/candidate/profile" className="btn" style={{ backgroundColor: '#fff', color: 'var(--color-primary)', fontWeight: 600 }}>
              Edit Profile
            </Link>
            <Link to="/jobs" className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}>
              Explore Jobs
            </Link>
          </div>
        </div>
      </div>

      {/* Completion Alert if < 100 */}
      {completionPercentage < 100 && (
        <div className="card" style={{
          padding: '1.25rem',
          borderLeft: '4px solid var(--color-warning)',
          backgroundColor: '#fffbeb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.5rem', backgroundColor: '#fef3c7', borderRadius: 'var(--radius-md)', color: '#d97706' }}>
              <AlertCircle size={24} />
            </div>
            <div>
              <h4 style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-main)' }}>
                Your profile is {completionPercentage}% complete!
              </h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Candidates with 100% completed profiles get up to 4x more employer likes and interview invites.
              </p>
            </div>
          </div>
          <div style={{ width: '240px', flexShrink: 0 }}>
            <ProfileProgressBar percentage={completionPercentage} />
          </div>
          <Link to="/candidate/profile" className="btn btn-sm btn-primary" style={{ flexShrink: 0 }}>
            Complete Profile
          </Link>
        </div>
      )}

      {/* Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Applied Jobs', value: applications.length, icon: Briefcase, bg: '#dbeafe', color: 'var(--color-primary)' },
          { label: 'Employer Likes', value: likedCount, icon: Heart, bg: '#ffe4e6', color: '#e11d48' },
          { label: 'Interviews', value: interviews.length, icon: Calendar, bg: '#fef3c7', color: '#d97706' },
          { label: 'Profile Score', value: `${completionPercentage}%`, icon: CheckCircle, bg: '#d1fae5', color: '#059669' }
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

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Left: Recent Applications */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border-light)', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Briefcase size={20} color="var(--color-primary)" />
                <h3 style={{ fontWeight: 700, color: 'var(--color-text-main)', fontSize: '1rem' }}>Recent Job Applications</h3>
              </div>
              <Link to="/candidate/applications" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                View All ({applications.length}) <ArrowRight size={14} />
              </Link>
            </div>

            {recentApps.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ width: 48, height: 48, backgroundColor: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', color: 'var(--color-text-light)' }}>
                  <Briefcase size={22} />
                </div>
                <h4 style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-main)' }}>No applications submitted yet</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: '0.25rem 0 1rem' }}>Explore verified job openings and submit your first application today!</p>
                <Link to="/jobs" className="btn btn-sm btn-primary">Browse Open Vacancies</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {recentApps.map((app) => (
                  <div key={app.id} style={{
                    padding: '0.875rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border-light)',
                    backgroundColor: '#f8fafc',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '0.75rem',
                    transition: 'border-color var(--transition-fast)'
                  }}>
                    <div>
                      <h4 style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-main)' }}>
                        {app.jobTitle || 'Software Position'}
                      </h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Building2 size={12} /> {app.companyName || 'Verified Employer'}
                        </span>
                        <span>•</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Clock size={12} /> Applied {new Date(app.appliedAt).toLocaleDateString()}
                        </span>
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <StatusBadge status={app.status} />
                      <Link to={`/jobs/${app.jobId}`} style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 500 }}>View Job</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommended Jobs */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border-light)', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Briefcase size={20} color="#059669" />
                <h3 style={{ fontWeight: 700, color: 'var(--color-text-main)', fontSize: '1rem' }}>Recommended Jobs for You</h3>
              </div>
              <Link to="/jobs" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                Explore More <ArrowRight size={14} />
              </Link>
            </div>

            {recommendedJobs.length === 0 ? (
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', padding: '1rem 0', textAlign: 'center' }}>No active postings right now.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
                {recommendedJobs.map((job) => (
                  <div key={job.id} style={{ padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-light)', backgroundColor: 'var(--color-surface)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <h4 style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.title}</h4>
                      <span className="badge">{job.jobType || 'Full-time'}</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Building2 size={12} /> {job.companyName || 'Lanka Employer'}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem', fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={11} /> {job.location || 'Colombo'}</span>
                      {job.salaryMin && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><DollarSign size={11} /> LKR {job.salaryMin?.toLocaleString()}</span>
                      )}
                    </div>
                    <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.65rem', color: 'var(--color-text-light)' }}>Closes {new Date(job.deadline).toLocaleDateString()}</span>
                      <Link to={`/jobs/${job.id}`} className="btn btn-sm btn-primary">Apply Now</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Upcoming Interviews & Quick Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Upcoming Interviews */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--color-border-light)', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={18} color="var(--color-primary)" />
                <h3 style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-text-main)' }}>Scheduled Interviews</h3>
              </div>
              <Link to="/candidate/interviews" style={{ fontSize: '0.75rem', color: 'var(--color-primary)' }}>All ({interviews.length})</Link>
            </div>

            {upcomingInterviews.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--color-text-muted)' }}>
                <Calendar size={32} color="var(--color-text-light)" style={{ margin: '0 auto 0.5rem' }} />
                <p style={{ fontSize: '0.75rem' }}>No upcoming interviews currently scheduled.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {upcomingInterviews.map((inv) => (
                  <div key={inv.id} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #dbeafe', backgroundColor: '#eff6ff' }}>
                    <p style={{ fontWeight: 600, fontSize: '0.75rem', color: 'var(--color-text-main)' }}>{inv.jobTitle || 'Interview Round'}</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{new Date(inv.scheduledAt).toLocaleString()}</p>
                    <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span className="badge badge-info">{inv.interviewType || 'ONLINE'}</span>
                      {inv.meetingLink ? (
                        <a href={inv.meetingLink} target="_blank" rel="noreferrer" className="btn btn-sm btn-primary">Join Meeting</a>
                      ) : (
                        <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>{inv.location || 'Online'}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions Card */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-text-main)', paddingBottom: '0.75rem', borderBottom: '1px solid var(--color-border-light)', marginBottom: '0.75rem' }}>
              Candidate Quick Actions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {[
                { to: '/candidate/profile', label: 'Update Experience & CV', icon: FileText, iconColor: 'var(--color-primary)' },
                { to: '/candidate/liked-by', label: 'Employers Interested in You', icon: Heart, iconColor: '#e11d48', badge: likedCount },
                { to: '/messages', label: 'Direct Employer Chats', icon: Clock, iconColor: '#d97706' },
                { to: '/support/new', label: 'File Support Ticket', icon: AlertCircle, iconColor: '#059669' }
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <Link key={i} to={item.to} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.625rem', borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-muted)',
                    textDecoration: 'none', transition: 'background-color var(--transition-fast)'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Icon size={16} color={item.iconColor} /> {item.label}
                    </span>
                    {item.badge !== undefined ? (
                      <span className="badge badge-danger" style={{ fontSize: '0.65rem' }}>{item.badge}</span>
                    ) : (
                      <ArrowRight size={14} color="var(--color-text-light)" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
