import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ShieldCheck, Heart, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#0f172a',
      color: '#ffffff',
      paddingTop: '4rem',
      paddingBottom: '2rem',
      marginTop: 'auto'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {/* Col 1 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, var(--color-primary), #38bdf8)',
                color: '#ffffff',
                width: 40,
                height: 40,
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Briefcase size={22} />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 700, color: '#ffffff' }}>
                Job<span style={{ color: 'var(--color-primary)' }}>Connect</span>
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Enterprise recruitment and talent acquisition platform developed for LankaHire Solutions (Pvt) Ltd. Connecting top talent with verified global employers.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.1rem', marginBottom: '1.25rem' }}>For Candidates</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li><Link to="/jobs" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color var(--transition-fast)' }} onMouseOver={e => e.target.style.color = 'var(--color-primary)'} onMouseOut={e => e.target.style.color = '#94a3b8'}>Browse All Jobs</Link></li>
              <li><Link to="/register" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color var(--transition-fast)' }} onMouseOver={e => e.target.style.color = 'var(--color-primary)'} onMouseOut={e => e.target.style.color = '#94a3b8'}>Create Candidate Profile</Link></li>
              <li><Link to="/candidate/profile" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color var(--transition-fast)' }} onMouseOver={e => e.target.style.color = 'var(--color-primary)'} onMouseOut={e => e.target.style.color = '#94a3b8'}>Export Profile as PDF</Link></li>
              <li><Link to="/candidate/applications" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color var(--transition-fast)' }} onMouseOver={e => e.target.style.color = 'var(--color-primary)'} onMouseOut={e => e.target.style.color = '#94a3b8'}>Track Applications</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.1rem', marginBottom: '1.25rem' }}>For Employers</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li><Link to="/employer/candidates" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color var(--transition-fast)' }} onMouseOver={e => e.target.style.color = 'var(--color-primary)'} onMouseOut={e => e.target.style.color = '#94a3b8'}>Search Verified Talent</Link></li>
              <li><Link to="/employer/jobs/create" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color var(--transition-fast)' }} onMouseOver={e => e.target.style.color = 'var(--color-primary)'} onMouseOut={e => e.target.style.color = '#94a3b8'}>Post Vacancies</Link></li>
              <li><Link to="/employer/likes" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color var(--transition-fast)' }} onMouseOver={e => e.target.style.color = 'var(--color-primary)'} onMouseOut={e => e.target.style.color = '#94a3b8'}>Liked Candidates</Link></li>
              <li><Link to="/employer/dashboard" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color var(--transition-fast)' }} onMouseOver={e => e.target.style.color = 'var(--color-primary)'} onMouseOut={e => e.target.style.color = '#94a3b8'}>Hiring Pipeline</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.1rem', marginBottom: '1.25rem' }}>Contact & Trust</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', fontSize: '0.9rem', color: '#94a3b8' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={18} color="var(--color-primary)" /> Colombo, Sri Lanka
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={18} color="var(--color-primary)" /> support@jobconnect.local
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={18} color="var(--color-primary)" /> +94 11 234 5678
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-success)' }}>
                <ShieldCheck size={18} /> 100% Verified Employers
              </span>
            </div>
          </div>
        </div>

        <div style={{
          paddingTop: '2rem',
          borderTop: '1px solid #1e293b',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.875rem',
          color: '#64748b'
        }}>
          <span>&copy; 2026 LankaHire Solutions (Pvt) Ltd. All rights reserved. JobConnect Platform.</span>
          <span>Academic Software Engineering SaaS Project</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
