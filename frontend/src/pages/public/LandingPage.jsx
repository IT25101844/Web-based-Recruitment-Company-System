import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, MapPin, Briefcase, ArrowRight, ShieldCheck, CheckCircle2,
  Users, Building, TrendingUp, Sparkles, Award
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { JobCard } from '../../components/domain/JobCard';
import api from '../../services/api';

export const LandingPage = () => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const res = await api.get('/jobs?size=4');
        setFeaturedJobs(res.data.content || []);
      } catch (err) {
        console.error('Failed to load featured jobs', err);
      } finally {
        setLoadingJobs(false);
      }
    };
    
    const loadCategories = async () => {
      try {
        const res = await api.get('/skills');
        const skills = res.data || [];
        // Group skills into categories for display
        const categoryMap = {
          'Software Engineering': { icon: Briefcase, skills: [] },
          'Cloud & DevOps': { icon: TrendingUp, skills: [] },
          'UI/UX & Design': { icon: Sparkles, skills: [] },
          'QA & Testing': { icon: ShieldCheck, skills: [] },
          'Data & AI': { icon: Award, skills: [] },
          'Product & Agile': { icon: Users, skills: [] }
        };
        
        // Distribute skills across categories (simple mapping)
        skills.forEach((skill, index) => {
          const categoryKeys = Object.keys(categoryMap);
          const categoryKey = categoryKeys[index % categoryKeys.length];
          categoryMap[categoryKey].skills.push(skill);
        });
        
        // Convert to array format with counts
        const categoriesArray = Object.entries(categoryMap).map(([title, data]) => ({
          title,
          count: `${data.skills.length} Skills`,
          icon: data.icon
        }));
        
        setCategories(categoriesArray);
      } catch (err) {
        console.error('Failed to load categories', err);
        // Fallback to basic categories if API fails
        setCategories([
          { title: 'Software Engineering', count: 'Technology', icon: Briefcase },
          { title: 'Cloud & DevOps', count: 'Infrastructure', icon: TrendingUp },
          { title: 'UI/UX & Design', count: 'Design', icon: Sparkles },
          { title: 'QA & Testing', count: 'Quality', icon: ShieldCheck },
          { title: 'Data & AI', count: 'Analytics', icon: Award },
          { title: 'Product & Agile', count: 'Management', icon: Users }
        ]);
      }
    };
    
    loadFeatured();
    loadCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.append('keyword', keyword);
    if (location) params.append('location', location);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(180deg, #e0f2fe 0%, #f8fafc 100%)',
        paddingTop: '4.5rem',
        paddingBottom: '5rem',
        borderBottom: '1px solid var(--color-border-light)'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '880px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#ffffff',
            padding: '0.35rem 1rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--color-border-light)',
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: 'var(--color-primary)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '1.5rem'
          }}>
            <ShieldCheck size={16} /> LankaHire Solutions (Pvt) Ltd Enterprise Talent Cloud
          </div>

          <h1 style={{
            fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            marginBottom: '1.25rem',
            lineHeight: 1.15
          }}>
            Find the right opportunity.<br />
            <span style={{
              background: 'linear-gradient(90deg, #0284c7, #0369a1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Build your career with JobConnect.
            </span>
          </h1>

          <p style={{
            fontSize: '1.125rem',
            color: 'var(--color-text-muted)',
            marginBottom: '2.5rem',
            maxWidth: '680px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: 1.6
          }}>
            Sri Lanka’s premier recruitment SaaS connecting top software engineers, designers, and tech leaders directly with verified enterprises.
          </p>

          {/* Search Box */}
          <form
            onSubmit={handleSearch}
            className="card"
            style={{
              padding: '0.875rem',
              borderRadius: 'var(--radius-xl)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              boxShadow: 'var(--shadow-xl)',
              alignItems: 'center',
              backgroundColor: '#ffffff'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flex: 1, minWidth: '220px', padding: '0.5rem 0.75rem' }}>
              <Search size={20} color="var(--color-primary)" />
              <input
                type="text"
                placeholder="Job title, skill, or keyword..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9375rem' }}
              />
            </div>

            <div style={{ height: '28px', width: '1px', backgroundColor: 'var(--color-border-light)' }} className="desktop-nav" />

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flex: 1, minWidth: '200px', padding: '0.5rem 0.75rem' }}>
              <MapPin size={20} color="var(--color-primary)" />
              <input
                type="text"
                placeholder="City or Remote (e.g. Colombo)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9375rem' }}
              />
            </div>

            <Button type="submit" variant="primary" size="lg" style={{ borderRadius: 'var(--radius-lg)' }}>
              Search Vacancies
            </Button>
          </form>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '4.5rem 0', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>Explore by Popular Categories</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem', margin: 0 }}>
                Discover vacancies in leading technology domains
              </p>
            </div>
            <Link to="/jobs" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
              All Jobs <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.25rem'
          }}>
            {categories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <div
                  key={i}
                  className="card card-hover"
                  style={{
                    padding: '1.5rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                  onClick={() => navigate(`/jobs?keyword=${encodeURIComponent(cat.title)}`)}
                >
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-primary-light)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem'
                  }}>
                    <Icon size={24} />
                  </div>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '0.25rem' }}>{cat.title}</h4>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>{cat.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section style={{ padding: '4.5rem 0', backgroundColor: 'var(--color-background)', borderTop: '1px solid var(--color-border-light)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>Featured Opportunities</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem', margin: 0 }}>
                Verified openings from LankaHire's corporate partner network
              </p>
            </div>
            <Link to="/jobs" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
              Browse all vacancies <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </section>

      {/* Dual CTA */}
      <section style={{ padding: '5rem 0', backgroundColor: '#ffffff', borderTop: '1px solid var(--color-border-light)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem'
          }}>
            {/* Candidate Card */}
            <div className="card" style={{
              background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
              borderColor: '#bbf7d0',
              padding: '2.5rem'
            }}>
              <div style={{
                background: '#d1fae5',
                color: '#065f46',
                width: 44,
                height: 44,
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <Users size={24} />
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>Are You Looking for a Job?</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Build your verified candidate profile, showcase education & experience, upload your CV, export professional PDFs, and get noticed by top employers.
              </p>
              <Link to="/register">
                <Button variant="primary" size="md">
                  Register as Candidate <ArrowRight size={16} />
                </Button>
              </Link>
            </div>

            {/* Employer Card */}
            <div className="card" style={{
              background: 'linear-gradient(135deg, #e0f2fe 0%, #ffffff 100%)',
              borderColor: '#bae6fd',
              padding: '2.5rem'
            }}>
              <div style={{
                background: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                width: 44,
                height: 44,
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <Building size={24} />
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>Are You Hiring Talent?</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Post vacancies, filter candidates with precision, review CVs, shortlist applicants, and like candidates to express immediate hiring interest.
              </p>
              <Link to="/register?type=employer">
                <Button variant="secondary" size="md">
                  Register as Employer <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Quality Section */}
      <section style={{ padding: '4rem 0', backgroundColor: '#f8fafc', borderTop: '1px solid var(--color-border-light)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Enterprise Trust & Compliance</h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2.5rem', fontSize: '0.9375rem' }}>
            Built to strict software engineering standards for LankaHire Solutions
          </p>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '2.5rem',
            color: 'var(--color-text-muted)',
            fontWeight: 600,
            fontSize: '0.9375rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 color="var(--color-success)" size={20} /> Verified Corporate Entities
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 color="var(--color-success)" size={20} /> Real-Time CV PDF Generation
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 color="var(--color-success)" size={20} /> Automated Expiration Schedulers
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 color="var(--color-success)" size={20} /> End-to-End Audit Trail
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
