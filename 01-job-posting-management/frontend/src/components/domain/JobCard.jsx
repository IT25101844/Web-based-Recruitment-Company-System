import React from 'react';
import { MapPin, Briefcase, DollarSign, Calendar, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '../common/StatusBadge';
import { Button } from '../common/Button';

export const JobCard = ({ job, onApply = null }) => {
  const salaryText =
    job.salaryMin && job.salaryMax
      ? `${job.currency} ${Number(job.salaryMin).toLocaleString()} - ${Number(job.salaryMax).toLocaleString()}`
      : job.salaryMin
      ? `From ${job.currency} ${Number(job.salaryMin).toLocaleString()}`
      : null;

  const deadlineFormatted = job.deadline ? new Date(job.deadline).toLocaleDateString() : null;

  return (
    <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'center' }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-primary-light)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.1rem',
              flexShrink: 0
            }}
          >
            {job.companyName ? job.companyName.charAt(0).toUpperCase() : 'J'}
          </div>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '0.2rem' }}>
              <Link to={`/jobs/${job.id}`} style={{ color: 'inherit' }}>
                {job.title}
              </Link>
            </h3>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Building2 size={14} /> {job.companyName}
            </span>
          </div>
        </div>
        <StatusBadge status={job.jobType} />
      </div>

      <p style={{
        fontSize: '0.875rem',
        color: 'var(--color-text-muted)',
        margin: '0.75rem 0',
        lineHeight: 1.5,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        flex: 1
      }}>
        {job.description}
      </p>

      {/* Skills tags */}
      {job.requiredSkills && job.requiredSkills.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
          {job.requiredSkills.slice(0, 4).map((skill, i) => (
            <span
              key={i}
              style={{
                fontSize: '0.75rem',
                backgroundColor: 'var(--bg-alt)',
                color: 'var(--color-text-muted)',
                padding: '0.2rem 0.5rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 500
              }}
            >
              {skill}
            </span>
          ))}
          {job.requiredSkills.length > 4 && (
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', alignSelf: 'center' }}>
              +{job.requiredSkills.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Meta info bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        fontSize: '0.8125rem',
        color: 'var(--color-text-muted)',
        paddingTop: '0.75rem',
        borderTop: '1px solid var(--color-border-light)',
        marginBottom: '1rem'
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <MapPin size={14} color="var(--color-primary)" /> {job.location}
        </span>
        {salaryText && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <DollarSign size={14} color="var(--color-success)" /> {salaryText}
          </span>
        )}
        {deadlineFormatted && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Calendar size={14} /> Closes: {deadlineFormatted}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <Link to={`/jobs/${job.id}`} style={{ flex: 1 }}>
          <Button variant="outline" size="sm" style={{ width: '100%' }}>
            View Details
          </Button>
        </Link>
        {onApply && (
          <Button variant="primary" size="sm" onClick={() => onApply(job)} style={{ flex: 1 }}>
            Apply Now
          </Button>
        )}
      </div>
    </div>
  );
};

export default JobCard;
