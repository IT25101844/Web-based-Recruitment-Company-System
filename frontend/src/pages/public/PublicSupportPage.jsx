import React, { useState } from 'react';
import { LifeBuoy, AlertTriangle, ShieldAlert, CheckCircle, Send } from 'lucide-react';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export const PublicSupportPage = () => {
  const [issueType, setIssueType] = useState('COMPLAINT');
  const [priority, setPriority] = useState('MEDIUM');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [ticketResult, setTicketResult] = useState(null);

  const { isAuthenticated } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.info('Please log in to submit and track support tickets.');
      window.location.href = '/login?redirect=/support';
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/complaints', {
        issueType,
        priority,
        subject,
        description
      });
      setTicketResult(res.data);
      toast.success('Support ticket submitted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit support ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '3.5rem 0', backgroundColor: 'var(--color-background)', minHeight: 'calc(100vh - 70px)' }}>
      <div className="container" style={{ maxWidth: '780px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            background: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            width: 52,
            height: 52,
            borderRadius: '50%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <LifeBuoy size={28} />
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Help Desk & Dispute Center</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem' }}>
            Report technical issues, file candidate/employer complaints, or submit spam notices
          </p>
        </div>

        <div className="card" style={{ padding: '2.5rem', backgroundColor: '#ffffff' }}>
          {ticketResult ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <CheckCircle size={56} color="var(--color-success)" style={{ marginBottom: '1.25rem' }} />
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Ticket Created Successfully</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', marginBottom: '1rem' }}>
                Your Reference Ticket ID: <strong style={{ color: 'var(--color-primary)', fontSize: '1.15rem' }}>{ticketResult.ticketId}</strong>
              </p>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', maxWidth: '460px', margin: '0 auto 2rem' }}>
                Our compliance and support operations team has received your submission and will review it promptly. You will receive in-app notifications on status updates.
              </p>
              <Button variant="outline" onClick={() => { setTicketResult(null); setSubject(''); setDescription(''); }}>
                Submit Another Request
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Select
                  label="Category / Issue Type"
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  options={[
                    { value: 'COMPLAINT', label: 'General Complaint' },
                    { value: 'TECHNICAL_ISSUE', label: 'Technical Issue' },
                    { value: 'SPAM_REPORT', label: 'Spam / Fraud Report' },
                    { value: 'OTHER', label: 'Other Request' }
                  ]}
                  required
                />
                <Select
                  label="Priority Level"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  options={[
                    { value: 'LOW', label: 'Low Priority' },
                    { value: 'MEDIUM', label: 'Medium Priority' },
                    { value: 'HIGH', label: 'High Priority (Urgent)' }
                  ]}
                  required
                />
              </div>

              <Input
                label="Subject / Brief Summary"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Unsolicited contact from third party"
                required
              />

              <div className="form-group">
                <label className="form-label" htmlFor="desc">
                  Detailed Description <span style={{ color: 'var(--color-danger)' }}>*</span>
                </label>
                <textarea
                  id="desc"
                  className="form-input"
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide all relevant details, including dates, usernames, and URLs if applicable..."
                  required
                />
              </div>

              <Button type="submit" variant="primary" size="lg" loading={loading} style={{ width: '100%', marginTop: '1rem' }}>
                <Send size={16} /> Submit Ticket
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicSupportPage;
