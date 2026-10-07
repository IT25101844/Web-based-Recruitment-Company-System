import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { ShieldCheck, Building2, FileText, CheckCircle2, XCircle, AlertCircle, Eye, ExternalLink } from 'lucide-react';

export default function AdminVerificationPage() {
  const { showToast } = useToast();
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review / Decision Modal
  const [selectedEmployer, setSelectedEmployer] = useState(null);
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [decisionType, setDecisionType] = useState('VERIFIED');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEmployers();
  }, []);

  const fetchEmployers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/employers/pending-verification');
      const data = res.data?.content || (Array.isArray(res.data) ? res.data : []);
      setEmployers(data);
    } catch (error) {
      showToast('Failed to load pending verifications', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openDecisionModal = (emp, type) => {
    setSelectedEmployer(emp);
    setDecisionType(type);
    setNotes(type === 'VERIFIED' ? 'Business registration verified against official ROC registry records.' : 'BRC illegible or missing tax registration number.');
    setDecisionModalOpen(true);
  };

  const handleDecisionSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmployer) return;

    setSubmitting(true);
    try {
      const action = decisionType === 'VERIFIED' ? 'APPROVE' : 'REJECT';
      await api.post(`/admin/employers/${selectedEmployer.id}/verify?status=${decisionType}&action=${action}&notes=${encodeURIComponent(notes)}`, {
        action,
        status: decisionType,
        rejectionReason: notes,
        notes
      });
      showToast(`Employer successfully marked as ${decisionType}`, 'success');
      setEmployers(prev => prev.filter(emp => emp.id !== selectedEmployer.id));
      setDecisionModalOpen(false);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update verification status', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading pending enterprise credentials..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck size={24} className="text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Employer Verification Queue
          </h1>
        </div>
        <p className="text-sm text-gray-500">
          Verify registered businesses, inspect uploaded Business Registration Certificates (BRC), and bestow Verified Employer badges.
        </p>
      </div>

      {employers.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/40 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-500">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white text-lg">Verification Queue Clear</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
            All submitted enterprise documents have been reviewed and processed.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {employers.map(emp => (
            <div key={emp.id} className="card p-5 border border-gray-200 dark:border-gray-800 hover:shadow-md transition">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 text-primary-600 flex items-center justify-center font-bold">
                      {emp.companyName?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-base">
                        {emp.companyName}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {emp.industry || 'Industry'} • {emp.city || emp.address || 'Colombo, Sri Lanka'} • Size: {emp.companySize || 'N/A'}
                      </p>
                    </div>
                    <StatusBadge status={emp.verificationStatus} />
                  </div>

                  <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1 pt-1">
                    <p><strong>Contact Person:</strong> {emp.contactPerson || 'N/A'}</p>
                    <p><strong>Contact Email:</strong> {emp.contactEmail || emp.userEmail || emp.email || 'N/A'}</p>
                    <p><strong>Phone:</strong> {emp.phone || emp.contactNumber || 'N/A'}</p>
                    <p><strong>Registration No (BRC):</strong> {emp.registrationNumber || 'N/A'}</p>
                    {(emp.website || emp.websiteUrl) && (
                      <p>
                        <strong>Website:</strong>{' '}
                        <a href={emp.website || emp.websiteUrl} target="_blank" rel="noreferrer" className="text-primary-600 hover:underline">
                          {emp.website || emp.websiteUrl}
                        </a>
                      </p>
                    )}
                  </div>

                  {/* Attached Verification Documents */}
                  {emp.documents && emp.documents.length > 0 ? (
                    <div className="pt-2">
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Uploaded Compliance Documents:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {emp.documents.map((doc, i) => (
                          <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs">
                            <FileText size={14} className="text-primary-600" />
                            <span className="font-medium text-gray-800 dark:text-gray-200">{doc.documentType || 'BRC'}:</span>
                            <span className="text-gray-500 truncate max-w-[140px]">{doc.fileName || doc.originalFilename || 'Document'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-amber-600 italic">No document uploaded yet</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap md:flex-col gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0">
                  <button
                    onClick={() => openDecisionModal(emp, 'VERIFIED')}
                    className="btn btn-sm btn-primary flex items-center gap-1 shadow"
                  >
                    <CheckCircle2 size={14} /> Approve & Verify
                  </button>

                  <button
                    onClick={() => openDecisionModal(emp, 'REJECTED')}
                    className="btn btn-sm btn-danger flex items-center gap-1"
                  >
                    <XCircle size={14} /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Decision Modal */}
      <Modal
        isOpen={decisionModalOpen}
        onClose={() => setDecisionModalOpen(false)}
        title={`${decisionType === 'VERIFIED' ? 'Approve' : 'Reject'} Verification: ${selectedEmployer?.companyName}`}
      >
        <form onSubmit={handleDecisionSubmit} className="space-y-4">
          <p className="text-xs text-gray-600 dark:text-gray-300">
            {decisionType === 'VERIFIED'
              ? 'This will bestow the official Verified Enterprise badge onto the employer profile and notify company administrators.'
              : 'Specify the reason for rejection (e.g. document mismatch, unreadable image, invalid TIN).'}
          </p>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Compliance Notes & Reason *
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input text-xs"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-200 dark:border-gray-800">
            <button
              type="button"
              onClick={() => setDecisionModalOpen(false)}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <Button
              type="submit"
              variant={decisionType === 'VERIFIED' ? 'primary' : 'danger'}
              loading={submitting}
            >
              Confirm {decisionType}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
