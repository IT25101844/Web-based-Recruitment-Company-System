import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, MapPin, DollarSign, Briefcase } from 'lucide-react';
import { JobCard } from '../../components/domain/JobCard';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Pagination } from '../../components/common/Pagination';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export const JobListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);

  // Filter States
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [skill, setSkill] = useState(searchParams.get('skill') || '');
  const [jobType, setJobType] = useState(searchParams.get('jobType') || '');
  const [expLevel, setExpLevel] = useState(searchParams.get('expLevel') || '');

  // Apply Modal State
  const [selectedJob, setSelectedJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { isAuthenticated, hasRole, user } = useAuth();
  const toast = useToast();

  const fetchJobs = async (page = 0) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keyword) params.append('keyword', keyword);
      if (location) params.append('location', location);
      if (skill) params.append('skill', skill);
      if (jobType) params.append('jobType', jobType);
      if (expLevel) params.append('expLevel', expLevel);
      params.append('page', page);
      params.append('size', 9);

      const res = await api.get(`/jobs?${params.toString()}`);
      setJobs(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
      setCurrentPage(res.data.number || 0);
    } catch (err) {
      console.error('Error fetching jobs', err);
      toast.error('Failed to load vacancies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(0);
  }, []);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchJobs(0);
  };

  const handleOpenApply = async (job) => {
    if (!isAuthenticated) {
      toast.info('Please log in as a candidate to apply for vacancies');
      window.location.href = `/login?redirect=/jobs/${job.id}`;
      return;
    }
    if (!hasRole('JOB_SEEKER')) {
      toast.error('Only candidate accounts can submit job applications');
      return;
    }

    setSelectedJob(job);
    try {
      const res = await api.get('/candidates/profile');
      setResumes(res.data.resumes || []);
      if (res.data.resumes && res.data.resumes.length > 0) {
        setSelectedResumeId(res.data.resumes[0].id);
      }
    } catch (err) {
      console.error('Could not load resumes', err);
    }
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/applications', {
        jobId: selectedJob.id,
        resumeId: selectedResumeId ? Number(selectedResumeId) : null,
        coverLetter
      });
      toast.success('Application successfully submitted! The employer has been notified.');
      setSelectedJob(null);
      setCoverLetter('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '2.5rem 0', backgroundColor: 'var(--color-background)', minHeight: 'calc(100vh - 70px)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.35rem' }}>Explore Opportunities</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Search open technology positions with LankaHire's corporate partners
          </p>
        </div>

        {/* Search & Filter Bar */}
        <form
          onSubmit={handleFilterSubmit}
          className="card"
          style={{ padding: '1.25rem', marginBottom: '2rem', backgroundColor: '#ffffff' }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            alignItems: 'flex-end'
          }}>
            <Input
              label="Keywords"
              placeholder="Title, skill, etc."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              icon={Search}
            />
            <Input
              label="Location"
              placeholder="e.g. Colombo, Hybrid"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              icon={MapPin}
            />
            <Select
              label="Job Type"
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              placeholder="All Job Types"
              options={[
                { value: 'FULL_TIME', label: 'Full Time' },
                { value: 'PART_TIME', label: 'Part Time' },
                { value: 'CONTRACT', label: 'Contract' },
                { value: 'INTERNSHIP', label: 'Internship' },
                { value: 'REMOTE', label: 'Remote' }
              ]}
            />
            <Select
              label="Experience Level"
              value={expLevel}
              onChange={(e) => setExpLevel(e.target.value)}
              placeholder="All Levels"
              options={[
                { value: 'ENTRY_LEVEL', label: 'Entry Level' },
                { value: 'MID_LEVEL', label: 'Mid Level' },
                { value: 'SENIOR_LEVEL', label: 'Senior Level' },
                { value: 'EXECUTIVE', label: 'Executive' }
              ]}
            />
            <div>
              <Button type="submit" variant="primary" style={{ width: '100%', height: '42px' }}>
                <Filter size={16} /> Filter Results
              </Button>
            </div>
          </div>
        </form>

        {/* Job Results Grid */}
        {loading ? (
          <LoadingSpinner text="Searching vacancies..." />
        ) : jobs.length === 0 ? (
          <EmptyState
            title="No vacancies match your criteria"
            message="Try widening your search filters or clear location and skill constraints."
            actionLabel="Clear Filters"
            onAction={() => {
              setKeyword('');
              setLocation('');
              setSkill('');
              setJobType('');
              setExpLevel('');
              fetchJobs(0);
            }}
          />
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.5rem'
            }}>
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} onApply={handleOpenApply} />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(p) => fetchJobs(p)}
            />
          </>
        )}

        {/* Apply Modal */}
        {selectedJob && (
          <Modal
            isOpen={!!selectedJob}
            onClose={() => setSelectedJob(null)}
            title={`Apply for ${selectedJob.title}`}
          >
            <form onSubmit={handleSubmitApplication}>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
                Applying to <strong>{selectedJob.companyName}</strong> ({selectedJob.location})
              </p>

              {resumes.length > 0 ? (
                <Select
                  label="Select Resume"
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
                  You have not uploaded a resume yet. Your full candidate profile will be submitted. You can also upload a CV from your profile page.
                </div>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="coverLetter">
                  Cover Letter / Note to Hiring Manager (Optional)
                </label>
                <textarea
                  id="coverLetter"
                  className="form-input"
                  rows={4}
                  placeholder="Introduce yourself and explain why you are the ideal fit for this role..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <Button variant="outline" onClick={() => setSelectedJob(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" loading={submitting}>
                  Submit Application
                </Button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default JobListingPage;
