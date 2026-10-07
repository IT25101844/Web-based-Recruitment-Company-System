import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, CheckCheck, Trash2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { StatusBadge } from './StatusBadge';

export const NotificationBell = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchUnread = async () => {
    try {
      const res = await api.get('/notifications/unread-count');
      setUnreadCount(res.data.unreadCount || 0);
    } catch (err) {
      console.error('Failed to load unread notifications count', err);
    }
  };

  const fetchTopNotifications = async () => {
    try {
      const res = await api.get('/notifications/top');
      setNotifications(res.data || []);
    } catch (err) {
      console.error('Failed to load top notifications', err);
    }
  };

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000); // 30s poll
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchTopNotifications();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  };

  const markAllRead = async () => {
    try {
      await api.patch('/notifications/mark-all-read');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all read', err);
    }
  };

  const deleteNotification = async (id, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      fetchUnread();
    } catch (err) {
      console.error('Failed to delete notification', err);
    }
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'relative',
          background: 'none',
          border: 'none',
          padding: '0.5rem',
          cursor: 'pointer',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          color: 'var(--color-text-muted)',
          transition: 'background var(--transition-fast)'
        }}
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: 2,
              right: 2,
              backgroundColor: 'var(--color-danger)',
              color: '#ffffff',
              fontSize: '0.6875rem',
              fontWeight: 700,
              padding: '0.125rem 0.35rem',
              borderRadius: '9999px',
              minWidth: '18px',
              textAlign: 'center',
              lineHeight: 1
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: 360,
            maxHeight: 460,
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid var(--color-border-light)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1100,
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              padding: '0.875rem 1.25rem',
              borderBottom: '1px solid var(--color-border-light)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'var(--bg-alt)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-text-main)' }}>Notifications</span>
              {unreadCount > 0 && (
                <span className="badge badge-danger" style={{ fontSize: '0.6875rem', padding: '0.1rem 0.4rem' }}>
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-primary)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                <CheckCheck size={14} /> Mark all read
              </button>
            )}
          </div>

          <div style={{ overflowY: 'auto', flex: 1, maxHeight: 340 }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                No notifications yet.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  style={{
                    padding: '0.875rem 1.25rem',
                    borderBottom: '1px solid var(--color-border-light)',
                    backgroundColor: n.read ? '#ffffff' : 'rgba(2, 132, 199, 0.04)',
                    transition: 'background var(--transition-fast)',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: n.read ? 600 : 700, fontSize: '0.875rem', color: 'var(--color-text-main)' }}>
                      {n.title}
                    </span>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      {!n.read && (
                        <button
                          onClick={(e) => markAsRead(n.id, e)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', padding: 2 }}
                          title="Mark as read"
                        >
                          <Check size={14} />
                        </button>
                      )}
                      <button
                        onClick={(e) => deleteNotification(n.id, e)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: 2 }}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.4 }}>
                    {n.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
