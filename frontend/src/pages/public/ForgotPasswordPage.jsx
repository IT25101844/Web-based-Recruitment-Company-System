import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
      toast.success('Password reset instructions dispatched.');
    } catch (err) {
      toast.error('Could not process request. Please check email address.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '4rem 1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 140px)' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div className="card" style={{ padding: '2.5rem', backgroundColor: '#ffffff' }}>
          <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            <ArrowLeft size={16} /> Back to Sign In
          </Link>

          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Reset Password</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Enter the email associated with your JobConnect account to receive password reset instructions.
          </p>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <CheckCircle size={48} color="var(--color-success)" style={{ marginBottom: '1rem' }} />
              <h4 style={{ marginBottom: '0.5rem' }}>Check Your Inbox</h4>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                If an account exists for <strong>{email}</strong>, a recovery link has been sent.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                icon={Mail}
              />
              <Button type="submit" variant="primary" loading={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
                Send Reset Link
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
