import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import { HelpCircle, Send, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

export default function CandidateHelpCenterPage() {
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    subject: '',
    category: 'TECHNICAL',
    description: ''
  });

  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      q: 'How does the Profile Completion percentage calculate?',
      a: 'Your profile score automatically updates based on your inputs: 20% for basic details & photo, 25% for at least one education record, 30% for at least one work experience, 15% for added skills, and 10% for uploading a resume document.'
    },
    {
      q: 'How can employers verify their business registration (BRC)?',
      a: 'Go to your Company Profile in the Employer portal, scroll down to Business Registration Documents, and upload your official Certificate of Incorporation or Form 1. Our compliance team verifies documents within 24 business hours.'
    },
    {
      q: 'Can I generate a formatted PDF CV from my JobConnect profile?',
      a: 'Yes! Navigate to your Candidate Profile and click "Download PDF CV". Our server-side Apache PDFBox engine will instantly compile your verified education, career history, and skills into a modern, ATS-ready PDF document.'
    },
    {
      q: 'What happens when an employer likes my candidate profile?',
      a: 'You will receive an immediate in-app notification. You can review the interested company under your "Employers Interested" tab, see their active vacancies, or initiate a conversation.'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.subject || !form.description) {
      showToast('Please fill out all ticket fields', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/support/tickets', form);
      showToast('Support ticket lodged! Our team will respond shortly.', 'success');
      setSubmitted(true);
      setForm({ subject: '', category: 'TECHNICAL', description: '' });
    } catch (error) {
      showToast('Failed to submit ticket', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Help Center & Support Desk</h1>
        <p className="text-sm text-gray-500">
          Find answers to frequently asked questions or submit an inquiry directly to our support engineers.
        </p>
      </div>

      {/* FAQ Section */}
      <div className="card p-6 space-y-4">
        <h3 className="text-base font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
          <HelpCircle size={18} className="text-primary-600" /> Frequently Asked Questions
        </h3>

        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {faqs.map((faq, i) => {
            const isExpanded = expandedFaq === i;
            return (
              <div key={i} className="py-3">
                <button
                  onClick={() => setExpandedFaq(isExpanded ? null : i)}
                  className="w-full text-left font-semibold text-xs sm:text-sm text-gray-800 dark:text-gray-200 flex justify-between items-center py-1 hover:text-primary-600 transition"
                >
                  <span>{faq.q}</span>
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {isExpanded && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Submit Ticket Form */}
      <div className="card p-6 space-y-4">
        <h3 className="text-base font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
          <Send size={18} className="text-primary-600" /> Submit a Support Ticket or Grievance
        </h3>

        {submitted ? (
          <div className="p-6 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl text-center space-y-2 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 size={36} className="mx-auto text-emerald-500" />
            <h4 className="font-bold text-gray-900 dark:text-white text-base">Inquiry Submitted</h4>
            <p className="text-xs text-gray-600 dark:text-gray-300 max-w-sm mx-auto">
              Your inquiry has been routed to our technical support team. Check back in your notifications for updates.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="btn btn-sm btn-outline mt-2"
            >
              Submit Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Ticket Subject *"
                placeholder="e.g. Issue uploading portfolio documents"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                required
              />

              <Select
                label="Category *"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                options={[
                  { value: 'TECHNICAL', label: 'Technical Issue / Bug' },
                  { value: 'ACCOUNT', label: 'Account & Credentials' },
                  { value: 'VERIFICATION', label: 'BRC & Verification' },
                  { value: 'COMPLAINT', label: 'Grievance / Dispute' },
                  { value: 'BILLING', label: 'Billing & Enterprise' }
                ]}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Detailed Explanation *
              </label>
              <textarea
                rows={5}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Explain the circumstances, steps to reproduce, or any relevant details..."
                className="input text-xs"
                required
              />
            </div>

            <div className="flex justify-end pt-2 border-t border-gray-200 dark:border-gray-800">
              <Button type="submit" variant="primary" loading={submitting}>
                Dispatch Ticket
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
