import React from 'react';

export const StatusBadge = ({ status }) => {
  if (!status) return null;

  const normalized = status.toUpperCase();

  let variant = 'badge-neutral';
  let label = status.replace(/_/g, ' ');

  switch (normalized) {
    case 'ACTIVE':
    case 'APPROVED':
    case 'VERIFIED':
    case 'SELECTED':
    case 'RESOLVED':
    case 'COMPLETED':
      variant = 'badge-success';
      break;

    case 'PENDING_REVIEW':
    case 'PENDING_VERIFICATION':
    case 'APPLIED':
    case 'SHORTLISTED':
    case 'IN_PROGRESS':
    case 'OPEN':
      variant = 'badge-warning';
      break;

    case 'INTERVIEW_SCHEDULED':
    case 'SCHEDULED':
      variant = 'badge-info';
      break;

    case 'REJECTED':
    case 'SUSPENDED':
    case 'CANCELLED':
    case 'HIGH':
      variant = 'badge-danger';
      break;

    case 'EXPIRED':
    case 'CLOSED':
    case 'LOW':
      variant = 'badge-neutral';
      break;

    default:
      variant = 'badge-neutral';
  }

  return <span className={`badge ${variant}`}>{label}</span>;
};

export default StatusBadge;
