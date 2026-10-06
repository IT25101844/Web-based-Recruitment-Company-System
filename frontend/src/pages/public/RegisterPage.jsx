import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { User, Building, Mail, Phone, Lock, MapPin, FileText } from 'lucide-react';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get('type') === 'employer' ? 'employer' : 'candidate');
  const [loading, setLoading] = useState(false);

  // Candidate state
  const [candForm, setCandForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  // Employer state
  const [empForm, setEmpForm] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    registrationNumber: '',
    website: '',
    industry: '',
    companySize: '',
    password: '',
    confirmPassword: ''
  });

  const { registerCandidate, registerEmployer } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleCandidateSubmit = async (e) => {
    e.preventDefault();
    if (candForm.password !== candForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await registerCandidate(candForm);
      toast.success('Registration successful! Welcome to JobConnect.');
      navigate('/candidate/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Candidate registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEmployerSubmit = async (e) => {
    e.preventDefault();
    if (empForm.password !== empForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await registerEmployer(empForm);
      toast.success('Employer account registered! Verification is currently pending.');
      navigate('/employer/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Employer registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '3.5rem 1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 140px)' }}>
      <div style={{ width: '100%', maxWidth: '580px' }}>
        <div className="card" style={{ padding: '2.5rem', backgroundColor: '#ffffff', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>Create Your Account</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem' }}>
              Join JobConnect to access premier opportunities and recruitment tools
            </p>
          </div>

          {/* Tab Switcher */}
          <div style={{
            display: 'flex',
            backgroundColor: 'var(--bg-alt)',
            padding: '0.35rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '2rem'
          }}>
            <button
              type="button"
              onClick={() => setTab('candidate')}
              style={{
                flex: 1,
                padding: '0.625rem',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: tab === 'candidate' ? '#ffffff' : 'transparent',
                fontWeight: 600,
                fontSize: '0.875rem',
                color: tab === 'candidate' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                boxShadow: tab === 'candidate' ? 'var(--shadow-sm)' : 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all var(--transition-fast)'
              }}
            >
              <User size={16} /> Job Seeker
            </button>
            <button
              type="button"
              onClick={() => setTab('employer')}
              style={{
                flex: 1,
                padding: '0.625rem',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: tab === 'employer' ? '#ffffff' : 'transparent',
                fontWeight: 600,
                fontSize: '0.875rem',
                color: tab === 'employer' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                boxShadow: tab === 'employer' ? 'var(--shadow-sm)' : 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all var(--transition-fast)'
              }}
            >
              <Building size={16} /> Employer / Recruiter
            </button>
          </div>

          {/* Candidate Form */}
          {tab === 'candidate' ? (
            <form onSubmit={handleCandidateSubmit}>
              <Input
                label="Full Name"
                value={candForm.fullName}
                onChange={(e) => setCandForm({ ...candForm, fullName: e.target.value })}
                placeholder="e.g. John Silva"
                required
                icon={User}
              />
              <Input
                label="Email Address"
                type="email"
                value={candForm.email}
                onChange={(e) => setCandForm({ ...candForm, email: e.target.value })}
                placeholder="name@example.com"
                required
                icon={Mail}
              />
              <Input
                label="Phone Number"
                value={candForm.phone}
                onChange={(e) => setCandForm({ ...candForm, phone: e.target.value })}
                placeholder="+94 77 123 4567"
                required
                icon={Phone}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Input
                  label="Password"
                  type="password"
                  value={candForm.password}
                  onChange={(e) => setCandForm({ ...candForm, password: e.target.value })}
                  placeholder="At least 6 chars"
                  required
                  icon={Lock}
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  value={candForm.confirmPassword}
                  onChange={(e) => setCandForm({ ...candForm, confirmPassword: e.target.value })}
                  placeholder="Repeat password"
                  required
                  icon={Lock}
                />
              </div>

              <Button type="submit" variant="primary" size="lg" loading={loading} style={{ width: '100%', marginTop: '1rem' }}>
                Create Candidate Account
              </Button>
            </form>
          ) : (
            /* Employer Form */
            <form onSubmit={handleEmployerSubmit}>
              <Input
                label="Company Name"
                value={empForm.companyName}
                onChange={(e) => setEmpForm({ ...empForm, companyName: e.target.value })}
                placeholder="e.g. TechCorp Lanka Solutions"
                required
                icon={Building}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Input
                  label="Contact Person"
                  value={empForm.contactPerson}
                  onChange={(e) => setEmpForm({ ...empForm, contactPerson: e.target.value })}
                  placeholder="e.g. Dinesh Wickramasinghe"
                  required
                  icon={User}
                />
                <Input
                  label="Official Email"
                  type="email"
                  value={empForm.email}
                  onChange={(e) => setEmpForm({ ...empForm, email: e.target.value })}
                  placeholder="recruiter@company.com"
                  required
                  icon={Mail}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Input
                  label="Phone Number"
                  value={empForm.phone}
                  onChange={(e) => setEmpForm({ ...empForm, phone: e.target.value })}
                  placeholder="+94 11 234 5678"
                  required
                  icon={Phone}
                />
                <Input
                  label="Company Reg. Number"
                  value={empForm.registrationNumber}
                  onChange={(e) => setEmpForm({ ...empForm, registrationNumber: e.target.value })}
                  placeholder="e.g. PV-98765-LK"
                  required
                  icon={FileText}
                />
              </div>

              <Input
                label="Corporate Address"
                value={empForm.address}
                onChange={(e) => setEmpForm({ ...empForm, address: e.target.value })}
                placeholder="Level 14, World Trade Center, Colombo"
                required
                icon={MapPin}
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Input
                  label="Password"
                  type="password"
                  value={empForm.password}
                  onChange={(e) => setEmpForm({ ...empForm, password: e.target.value })}
                  placeholder="At least 6 chars"
                  required
                  icon={Lock}
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  value={empForm.confirmPassword}
                  onChange={(e) => setEmpForm({ ...empForm, confirmPassword: e.target.value })}
                  placeholder="Repeat password"
                  required
                  icon={Lock}
                />
              </div>

              <Button type="submit" variant="secondary" size="lg" loading={loading} style={{ width: '100%', marginTop: '1rem' }}>
                Register as Employer
              </Button>
            </form>
          )}

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
