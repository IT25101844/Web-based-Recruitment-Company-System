import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { AlertTriangle, MessageSquare, CheckCircle, Clock, FileText } from 'lucide-react';

export default function AdminComplaintsPage() {
  const { showToast } = useToast();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Status update modal
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('UNDER_INVESTIGATION');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await api.get('/support/tickets');
      const data = res.data?.content || (Array.isArray(res.data) ? res.data : []);
      setComplaints(data);
    } catch (error) {
      showToast('Failed to load user complaints', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openStatusModal = (complaint) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.status || 'UNDER_INVESTIGATION');
    setResolutionNotes(complaint.resolutionNotes || complaint.resolutionNote || '');
    setStatusModalOpen(true);
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    setSubmitting(true);
    try {
      const complaintId = selectedComplaint.ticketId || selectedComplaint.id;
      await api.patch(`/support/tickets/${complaintId}/status`, {
        status: newStatus,
        resolutionNote: resolutionNotes,
        resolutionNotes
      });
      showToast('Complaint status updated successfully', 'success');
      setComplaints(prev => prev.map(c => 
        (c.id === selectedComplaint.id || c.ticketId === selectedComplaint.ticketId) 
          ? { ...c, status: newStatus, resolutionNotes, resolutionNote: resolutionNotes } 
          : c
      ));
      setStatusModalOpen(false);
    } catch (error) {
      showToast('Failed to update complaint status', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading dispute cases and complaints..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle size={24} className="text-rose-500" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Complaints & Dispute Resolution</h1>
        </div>
        <p className="text-sm text-gray-500">
          Investigate reported grievances from candidates and employers to maintain platform trust.
        </p>
      </div>

      {complaints.length === 0 ? (
        <div className="card p-12 text-center text-gray-500">
          <CheckCircle size={40} className="mx-auto text-emerald-400 mb-2" />
          <h3 className="font-bold text-gray-800 dark:text-gray-200">No Open Grievances</h3>
          <p className="text-xs text-gray-500 mt-1">Platform community standards are healthy.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {complaints.map(c => (
            <div key={c.id || c.ticketId} className="card p-5 border border-gray-200 dark:border-gray-800 hover:shadow-md transition">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-gray-900 dark:text-white text-base">
                      {c.subject || 'Platform Inquiry'}
                    </h3>
                    <StatusBadge status={c.status} />
                    <span className="badge badge-secondary text-[10px]">{c.category || c.issueType || 'GENERAL'}</span>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {c.description}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-gray-400 pt-1">
                    <span>Filed by: {c.reporterName || c.reporterEmail || c.userName || c.userEmail || 'Anonymous'}</span>
                    <span>•</span>
                    <span>{new Date(c.createdAt).toLocaleString()}</span>
                  </div>

                  {(c.resolutionNotes || c.resolutionNote) && (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg text-xs text-emerald-800 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/40">
                      <strong>Admin Resolution:</strong> {c.resolutionNotes || c.resolutionNote}
                    </div>
                  )}
                </div>

                <div className="shrink-0 border-t md:border-t-0 pt-3 md:pt-0">
                  <button
                    onClick={() => openStatusModal(c)}
                    className="btn btn-sm btn-primary"
                  >
                    Investigate / Resolve
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resolution Modal */}
      <Modal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title={`Review Complaint #${selectedComplaint?.ticketId || selectedComplaint?.id}`}
      >
        <form onSubmit={handleStatusSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Case Status
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="select text-xs"
            >
              <option value="OPEN">OPEN</option>
              <option value="UNDER_INVESTIGATION">UNDER_INVESTIGATION</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="DISMISSED">DISMISSED</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Resolution Notes / Action Taken
            </label>
            <textarea
              rows={4}
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              className="input text-xs"
              placeholder="Detail findings, communications with parties, or remedial actions..."
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-200 dark:border-gray-800">
            <button
              type="button"
              onClick={() => setStatusModalOpen(false)}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <Button type="submit" variant="primary" loading={submitting}>
              Save Resolution
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
