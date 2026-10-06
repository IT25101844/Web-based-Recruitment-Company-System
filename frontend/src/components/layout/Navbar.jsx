import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, User, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NotificationBell } from '../common/NotificationBell';

export const Navbar = () => {
  const { user, isAuthenticated, logout, hasRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (hasRole('ADMIN')) return '/admin/dashboard';
    if (hasRole('OPERATIONS_EXECUTIVE')) return '/operations/dashboard';
    if (hasRole('RECRUITMENT_OFFICER')) return '/recruitment/dashboard';
    if (hasRole('CUSTOMER_SUPPORT')) return '/support/dashboard';
    if (hasRole('EMPLOYER')) return '/employer/dashboard';
    return '/candidate/dashboard';
  };

  return (
    <nav className="glass" style={{
      position: 'sticky',
      top: 0,
      zIndex: 900,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '76px' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--color-primary), #38bdf8)',
            color: '#ffffff',
            width: 44,
            height: 44,
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(0, 102, 204, 0.3)'
          }}>
            <Briefcase size={24} />
          </div>
          <div>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text-main)', letterSpacing: '-0.02em', display: 'block', lineHeight: 1.1 }}>
              Job<span style={{ color: 'var(--color-primary)' }}>Connect</span>
            </span>
            <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              LankaHire Solutions
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }} className="desktop-nav">
          <Link to="/jobs" style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--color-text-muted)', transition: 'color var(--transition-fast)' }} onMouseOver={e => e.target.style.color = 'var(--color-primary)'} onMouseOut={e => e.target.style.color = 'var(--color-text-muted)'}>
            Find Jobs
          </Link>
          <Link to="/employer/candidates" style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--color-text-muted)', transition: 'color var(--transition-fast)' }} onMouseOver={e => e.target.style.color = 'var(--color-primary)'} onMouseOut={e => e.target.style.color = 'var(--color-text-muted)'}>
            Find Talent
          </Link>
          <Link to="/support" style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--color-text-muted)', transition: 'color var(--transition-fast)' }} onMouseOver={e => e.target.style.color = 'var(--color-primary)'} onMouseOut={e => e.target.style.color = 'var(--color-text-muted)'}>
            Support & Help
          </Link>
        </div>

        {/* Right CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <NotificationBell />

              <Link to={getDashboardPath()} className="btn btn-primary" style={{ gap: '0.5rem', borderRadius: '9999px', padding: '0.5rem 1.25rem' }}>
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>

              <button
                onClick={handleLogout}
                className="btn btn-outline"
                style={{ color: 'var(--color-danger)', gap: '0.5rem', borderRadius: '9999px', padding: '0.5rem 1.25rem' }}
                title="Sign out"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link to="/login" className="btn btn-outline" style={{ borderRadius: '9999px', padding: '0.5rem 1.5rem', fontWeight: 600 }}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ borderRadius: '9999px', padding: '0.5rem 1.5rem', fontWeight: 600 }}>
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
