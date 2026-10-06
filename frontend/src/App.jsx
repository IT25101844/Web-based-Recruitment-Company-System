import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import DashboardLayout from './components/layout/DashboardLayout';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import JobListingPage from './pages/public/JobListingPage';
import JobDetailsPage from './pages/public/JobDetailsPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import ForgotPasswordPage from './pages/public/ForgotPasswordPage';
import PublicSupportPage from './pages/public/PublicSupportPage';

// Candidate Pages
import CandidateDashboardPage from './pages/candidate/CandidateDashboardPage';
import CandidateProfilePage from './pages/candidate/CandidateProfilePage';
import CandidateApplicationsPage from './pages/candidate/CandidateApplicationsPage';
import CandidateLikedByPage from './pages/candidate/CandidateLikedByPage';
import CandidateInterviewsPage from './pages/candidate/CandidateInterviewsPage';

// Employer Pages
import EmployerDashboardPage from './pages/employer/EmployerDashboardPage';
import EmployerJobsPage from './pages/employer/EmployerJobsPage';
import JobPostCreateEditPage from './pages/employer/JobPostCreateEditPage';
import EmployerJobApplicantsPage from './pages/employer/EmployerJobApplicantsPage';
import EmployerCandidateSearchPage from './pages/employer/EmployerCandidateSearchPage';
import EmployerLikedCandidatesPage from './pages/employer/EmployerLikedCandidatesPage';
import EmployerCompanyProfilePage from './pages/employer/EmployerCompanyProfilePage';
import EmployerInterviewsPage from './pages/employer/EmployerInterviewsPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUserManagementPage from './pages/admin/AdminUserManagementPage';
import AdminJobModerationPage from './pages/admin/AdminJobModerationPage';
import AdminVerificationPage from './pages/admin/AdminVerificationPage';
import AdminAuditLogsPage from './pages/admin/AdminAuditLogsPage';
import AdminComplaintsPage from './pages/admin/AdminComplaintsPage';

// Support Pages
import SupportTicketListPage from './pages/support/SupportTicketListPage';
import CandidateHelpCenterPage from './pages/support/CandidateHelpCenterPage';

// Shared Pages
import MessagesPage from './pages/shared/MessagesPage';
import NotificationsPage from './pages/shared/NotificationsPage';

// Route Guard Component
function ProtectedRoute({ allowedRoles = [] }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0) {
    const userRoles = Array.isArray(user.roles) ? user.roles : [user.role || 'JOB_SEEKER'];
    const hasRole = userRoles.some(r => allowedRoles.includes(r));
    if (!hasRole) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}

// Redirect Hub Component
function DashboardRedirect() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const roles = Array.isArray(user.roles) ? user.roles : [user.role || 'JOB_SEEKER'];

  if (roles.includes('SUPER_ADMIN') || roles.includes('ADMIN')) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  if (roles.includes('EMPLOYER') || roles.includes('RECRUITER')) {
    return <Navigate to="/employer/dashboard" replace />;
  }
  if (roles.includes('SUPPORT') || roles.includes('CUSTOMER_SUPPORT')) {
    return <Navigate to="/support/tickets" replace />;
  }
  return <Navigate to="/candidate/dashboard" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Public Pages with Topbar and Footer */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/jobs" element={<JobListingPage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/public-support" element={<PublicSupportPage />} />
        <Route path="/support" element={<PublicSupportPage />} />
      </Route>

      {/* Central Dashboard Redirect */}
      <Route path="/dashboard" element={<DashboardRedirect />} />

      {/* Candidate Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['JOB_SEEKER', 'ADMIN', 'SUPER_ADMIN']} />}>
        <Route path="/candidate/dashboard" element={<CandidateDashboardPage />} />
        <Route path="/candidate/profile" element={<CandidateProfilePage />} />
        <Route path="/candidate/applications" element={<CandidateApplicationsPage />} />
        <Route path="/candidate/liked-by" element={<CandidateLikedByPage />} />
        <Route path="/candidate/interviews" element={<CandidateInterviewsPage />} />
        <Route path="/candidate/messages" element={<MessagesPage />} />
        <Route path="/candidate/notifications" element={<NotificationsPage />} />
      </Route>

      {/* Employer Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['EMPLOYER', 'RECRUITER', 'ADMIN', 'SUPER_ADMIN']} />}>
        <Route path="/employer/dashboard" element={<EmployerDashboardPage />} />
        <Route path="/employer/jobs" element={<EmployerJobsPage />} />
        <Route path="/employer/jobs/new" element={<JobPostCreateEditPage />} />
        <Route path="/employer/jobs/create" element={<JobPostCreateEditPage />} />
        <Route path="/employer/jobs/:id/edit" element={<JobPostCreateEditPage />} />
        <Route path="/employer/jobs/:id/applicants" element={<EmployerJobApplicantsPage />} />
        <Route path="/employer/candidates" element={<EmployerCandidateSearchPage />} />
        <Route path="/employer/liked-candidates" element={<EmployerLikedCandidatesPage />} />
        <Route path="/employer/likes" element={<EmployerLikedCandidatesPage />} />
        <Route path="/employer/profile" element={<EmployerCompanyProfilePage />} />
        <Route path="/employer/interviews" element={<EmployerInterviewsPage />} />
        <Route path="/employer/messages" element={<MessagesPage />} />
        <Route path="/employer/notifications" element={<NotificationsPage />} />
      </Route>

      {/* Admin & Operations Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN', 'OPERATIONS_EXECUTIVE']} />}>
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/users" element={<AdminUserManagementPage />} />
        <Route path="/admin/jobs" element={<AdminJobModerationPage />} />
        <Route path="/admin/verifications" element={<AdminVerificationPage />} />
        <Route path="/admin/employers" element={<AdminVerificationPage />} />
        <Route path="/admin/audit-logs" element={<AdminAuditLogsPage />} />
        <Route path="/admin/complaints" element={<AdminComplaintsPage />} />
      </Route>

      {/* Support Specialist Routes */}
      <Route element={<ProtectedRoute allowedRoles={['SUPPORT', 'CUSTOMER_SUPPORT', 'ADMIN', 'SUPER_ADMIN']} />}>
        <Route path="/support/tickets" element={<SupportTicketListPage />} />
        <Route path="/support/dashboard" element={<SupportTicketListPage />} />
      </Route>

      {/* Shared Authenticated Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/support/help" element={<CandidateHelpCenterPage />} />
        <Route path="/support/new" element={<CandidateHelpCenterPage />} />
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
