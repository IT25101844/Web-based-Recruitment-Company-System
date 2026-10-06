import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin, DollarSign, Calendar, Building2, Briefcase, Award,
  ArrowLeft, CheckCircle, ShieldCheck
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorState } from '../../components/common/ErrorState';
import { Modal } from '../../components/common/Modal';
import { Select } from '../../components/common/Select';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export const JobDetailsPage = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Apply state
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { isAuthenticated, hasRole } = useAuth();
  const toast = useToast();

  const fetchJob = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/jobs/${id}`);
      setJob(res.data);
    } catch (err) {
      setError('Job vacancy not found or no longer active');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  const handleOpenApply = async () => {
    if (!isAuthenticated) {
      toast.info('Please log in as a candidate to apply');
      window.location.href = `/login?redirect=/jobs/${id}`;
      return;
    }
    if (!hasRole('JOB_SEEKER')) {
      toast.error('Only candidates can apply to job vacancies');
      return;
    }

    setIsApplyOpen(true);
    try {
      const res = await api.get('/candidates/profile');
      setResumes(res.data.resumes || []);
      if (res.data.resumes && res.data.resumes.length > 0) {
        setSelectedResumeId(res.data.resumes[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/applications', {
        jobId: job.id,
        resumeId: selectedResumeId ? Number(selectedResumeId) : null,
        coverLetter
      });
      toast.success('Your application has been submitted successfully!');
      setIsApplyOpen(false);
      setCoverLetter('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading vacancy details..." />;
  if (error || !job) return <ErrorState message={error} onRetry={fetchJob} />;

  const deadlineFormatted = job.deadline ? new Date(job.deadline).toLocaleDateString() : '';

  return (
    <div style={{ padding: '3rem 0', backgroundColor: 'var(--color-background)', minHeight: 'calc(100vh - 70px)' }}>
      <div className="container" style={{ maxWidth: '980px' }}>
        <Link to="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
          <ArrowLeft size={16} /> Back to Vacancies
        </Link>

        {/* Job Header Card */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
                fontWeight: 800,
                flexShrink: 0
              }}>
                {job.companyName ? job.companyName.charAt(0).toUpperCase() : 'J'}
              </div>
              <div>
                <h1 style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>{job.title}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', fontSize: '0.9375rem', color: 'var(--color-text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Building2 size={16} /> {job.companyName}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <MapPin size={16} color="var(--color-primary)" /> {job.location}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <StatusBadge status={job.jobType} />
              <Button variant="primary" size="lg" onClick={handleOpenApply}>
                Apply For Position
              </Button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1rem',
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--color-border-light)'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Salary</span>
              <div style={{ fontWeight: 700, color: 'var(--color-text-main)', marginTop: '0.15rem' }}>
                {job.salaryMin && job.salaryMax
                  ? `${job.currency} ${Number(job.salaryMin).toLocaleString()} - ${Number(job.salaryMax).toLocaleString()}`
                  : 'Negotiable'}
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Experience Level</span>
              <div style={{ fontWeight: 700, color: 'var(--color-text-main)', marginTop: '0.15rem' }}>
                {job.experienceLevel ? job.experienceLevel.replace('_', ' ') : 'Mid Level'}
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Application Deadline</span>
              <div style={{ fontWeight: 700, color: 'var(--color-text-main)', marginTop: '0.15rem' }}>
                {deadlineFormatted}
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Views</span>
              <div style={{ fontWeight: 700, color: 'var(--color-text-main)', marginTop: '0.15rem' }}>
                {job.viewsCount} views
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem', backgroundColor: '#ffffff' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--color-text-main)' }}>Job Description</h3>
          <p style={{ whiteSpace: 'pre-line', lineHeight: 1.7, color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
            {job.description}
          </p>

          {job.requirements && (
            <>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--color-text-main)' }}>Key Requirements & Qualifications</h3>
              <p style={{ whiteSpace: 'pre-line', lineHeight: 1.7, color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                {job.requirements}
              </p>
            </>
          )}

          {job.requiredSkills && job.requiredSkills.length > 0 && (
            <>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--color-text-main)' }}>Desired Skills</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
                {job.requiredSkills.map((sk, i) => (
                  <span key={i} className="badge badge-info" style={{ fontSize: '0.8125rem', padding: '0.35rem 0.75rem' }}>
                    {sk}
                  </span>
                ))}
              </div>
            </>
          )}

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--color-border-light)'
          }}>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              Posted by verified recruiter at {job.companyName}
            </span>
            <Button variant="primary" size="md" onClick={handleOpenApply}>
              Apply Now
            </Button>
          </div>
        </div>

        {/* Apply Modal */}
        <Modal
          isOpen={isApplyOpen}
          onClose={() => setIsApplyOpen(false)}
          title={`Apply for ${job.title}`}
        >
          <form onSubmit={handleSubmitApplication}>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
              Your application will be sent directly to the hiring team at <strong>{job.companyName}</strong>.
            </p>

            {resumes.length > 0 ? (
              <Select
                label="Choose Resume"
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                options={resumes.map((r) => ({
                  value: r.id,
                  label: `${r.originalFilename} (Uploaded ${new Date(r.uploadedAt).toLocaleDateString()})`
                }))}
                required
              />
            ) : (
              <div style={{
                padding: '0.875rem',
                backgroundColor: 'var(--warning-light)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8125rem',
                color: 'var(--warning-text)',
                marginBottom: '1rem'
              }}>
                No uploaded resume found. Your profile data will be submitted as your digital application.
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="coverLetter">Cover Letter (Optional)</label>
              <textarea
                id="coverLetter"
                className="form-input"
                rows={4}
                placeholder="Share any details on why you are interested in this position..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <Button variant="outline" onClick={() => setIsApplyOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary" loading={submitting}>Submit Application</Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default JobDetailsPage;
