import React, { useState, useEffect } from 'react';
import {
  User, MapPin, Mail, Phone, FileText, Plus, Trash2, Edit3, Download,
  Heart, Upload, Check, X, Award, Briefcase, GraduationCap, Sparkles
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { ProfileProgressBar } from '../../components/common/ProfileProgressBar';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export const CandidateProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exportingPdf, setExportingPdf] = useState(false);

  // Edit Personal Info State
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [personalForm, setPersonalForm] = useState({
    fullName: '',
    phone: '',
    headline: '',
    location: '',
    address: '',
    professionalSummary: ''
  });
  const [savingPersonal, setSavingPersonal] = useState(false);

  // Education Modal State
  const [eduModalOpen, setEduModalOpen] = useState(false);
  const [editingEduId, setEditingEduId] = useState(null);
  const [eduForm, setEduForm] = useState({
    qualification: '',
    institution: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    description: ''
  });
  const [savingEdu, setSavingEdu] = useState(false);

  // Experience Modal State
  const [expModalOpen, setExpModalOpen] = useState(false);
  const [editingExpId, setEditingExpId] = useState(null);
  const [expForm, setExpForm] = useState({
    jobTitle: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  });
  const [savingExp, setSavingExp] = useState(false);

  // Skill Add State
  const [skillName, setSkillName] = useState('');
  const [skillProficiency, setSkillProficiency] = useState('INTERMEDIATE');
  const [savingSkill, setSavingSkill] = useState(false);

  // Resume Upload State
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);

  // Confirm delete dialog
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, type: '', id: null });

  const toast = useToast();

  const fetchProfile = async () => {
    try {
      const res = await api.get('/candidates/profile/me');
      setProfile(res.data);
      setPersonalForm({
        fullName: res.data.fullName || '',
        phone: res.data.phone || '',
        headline: res.data.headline || '',
        location: res.data.location || '',
        address: res.data.address || '',
        professionalSummary: res.data.professionalSummary || ''
      });
    } catch (err) {
      toast.error('Failed to load profile details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // 1. Export PDF Handler
  const handleExportPdf = async () => {
    if (!profile) return;
    setExportingPdf(true);
    try {
      const candidateId = profile.id || profile.userId;
      if (!candidateId) {
        toast.error('Unable to determine candidate ID for PDF generation');
        return;
      }
      const res = await api.get(`/candidates/${candidateId}/profile/pdf`, {
        responseType: 'blob'
      });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const safeName = (profile.fullName || 'Candidate').replace(/\s+/g, '_');
      link.setAttribute('download', `${safeName}_JobConnect_CV.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Professional CV PDF exported successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Unable to generate your CV right now. Please try again.');
    } finally {
      setExportingPdf(false);
    }
  };

  // 2. Personal Info Save
  const handleSavePersonal = async (e) => {
    e.preventDefault();
    setSavingPersonal(true);
    try {
      const res = await api.put(`/candidates/${profile.id}/personal-info`, personalForm);
      setProfile(res.data);
      setIsEditingPersonal(false);
      toast.success('Personal details updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update personal information');
    } finally {
      setSavingPersonal(false);
    }
  };

  // 3. Education Actions
  const handleOpenAddEdu = () => {
    setEditingEduId(null);
    setEduForm({ qualification: '', institution: '', fieldOfStudy: '', startDate: '', endDate: '', description: '' });
    setEduModalOpen(true);
  };

  const handleOpenEditEdu = (edu) => {
    setEditingEduId(edu.id);
    setEduForm({
      qualification: edu.qualification,
      institution: edu.institution,
      fieldOfStudy: edu.fieldOfStudy,
      startDate: edu.startDate || '',
      endDate: edu.endDate || '',
      description: edu.description || ''
    });
    setEduModalOpen(true);
  };

  const handleSaveEdu = async (e) => {
    e.preventDefault();
    setSavingEdu(true);
    try {
      if (editingEduId) {
        await api.put(`/candidates/${profile.id}/education/${editingEduId}`, eduForm);
        toast.success('Education record updated!');
      } else {
        await api.post(`/candidates/${profile.id}/education`, eduForm);
        toast.success('Education record added!');
      }
      setEduModalOpen(false);
      fetchProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save education record');
    } finally {
      setSavingEdu(false);
    }
  };

  // 4. Experience Actions
  const handleOpenAddExp = () => {
    setEditingExpId(null);
    setExpForm({ jobTitle: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '' });
    setExpModalOpen(true);
  };

  const handleOpenEditExp = (exp) => {
    setEditingExpId(exp.id);
    setExpForm({
      jobTitle: exp.jobTitle,
      company: exp.company,
      location: exp.location || '',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      current: exp.current || false,
      description: exp.description || ''
    });
    setExpModalOpen(true);
  };

  const handleSaveExp = async (e) => {
    e.preventDefault();
    setSavingExp(true);
    try {
      if (editingExpId) {
        await api.put(`/candidates/${profile.id}/experience/${editingExpId}`, expForm);
        toast.success('Work experience updated!');
      } else {
        await api.post(`/candidates/${profile.id}/experience`, expForm);
        toast.success('Work experience added!');
      }
      setExpModalOpen(false);
      fetchProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save experience record');
    } finally {
      setSavingExp(false);
    }
  };

  // 5. Skills Actions
  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!skillName.trim()) return;
    setSavingSkill(true);
    try {
      await api.post(`/candidates/${profile.id}/skills`, {
        name: skillName.trim(),
        proficiencyLevel: skillProficiency
      });
      setSkillName('');
      toast.success('Skill added to profile!');
      fetchProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add skill');
    } finally {
      setSavingSkill(false);
    }
  };

  const handleRemoveSkill = async (skillId) => {
    try {
      await api.delete(`/candidates/${profile.id}/skills/${skillId}`);
      toast.success('Skill removed');
      fetchProfile();
    } catch (err) {
      toast.error('Failed to remove skill');
    }
  };

  // 6. Resume Upload
  const handleUploadResume = async (e) => {
    e.preventDefault();
    if (!resumeFile) return;

    const formData = new FormData();
    formData.append('file', resumeFile);

    setUploadingResume(true);
    try {
      await api.post(`/candidates/${profile.id}/resume`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Resume uploaded successfully!');
      setResumeFile(null);
      fetchProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload resume');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleDeleteResume = async (resumeId) => {
    try {
      await api.delete(`/candidates/${profile.id}/resume/${resumeId}`);
      toast.success('Resume deleted');
      fetchProfile();
    } catch (err) {
      toast.error('Failed to delete resume');
    }
  };

  // Confirm delete handler
  const handleConfirmDelete = async () => {
    const { type, id } = deleteConfirm;
    if (type === 'education') {
      try {
        await api.delete(`/candidates/${profile.id}/education/${id}`);
        toast.success('Education deleted');
        fetchProfile();
      } catch (err) { toast.error('Failed to delete education'); }
    } else if (type === 'experience') {
      try {
        await api.delete(`/candidates/${profile.id}/experience/${id}`);
        toast.success('Experience deleted');
        fetchProfile();
      } catch (err) { toast.error('Failed to delete experience'); }
    } else if (type === 'resume') {
      handleDeleteResume(id);
    }
    setDeleteConfirm({ isOpen: false, type: '', id: null });
  };

  if (loading) return <LoadingSpinner text="Loading candidate profile..." />;
  if (!profile) return <div>Profile not found.</div>;

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
      {/* ---------------- Profile Header Card ---------------- */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2rem', backgroundColor: '#ffffff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary-light)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 800,
              overflow: 'hidden',
              flexShrink: 0
            }}>
              {profile.profilePicturePath ? (
                <img src={profile.profilePicturePath} alt={profile.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                profile.fullName ? profile.fullName.charAt(0).toUpperCase() : 'C'
              )}
            </div>

            <div>
              <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>{profile.fullName}</h1>
              <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-primary)', margin: 0 }}>
                {profile.headline || 'Add a professional headline'}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '0.35rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                {profile.location && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={15} /> {profile.location}
                  </span>
                )}
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Mail size={15} /> {profile.email}
                </span>
                {profile.phone && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Phone size={15} /> {profile.phone}
                  </span>
                )}
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--color-danger)' }}>
                  <Heart size={15} fill="currentColor" /> {profile.likesCount || 0} Likes Received
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button
              variant="primary"
              size="md"
              icon={Download}
              onClick={handleExportPdf}
              loading={exportingPdf}
            >
              Export Profile as PDF
            </Button>
          </div>
        </div>

        {/* Dynamic Completion Progress Bar */}
        <div style={{ marginTop: '1.75rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border-light)' }}>
          <ProfileProgressBar percentage={profile.profileCompletionPct} />
        </div>
      </div>

      {/* ---------------- 1. Personal Information Card ---------------- */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2rem', backgroundColor: '#ffffff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={20} color="var(--color-primary)" /> Personal Information
          </h3>
          {!isEditingPersonal && (
            <Button variant="outline" size="sm" icon={Edit3} onClick={() => setIsEditingPersonal(true)}>
              Edit Details
            </Button>
          )}
        </div>

        {isEditingPersonal ? (
          <form onSubmit={handleSavePersonal}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input
                label="Full Name"
                value={personalForm.fullName}
                onChange={(e) => setPersonalForm({ ...personalForm, fullName: e.target.value })}
                required
              />
              <Input
                label="Phone Number"
                value={personalForm.phone}
                onChange={(e) => setPersonalForm({ ...personalForm, phone: e.target.value })}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input
                label="Professional Headline"
                value={personalForm.headline}
                onChange={(e) => setPersonalForm({ ...personalForm, headline: e.target.value })}
                placeholder="e.g. Senior Full Stack Developer"
              />
              <Input
                label="Location (City, Country)"
                value={personalForm.location}
                onChange={(e) => setPersonalForm({ ...personalForm, location: e.target.value })}
                placeholder="e.g. Colombo, Sri Lanka"
              />
            </div>
            <Input
              label="Street Address"
              value={personalForm.address}
              onChange={(e) => setPersonalForm({ ...personalForm, address: e.target.value })}
              placeholder="e.g. No 28, Havelock Road, Colombo 05"
            />
            <div className="form-group">
              <label className="form-label" htmlFor="profSummary">Professional Summary</label>
              <textarea
                id="profSummary"
                className="form-input"
                rows={4}
                value={personalForm.professionalSummary}
                onChange={(e) => setPersonalForm({ ...personalForm, professionalSummary: e.target.value })}
                placeholder="Summarize your technical background, years of experience, and key accomplishments..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
              <Button variant="outline" onClick={() => setIsEditingPersonal(false)}>Cancel</Button>
              <Button type="submit" variant="primary" loading={savingPersonal}>Save Personal Info</Button>
            </div>
          </form>
        ) : (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Location</span>
                <p style={{ fontWeight: 600, marginTop: '0.2rem' }}>{profile.location || 'Not specified'}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Address</span>
                <p style={{ fontWeight: 600, marginTop: '0.2rem' }}>{profile.address || 'Not specified'}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Email</span>
                <p style={{ fontWeight: 600, marginTop: '0.2rem' }}>{profile.email}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Phone</span>
                <p style={{ fontWeight: 600, marginTop: '0.2rem' }}>{profile.phone || 'Not provided'}</p>
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Professional Summary</span>
              <p style={{ marginTop: '0.35rem', lineHeight: 1.6, color: 'var(--color-text-muted)' }}>
                {profile.professionalSummary || 'No professional summary provided yet. Add a summary to improve candidate search visibility.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ---------------- 2. Education Card ---------------- */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2rem', backgroundColor: '#ffffff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <GraduationCap size={20} color="var(--color-primary)" /> Education & Qualifications
          </h3>
          <Button variant="outline-primary" size="sm" icon={Plus} onClick={handleOpenAddEdu}>
            Add Education
          </Button>
        </div>

        {profile.educationList?.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>No education records added yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {profile.educationList.map((edu) => (
              <div
                key={edu.id}
                style={{
                  padding: '1.25rem',
                  border: '1px solid var(--color-border-light)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '0.2rem' }}>
                    {edu.qualification} in {edu.fieldOfStudy}
                  </h4>
                  <p style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.875rem', margin: 0 }}>
                    {edu.institution}
                  </p>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '0.25rem' }}>
                    {edu.startDate} to {edu.endDate || 'Present'}
                  </span>
                  {edu.description && (
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.5rem', lineHeight: 1.5 }}>
                      {edu.description}
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="btn btn-outline btn-sm btn-icon"
                    onClick={() => handleOpenEditEdu(edu)}
                    title="Edit Education"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    className="btn btn-outline btn-sm btn-icon"
                    style={{ color: 'var(--color-danger)' }}
                    onClick={() => setDeleteConfirm({ isOpen: true, type: 'education', id: edu.id })}
                    title="Delete Education"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---------------- 3. Work Experience Card ---------------- */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2rem', backgroundColor: '#ffffff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Briefcase size={20} color="var(--color-primary)" /> Work Experience
          </h3>
          <Button variant="outline-primary" size="sm" icon={Plus} onClick={handleOpenAddExp}>
            Add Experience
          </Button>
        </div>

        {profile.experienceList?.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>No experience records added yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {profile.experienceList.map((exp) => (
              <div
                key={exp.id}
                style={{
                  padding: '1.25rem',
                  border: '1px solid var(--color-border-light)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '0.2rem' }}>
                    {exp.jobTitle}
                  </h4>
                  <p style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.875rem', margin: 0 }}>
                    {exp.company} {exp.location && `• ${exp.location}`}
                  </p>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '0.25rem' }}>
                    {exp.startDate} to {exp.current ? 'Present' : exp.endDate || 'Present'}
                  </span>
                  {exp.description && (
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.5rem', lineHeight: 1.5 }}>
                      {exp.description}
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="btn btn-outline btn-sm btn-icon"
                    onClick={() => handleOpenEditExp(exp)}
                    title="Edit Experience"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    className="btn btn-outline btn-sm btn-icon"
                    style={{ color: 'var(--color-danger)' }}
                    onClick={() => setDeleteConfirm({ isOpen: true, type: 'experience', id: exp.id })}
                    title="Delete Experience"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---------------- 4. Skills Card ---------------- */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2rem', backgroundColor: '#ffffff' }}>
        <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Sparkles size={20} color="var(--color-primary)" /> Skills & Competencies
        </h3>

        {/* Add Skill Form */}
        <form onSubmit={handleAddSkill} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 2, minWidth: '200px' }}>
            <input
              className="form-input"
              placeholder="e.g. Java, Spring Boot, React, MySQL..."
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              required
            />
          </div>
          <div style={{ flex: 1, minWidth: '160px' }}>
            <select
              className="form-select"
              value={skillProficiency}
              onChange={(e) => setSkillProficiency(e.target.value)}
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
              <option value="EXPERT">Expert</option>
            </select>
          </div>
          <Button type="submit" variant="primary" loading={savingSkill} icon={Plus}>
            Add Skill
          </Button>
        </form>

        {profile.skills?.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>No skills added. Add at least 3 skills to boost your completion score.</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {profile.skills.map((sk) => (
              <div
                key={sk.id}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-primary-hover)',
                  padding: '0.4rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8125rem',
                  fontWeight: 600
                }}
              >
                <span>{sk.name}</span>
                <span style={{ fontSize: '0.6875rem', opacity: 0.75, fontWeight: 700 }}>
                  ({sk.proficiencyLevel})
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(sk.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary-hover)', display: 'flex' }}
                  title="Remove skill"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---------------- 5. Resume Card ---------------- */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2rem', backgroundColor: '#ffffff' }}>
        <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <FileText size={20} color="var(--color-primary)" /> Resume / Curriculum Vitae
        </h3>

        {/* Upload Form */}
        <form onSubmit={handleUploadResume} style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
            className="form-input"
            style={{ maxWidth: '320px' }}
          />
          <Button type="submit" variant="primary" loading={uploadingResume} disabled={!resumeFile} icon={Upload}>
            Upload Resume
          </Button>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            Allowed formats: PDF, DOC, DOCX (Max 10MB)
          </span>
        </form>

        {profile.resumes?.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            No uploaded resume files. (Note: You can still apply and export your CV directly using our PDF generator).
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {profile.resumes.map((res) => (
              <div
                key={res.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  border: '1px solid var(--color-border-light)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-alt)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <FileText size={24} color="var(--color-primary)" />
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--color-text-main)', display: 'block' }}>
                      {res.originalFilename}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {(res.fileSize / (1024 * 1024)).toFixed(2)} MB • Uploaded on {new Date(res.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <a
                    href={`/api/candidates/${profile.id}/resume/${res.id}/download`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline btn-sm"
                  >
                    <Download size={14} /> Download
                  </a>
                  <button
                    className="btn btn-outline btn-sm btn-icon"
                    style={{ color: 'var(--color-danger)' }}
                    onClick={() => setDeleteConfirm({ isOpen: true, type: 'resume', id: res.id })}
                    title="Delete Resume"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---------------- Education Modal ---------------- */}
      <Modal
        isOpen={eduModalOpen}
        onClose={() => setEduModalOpen(false)}
        title={editingEduId ? 'Edit Education Record' : 'Add Education Record'}
      >
        <form onSubmit={handleSaveEdu}>
          <Input
            label="Qualification / Degree"
            value={eduForm.qualification}
            onChange={(e) => setEduForm({ ...eduForm, qualification: e.target.value })}
            placeholder="e.g. B.Sc. in Software Engineering"
            required
          />
          <Input
            label="Institution / University"
            value={eduForm.institution}
            onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
            placeholder="e.g. University of Colombo"
            required
          />
          <Input
            label="Field of Study"
            value={eduForm.fieldOfStudy}
            onChange={(e) => setEduForm({ ...eduForm, fieldOfStudy: e.target.value })}
            placeholder="e.g. Computer Science & AI"
            required
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input
              label="Start Date"
              type="date"
              value={eduForm.startDate}
              onChange={(e) => setEduForm({ ...eduForm, startDate: e.target.value })}
              required
            />
            <Input
              label="End Date (or Expected)"
              type="date"
              value={eduForm.endDate}
              onChange={(e) => setEduForm({ ...eduForm, endDate: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="eduDesc">Description / Honors</label>
            <textarea
              id="eduDesc"
              className="form-input"
              rows={3}
              value={eduForm.description}
              onChange={(e) => setEduForm({ ...eduForm, description: e.target.value })}
              placeholder="Notable projects, grades, research topics..."
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <Button variant="outline" onClick={() => setEduModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" loading={savingEdu}>Save Record</Button>
          </div>
        </form>
      </Modal>

      {/* ---------------- Experience Modal ---------------- */}
      <Modal
        isOpen={expModalOpen}
        onClose={() => setExpModalOpen(false)}
        title={editingExpId ? 'Edit Experience Record' : 'Add Experience Record'}
      >
        <form onSubmit={handleSaveExp}>
          <Input
            label="Job Title"
            value={expForm.jobTitle}
            onChange={(e) => setExpForm({ ...expForm, jobTitle: e.target.value })}
            placeholder="e.g. Senior Java Developer"
            required
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input
              label="Company Name"
              value={expForm.company}
              onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
              placeholder="e.g. Virtusa"
              required
            />
            <Input
              label="Location"
              value={expForm.location}
              onChange={(e) => setExpForm({ ...expForm, location: e.target.value })}
              placeholder="e.g. Colombo (Hybrid)"
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input
              label="Start Date"
              type="date"
              value={expForm.startDate}
              onChange={(e) => setExpForm({ ...expForm, startDate: e.target.value })}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={expForm.endDate}
              onChange={(e) => setExpForm({ ...expForm, endDate: e.target.value })}
              disabled={expForm.current}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <input
              type="checkbox"
              id="isCurrent"
              checked={expForm.current}
              onChange={(e) => setExpForm({ ...expForm, current: e.target.checked, endDate: '' })}
            />
            <label htmlFor="isCurrent" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
              I currently work in this role
            </label>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="expDesc">Role Description & Achievements</label>
            <textarea
              id="expDesc"
              className="form-input"
              rows={4}
              value={expForm.description}
              onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
              placeholder="Highlight technical responsibilities, technologies utilized, and measurable achievements..."
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <Button variant="outline" onClick={() => setExpModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" loading={savingExp}>Save Experience</Button>
          </div>
        </form>
      </Modal>

      {/* ---------------- Confirm Delete Dialog ---------------- */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, type: '', id: null })}
        onConfirm={handleConfirmDelete}
        title="Delete Record"
        message="Are you sure you want to permanently delete this record? This cannot be undone."
        confirmText="Delete"
        danger={true}
      />
    </div>
  );
};

export default CandidateProfilePage;
