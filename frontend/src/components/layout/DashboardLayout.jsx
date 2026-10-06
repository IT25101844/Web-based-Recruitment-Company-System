import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const DashboardLayout = ({ allowedRoles = [] }) => {
  const { isAuthenticated, loading, user, hasRole } = useAuth();

  if (loading) {
    return <LoadingSpinner text="Authenticating session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0) {
    const hasPermission = allowedRoles.some((role) => hasRole(role));
    if (!hasPermission) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
            <h2 style={{ color: 'var(--color-danger)', marginBottom: '1rem' }}>Access Denied</h2>
            <p style={{ color: 'var(--color-text-muted)' }}>You do not possess the required credentials to access this portal.</p>
          </div>
        </div>
      );
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <main style={{
          flex: 1,
          padding: '2rem',
          backgroundColor: 'var(--color-background)',
          maxWidth: 'calc(100vw - 260px)',
          overflowX: 'hidden'
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
