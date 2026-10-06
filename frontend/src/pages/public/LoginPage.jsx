import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, Shield, Users, Building, LifeBuoy, Briefcase } from 'lucide-react';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.fullName}!`);

      // Determine redirect
      const role = user.roles?.[0];
      if (role === 'ADMIN') navigate('/admin/dashboard');
      else if (role === 'OPERATIONS_EXECUTIVE') navigate('/operations/dashboard');
      else if (role === 'RECRUITMENT_OFFICER') navigate('/recruitment/dashboard');
      else if (role === 'CUSTOMER_SUPPORT') navigate('/support/dashboard');
      else if (role === 'EMPLOYER') navigate('/employer/dashboard');
      else navigate('/candidate/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('Password@123');
  };

  // Demo accounts - these should be replaced with real user accounts in production
  const demoAccounts = [
    { email: 'candidate@jobconnect.local', label: 'Candidate', icon: Users },
    { email: 'employer@jobconnect.local', label: 'Employer', icon: Building },
    { email: 'admin@jobconnect.local', label: 'System Admin', icon: Shield },
    { email: 'recruitment@jobconnect.local', label: 'Recruiter', icon: Users },
    { email: 'operations@jobconnect.local', label: 'Operations', icon: Shield },
    { email: 'support@jobconnect.local', label: 'Support', icon: LifeBuoy }
  ];

  return (
    <div style={{
      padding: '3.5rem 1rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 140px)',
      background: 'linear-gradient(135deg, #e6f2ff 0%, #f4f9fd 50%, #ffffff 100%)'
    }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        {/* Logo Section */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--color-primary), #38bdf8)',
            color: '#ffffff',
            width: 56,
            height: 56,
            borderRadius: 'var(--radius-xl)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(0, 102, 204, 0.3)',
            marginBottom: '1rem'
          }}>
            <Briefcase size={28} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', marginBottom: '0.35rem', color: 'var(--color-text-main)' }}>Sign In to JobConnect</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Access your recruitment workspace or candidate portal
          </p>
        </div>

        <div style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--color-border-light)'
        }}>
          <form onSubmit={handleLogin}>
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              icon={Mail}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              icon={Lock}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
              <Link to="/forgot-password" style={{ fontSize: '0.8125rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                Forgot password?
              </Link>
            </div>

            <Button type="submit" variant="primary" size="lg" loading={loading} style={{ width: '100%', borderRadius: 'var(--radius-md)' }}>
              <LogIn size={18} /> Sign In
            </Button>
          </form>

          {/* Quick Demo Accounts Selection */}
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border-light)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', textAlign: 'center', marginBottom: '0.875rem' }}>
              Quick Demo Account Fill (Password: Password@123)
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
              {demoAccounts.map((account) => {
                const Icon = account.icon;
                return (
                  <button
                    key={account.email}
                    type="button"
                    className="btn btn-secondary"
                    style={{ fontSize: '0.8rem', gap: '0.375rem', borderRadius: 'var(--radius-md)' }}
                    onClick={() => handleQuickLogin(account.email)}
                  >
                    <Icon size={14} /> {account.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            Don't have an account yet?{' '}
            <Link to="/register" style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

