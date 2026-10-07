import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { 
  Bell, CheckCircle2, Heart, Calendar, Briefcase, 
  Info, AlertTriangle, ExternalLink, Check 
} from 'lucide-react';

export default function NotificationsPage() {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterUnread, setFilterUnread] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/notifications');
      const data = res.data.content || res.data || [];
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      showToast('Failed to load notifications', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      showToast('Failed to mark notification as read', 'error');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.patch('/notifications/mark-all-read');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      showToast('All notifications marked as read', 'success');
    } catch (error) {
      showToast('Failed to mark all as read', 'error');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'CANDIDATE_LIKED':
        return <Heart className="text-rose-500 fill-rose-500" size={18} />;
      case 'INTERVIEW_SCHEDULED':
        return <Calendar className="text-primary-600" size={18} />;
      case 'APPLICATION_STATUS_UPDATED':
      case 'APPLICATION_RECEIVED':
        return <Briefcase className="text-emerald-600" size={18} />;
      case 'VERIFICATION_STATUS':
        return <CheckCircle2 className="text-indigo-600" size={18} />;
      default:
        return <Info className="text-blue-500" size={18} />;
    }
  };

  const filtered = filterUnread ? notifications.filter(n => !n.isRead) : notifications;
  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) {
    return <LoadingSpinner text="Loading your notification feed..." />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bell size={24} className="text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          </div>
          <p className="text-sm text-gray-500">
            Real-time updates regarding application stages, employer likes, and interview alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="btn btn-sm btn-outline text-xs flex items-center gap-1"
            >
              <Check size={14} /> Mark All as Read
            </button>
          )}

          <button
            onClick={() => setFilterUnread(!filterUnread)}
            className={`btn btn-sm text-xs ${filterUnread ? 'btn-primary' : 'btn-outline'}`}
          >
            {filterUnread ? 'Show All' : `Unread Only (${unreadCount})`}
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-12 text-center text-gray-500">
          <Bell size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <h3 className="font-bold text-gray-800 dark:text-gray-200">No Notifications</h3>
          <p className="text-xs text-gray-500 mt-1">
            {filterUnread ? 'You have caught up on all unread notifications!' : 'Your notification stream is quiet.'}
          </p>
        </div>
      ) : (
        <div className="card divide-y divide-gray-100 dark:divide-gray-800 overflow-hidden border border-gray-200 dark:border-gray-800">
          {filtered.map(item => (
            <div
              key={item.id}
              className={`p-4 flex items-start justify-between gap-4 transition ${
                !item.isRead ? 'bg-blue-50/40 dark:bg-blue-950/20' : 'hover:bg-gray-50/50 dark:hover:bg-gray-800/30'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 shrink-0">
                  {getIcon(item.type)}
                </div>

                <div className="space-y-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-xs">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    {item.message}
                  </p>
                  <div className="flex items-center gap-3 text-[10px] text-gray-400 pt-1">
                    <span>{new Date(item.createdAt).toLocaleString()}</span>
                    {item.actionUrl && (
                      <Link to={item.actionUrl} className="text-primary-600 hover:underline flex items-center gap-0.5 font-medium">
                        View Details <ExternalLink size={10} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {!item.isRead && (
                <button
                  onClick={() => handleMarkAsRead(item.id)}
                  className="btn btn-xs btn-outline shrink-0 text-[10px]"
                  title="Mark as Read"
                >
                  Mark read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
