import React from 'react';

export const ProfileProgressBar = ({ percentage = 20, showDetails = true }) => {
  const clamped = Math.min(Math.max(percentage, 0), 100);

  let barColor = 'var(--color-primary)';
  let badgeClass = 'badge-info';
  if (clamped >= 80) {
    barColor = 'var(--color-success)';
    badgeClass = 'badge-success';
  } else if (clamped >= 50) {
    barColor = 'var(--color-primary)';
    badgeClass = 'badge-info';
  } else {
    barColor = 'var(--color-warning)';
    badgeClass = 'badge-warning';
  }

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
          Profile Completion
        </span>
        <span className={`badge ${badgeClass}`} style={{ fontSize: '0.75rem', fontWeight: 700 }}>
          {clamped}% Complete
        </span>
      </div>
      <div className="progress-container" style={{ height: 9 }}>
        <div
          className="progress-bar"
          style={{
            width: `${clamped}%`,
            background: `linear-gradient(90deg, ${barColor}, #38bdf8)`
          }}
        />
      </div>
      {showDetails && clamped < 100 && (
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.35rem', display: 'block' }}>
          Tip: Add education, experience, skills, and upload your resume to reach 100%.
        </span>
      )}
    </div>
  );
};

export default ProfileProgressBar;
