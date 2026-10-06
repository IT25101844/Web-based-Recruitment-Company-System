import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, User, Briefcase, FileText, Calendar, MessageSquare,
  Bell, Heart, Search, Users, ShieldAlert, CheckCircle, FileCheck,
  LifeBuoy, LogOut, Settings, AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = () => {
  const { user, hasRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-md)',
    color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
    backgroundColor: isActive ? 'var(--color-primary-light)' : 'transparent',
    fontWeight: isActive ? 600 : 500,
    fontSize: '0.875rem',
    textDecoration: 'none',
    transition: 'all var(--transition-fast)'
  });

  return (
    <aside style={{
      width: '260px',
      backgroundColor: 'var(--color-surface)',
      borderRight: '1px solid var(--color-border-light)',
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 76px)',
      position: 'sticky',
      top: '76px',
      flexShrink: 0
    }}>
      {/* User Card */}
      <div style={{
        padding: '1.25rem',
        borderBottom: '1px solid var(--color-border-light)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.875rem',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--color-primary-light)',
          color: 'var(--color-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: '1.1rem',
          flexShrink: 0
        }}>
          {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-main)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {user?.fullName || 'User'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', marginTop: '2px' }}>
            {user?.roles?.[0]?.replace('_', ' ') || 'Member'}
          </div>
        </div>
      </div>

      {/* Nav Menu */}
      <div style={{ padding: '1rem', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {/* Candidate Links */}
        {hasRole('JOB_SEEKER') && (
          <>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-light)', padding: '0.75rem 0.75rem 0.25rem' }}>
              Candidate Portal
            </span>
            <NavLink to="/candidate/dashboard" style={linkStyle}>
              <LayoutDashboard size={18} /> Dashboard
            </NavLink>
            <NavLink to="/candidate/profile" style={linkStyle}>
              <User size={18} /> My Profile & CV
            </NavLink>
            <NavLink to="/candidate/applications" style={linkStyle}>
              <FileText size={18} /> My Applications
            </NavLink>
            <NavLink to="/candidate/interviews" style={linkStyle}>
              <Calendar size={18} /> Interviews
            </NavLink>
            <NavLink to="/candidate/messages" style={linkStyle}>
              <MessageSquare size={18} /> Messages
            </NavLink>
            <NavLink to="/candidate/notifications" style={linkStyle}>
              <Bell size={18} /> Notifications
            </NavLink>
          </>
        )}

        {/* Employer Links */}
        {hasRole('EMPLOYER') && (
          <>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-light)', padding: '0.75rem 0.75rem 0.25rem' }}>
              Employer Portal
            </span>
            <NavLink to="/employer/dashboard" style={linkStyle}>
              <LayoutDashboard size={18} /> Dashboard
            </NavLink>
            <NavLink to="/employer/candidates" style={linkStyle}>
              <Search size={18} /> Find Candidates
            </NavLink>
            <NavLink to="/employer/likes" style={linkStyle}>
              <Heart size={18} /> Liked Candidates
            </NavLink>
            <NavLink to="/employer/jobs" style={linkStyle} end>
              <Briefcase size={18} /> Job Postings
            </NavLink>
            <NavLink to="/employer/jobs/create" style={linkStyle}>
              <FileCheck size={18} /> Post New Job
            </NavLink>
            <NavLink to="/employer/interviews" style={linkStyle}>
              <Calendar size={18} /> Interviews
            </NavLink>
            <NavLink to="/employer/messages" style={linkStyle}>
              <MessageSquare size={18} /> Messages
            </NavLink>
          </>
        )}

        {/* Recruitment Officer */}
        {hasRole('RECRUITMENT_OFFICER') && (
          <>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-light)', padding: '0.75rem 0.75rem 0.25rem' }}>
              Recruitment Officer
            </span>
            <NavLink to="/recruitment/dashboard" style={linkStyle}>
              <LayoutDashboard size={18} /> Overview
            </NavLink>
            <NavLink to="/employer/candidates" style={linkStyle}>
              <Search size={18} /> Candidate Search
            </NavLink>
            <NavLink to="/employer/jobs" style={linkStyle}>
              <Briefcase size={18} /> Jobs & Applications
            </NavLink>
            <NavLink to="/employer/interviews" style={linkStyle}>
              <Calendar size={18} /> Interview Pipeline
            </NavLink>
          </>
        )}

        {/* Operations Executive */}
        {hasRole('OPERATIONS_EXECUTIVE') && (
          <>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-light)', padding: '0.75rem 0.75rem 0.25rem' }}>
              Operations Executive
            </span>
            <NavLink to="/operations/dashboard" style={linkStyle}>
              <LayoutDashboard size={18} /> Operational Stats
            </NavLink>
            <NavLink to="/admin/employers" style={linkStyle}>
              <CheckCircle size={18} /> Verifications
            </NavLink>
            <NavLink to="/admin/jobs" style={linkStyle}>
              <Briefcase size={18} /> Job Approvals
            </NavLink>
          </>
        )}

        {/* Support Staff */}
        {(hasRole('CUSTOMER_SUPPORT') || hasRole('SUPPORT')) && (
          <>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-light)', padding: '0.75rem 0.75rem 0.25rem' }}>
              Support Desk
            </span>
            <NavLink to="/support/tickets" style={linkStyle}>
              <LifeBuoy size={18} /> Tickets & Complaints
            </NavLink>
          </>
        )}

        {/* Admin Links */}
        {(hasRole('ADMIN') || hasRole('SUPER_ADMIN')) && (
          <>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-light)', padding: '0.75rem 0.75rem 0.25rem' }}>
              System Admin
            </span>
            <NavLink to="/admin/dashboard" style={linkStyle}>
              <LayoutDashboard size={18} /> Overview
            </NavLink>
            <NavLink to="/admin/verifications" style={linkStyle}>
              <CheckCircle size={18} /> Employer Approval
            </NavLink>
            <NavLink to="/admin/jobs" style={linkStyle}>
              <Briefcase size={18} /> Job Approvals
            </NavLink>
            <NavLink to="/admin/users" style={linkStyle}>
              <Users size={18} /> User Moderation
            </NavLink>
            <NavLink to="/support/tickets" style={linkStyle}>
              <LifeBuoy size={18} /> Support Queue
            </NavLink>
            <NavLink to="/admin/complaints" style={linkStyle}>
              <AlertTriangle size={18} /> Complaints & Disputes
            </NavLink>
            <NavLink to="/admin/audit-logs" style={linkStyle}>
              <ShieldAlert size={18} /> Audit Trail
            </NavLink>
          </>
        )}
      </div>

      {/* Logout button at bottom */}
      <div style={{ padding: '1.25rem', borderTop: '1px solid var(--color-border-light)' }}>
        <button
          onClick={handleLogout}
          className="btn btn-outline"
          style={{ width: '100%', color: 'var(--color-danger)', borderColor: '#fecaca', justifyContent: 'center', gap: '0.5rem' }}
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
