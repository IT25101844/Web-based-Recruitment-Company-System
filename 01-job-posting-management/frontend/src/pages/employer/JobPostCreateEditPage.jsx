import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ArrowLeft, Save, Briefcase, DollarSign, Calendar, MapPin, Tag } from 'lucide-react';

export default function JobPostCreateEditPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [availableSkills, setAvailableSkills] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    department: '',
    description: '',
    requirements: '',
    location: 'Colombo, Sri Lanka',
    jobType: 'FULL_TIME',
    experienceLevel: 'MID_LEVEL',
    salaryMin: '',
    salaryMax: '',
    deadline: '',
    status: 'PENDING_REVIEW',
    skillIds: []
  });

  useEffect(() => {
    fetchInitialData();
  }, [id]);

  const fetchInitialData = async () => {
    try {
      // 1. Fetch all skills
      try {
        const sRes = await api.get('/skills');
        setAvailableSkills(sRes.data || []);
      } catch (err) {
        console.warn('Skills load error', err);
      }

      // 2. If editing, fetch job
      if (isEdit) {
        const jRes = await api.get(`/jobs/public/${id}`);
        const data = jRes.data;
        setFormData({
          title: data.title || '',
          department: data.department || '',
          description: data.description || '',
          requirements: data.requirements || '',
          location: data.location || '',
          jobType: data.jobType || 'FULL_TIME',
          experienceLevel: data.experienceLevel || 'MID_LEVEL',
          salaryMin: data.salaryMin || '',
          salaryMax: data.salaryMax || '',
          deadline: data.deadline ? data.deadline.substring(0, 10) : '',
          status: data.status || 'ACTIVE',
          skillIds: data.requiredSkills ? data.requiredSkills.map(s => s.id) : []
        });
      } else {
        // Set default deadline 30 days from today
        const nextMonth = new Date();
        nextMonth.setDate(nextMonth.getDate() + 30);
        setFormData(prev => ({
          ...prev,
          deadline: nextMonth.toISOString().substring(0, 10)
        }));
      }
    } catch (error) {
      showToast('Error loading job details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillToggle = (skillId) => {
    setFormData(prev => {
      const exists = prev.skillIds.includes(skillId);
      if (exists) {
        return { ...prev, skillIds: prev.skillIds.filter(x => x !== skillId) };
      } else {
        return { ...prev, skillIds: [...prev.skillIds, skillId] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.deadline) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        salaryMin: formData.salaryMin ? Number(formData.salaryMin) : null,
        salaryMax: formData.salaryMax ? Number(formData.salaryMax) : null,
        deadline: formData.deadline.length === 10 ? `${formData.deadline}T23:59:59` : formData.deadline
      };

      if (isEdit) {
        await api.put(`/jobs/${id}`, payload);
        showToast('Job posting updated successfully', 'success');
      } else {
        await api.post('/jobs', payload);
        showToast('Job posting submitted for admin review!', 'success');
      }
      navigate('/employer/jobs');
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to save job posting', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading vacancy editor..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/employer/jobs" className="btn btn-outline btn-sm p-2">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEdit ? 'Edit Vacancy' : 'Post a New Vacancy'}
          </h1>
          <p className="text-xs text-gray-500">
            Publish your job requirements to connect with verified Sri Lankan talent.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-6">
        {/* Basic Details */}
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
            <Briefcase size={18} className="text-primary-600" /> Vacancy Overview
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Job Title *"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Senior Full-Stack Java Engineer"
                required
              />
            </div>

            <Input
              label="Department / Team"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="e.g. Engineering, Product, Marketing"
            />

            <Input
              label="Location / Mode *"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Colombo (Hybrid), Remote"
              required
            />

            <Select
              label="Employment Type *"
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              options={[
                { value: 'FULL_TIME', label: 'Full Time' },
                { value: 'PART_TIME', label: 'Part Time' },
                { value: 'CONTRACT', label: 'Contract' },
                { value: 'INTERNSHIP', label: 'Internship' },
                { value: 'REMOTE', label: 'Fully Remote' }
              ]}
            />

            <Select
              label="Experience Level *"
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleChange}
              options={[
                { value: 'ENTRY_LEVEL', label: 'Entry Level (0-2 years)' },
                { value: 'MID_LEVEL', label: 'Mid Level (2-5 years)' },
                { value: 'SENIOR_LEVEL', label: 'Senior Level (5+ years)' },
                { value: 'LEAD', label: 'Lead / Principal' },
                { value: 'EXECUTIVE', label: 'Executive / Director' }
              ]}
            />
          </div>
        </div>

        {/* Compensation & Deadline */}
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
            <DollarSign size={18} className="text-emerald-600" /> Compensation & Timeline
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Minimum Salary (LKR)"
              name="salaryMin"
              type="number"
              value={formData.salaryMin}
              onChange={handleChange}
              placeholder="e.g. 150000"
            />

            <Input
              label="Maximum Salary (LKR)"
              name="salaryMax"
              type="number"
              value={formData.salaryMax}
              onChange={handleChange}
              placeholder="e.g. 250000"
            />

            <Input
              label="Application Deadline *"
              name="deadline"
              type="date"
              value={formData.deadline}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Job Descriptions & Requirements */}
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-800">
            Description & Key Responsibilities
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Role Description *
              </label>
              <textarea
                name="description"
                rows={5}
                value={formData.description}
                onChange={handleChange}
                placeholder="Detail what the candidate will be doing day-to-day, team goals, and company mission..."
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Required Qualifications & Qualifications
              </label>
              <textarea
                name="requirements"
                rows={4}
                value={formData.requirements}
                onChange={handleChange}
                placeholder="Bullet points of necessary skills, degree requirements, or certifications..."
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Skills Picker */}
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3 pb-2 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
            <Tag size={18} className="text-purple-600" /> Target Skills & Technologies
          </h3>
          <p className="text-xs text-gray-500 mb-3">
            Click to select the skills that candidates should have for this position:
          </p>

          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-850">
            {availableSkills.map(sk => {
              const selected = formData.skillIds.includes(sk.id);
              return (
                <button
                  type="button"
                  key={sk.id}
                  onClick={() => handleSkillToggle(sk.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                    selected
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary-400'
                  }`}
                >
                  {selected ? '✓ ' : '+ '} {sk.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Publication Status */}
        <div className="pt-2 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="w-full sm:w-60">
            <Select
              label="Post Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={[
                { value: 'PENDING_REVIEW', label: 'Submit for Review (Recommended)' },
                { value: 'DRAFT', label: 'Draft (Keep hidden)' }
              ]}
            />
          </div>

          <div className="flex gap-3">
            <Link to="/employer/jobs" className="btn btn-outline">
              Cancel
            </Link>
            <Button
              type="submit"
              variant="primary"
              loading={submitting}
              className="flex items-center gap-2 shadow"
            >
              <Save size={16} /> {isEdit ? 'Save Changes' : 'Submit for Review'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
