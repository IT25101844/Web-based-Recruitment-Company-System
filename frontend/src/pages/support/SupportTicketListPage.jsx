import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { LifeBuoy, MessageSquare, CheckCircle, Clock } from 'lucide-react';

export default function SupportTicketListPage() {
  const { showToast } = useToast();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Response modal
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('IN_PROGRESS');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await api.get('/support/tickets');
      const data = res.data?.content || (Array.isArray(res.data) ? res.data : []);
      setTickets(data);
    } catch (error) {
      showToast('Failed to load support tickets', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (t) => {
    setSelectedTicket(t);
    setNewStatus(t.status || 'IN_PROGRESS');
    setResolutionNotes(t.resolutionNotes || t.resolutionNote || '');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTicket) return;

    setSubmitting(true);
    try {
      const ticketIdentifier = selectedTicket.ticketId || selectedTicket.id;
      await api.patch(`/support/tickets/${ticketIdentifier}/status`, {
        status: newStatus,
        resolutionNote: resolutionNotes,
        resolutionNotes
      });
      showToast('Support ticket updated successfully', 'success');
      setTickets(prev => prev.map(t => 
        (t.id === selectedTicket.id || t.ticketId === selectedTicket.ticketId) 
          ? { ...t, status: newStatus, resolutionNotes, resolutionNote: resolutionNotes } 
          : t
      ));
      setModalOpen(false);
    } catch (error) {
      showToast('Failed to update ticket', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading support ticketing queue..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <LifeBuoy size={24} className="text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Support Desk</h1>
        </div>
        <p className="text-sm text-gray-500">
          Assist candidates and employers with onboarding, account inquiries, and platform troubleshooting.
        </p>
      </div>

      {tickets.length === 0 ? (
        <div className="card p-12 text-center text-gray-500">
          <CheckCircle size={36} className="mx-auto text-emerald-400 mb-2" />
          <h3 className="font-bold text-gray-800 dark:text-gray-200">No Open Tickets</h3>
          <p className="text-xs text-gray-500 mt-1">All support inquiries are answered.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map(t => (
            <div key={t.id || t.ticketId} className="card p-5 border border-gray-200 dark:border-gray-800 hover:shadow-md transition">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-gray-900 dark:text-white text-base">
                      {t.subject || 'Support Ticket'}
                    </h3>
                    <StatusBadge status={t.status} />
                    <span className="badge badge-secondary text-[10px]">{t.category || t.issueType || 'TECHNICAL'}</span>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {t.description}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-gray-400 pt-1">
                    <span>Sender: {t.reporterName || t.reporterEmail || t.userName || t.userEmail || 'User'}</span>
                    <span>•</span>
                    <span>Submitted: {new Date(t.createdAt).toLocaleString()}</span>
                  </div>

                  {(t.resolutionNotes || t.resolutionNote) && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg text-xs text-blue-900 dark:text-blue-300 border border-blue-100 dark:border-blue-900/40">
                      <strong>Support Reply:</strong> {t.resolutionNotes || t.resolutionNote}
                    </div>
                  )}
                </div>

                <div className="shrink-0 border-t md:border-t-0 pt-3 md:pt-0">
                  <button
                    onClick={() => openModal(t)}
                    className="btn btn-sm btn-primary"
                  >
                    Reply & Resolve
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Respond to Ticket #${selectedTicket?.ticketId || selectedTicket?.id}`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Ticket Status
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="select text-xs"
            >
              <option value="OPEN">OPEN</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Response / Troubleshooting Guidance *
            </label>
            <textarea
              rows={4}
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              className="input text-xs"
              placeholder="Provide solution or response to the user..."
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-200 dark:border-gray-800">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <Button type="submit" variant="primary" loading={submitting}>
              Send Resolution
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
