import React, { useState } from 'react';
import { MapPin, Briefcase, GraduationCap, Heart, User, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../common/Button';
import { ProfileProgressBar } from '../common/ProfileProgressBar';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const CandidateCard = ({ candidate, onLikeToggle = null }) => {
  const [liked, setLiked] = useState(candidate.likedByCurrentUser);
  const [likesCount, setLikesCount] = useState(candidate.likesCount || 0);
  const [loadingLike, setLoadingLike] = useState(false);
  const toast = useToast();

  const handleLike = async (e) => {
    e.preventDefault();
    setLoadingLike(true);
    try {
      const res = await api.post(`/employers/candidates/${candidate.id}/like`);
      setLiked(res.data.liked);
      setLikesCount(res.data.totalLikes);
      toast.success(res.data.message);
      if (onLikeToggle) {
        onLikeToggle(candidate.id, res.data.liked);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update like status');
    } finally {
      setLoadingLike(false);
    }
  };

  return (
    <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '0.875rem' }}>
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '1.25rem',
            overflow: 'hidden',
            flexShrink: 0
          }}
        >
          {candidate.profilePicturePath ? (
            <img
              src={candidate.profilePicturePath}
              alt={candidate.fullName}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <User size={28} />
          )}
        </div>

        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '0.2rem' }}>
            <Link to={`/employer/candidates/${candidate.id}`} style={{ color: 'inherit' }}>
              {candidate.fullName}
            </Link>
          </h3>
          <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)', margin: 0 }}>
            {candidate.headline}
          </p>
          <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
            <MapPin size={13} /> {candidate.location}
          </span>
        </div>

        <button
          onClick={handleLike}
          disabled={loadingLike}
          style={{
            background: liked ? 'var(--danger-light)' : 'var(--bg-alt)',
            border: liked ? '1px solid #fca5a5' : '1px solid var(--color-border-light)',
            color: liked ? 'var(--color-danger)' : 'var(--color-text-muted)',
            padding: '0.45rem 0.65rem',
            borderRadius: 'var(--radius-full)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.8125rem',
            fontWeight: 600,
            transition: 'all var(--transition-fast)'
          }}
          title={liked ? 'Unlike candidate' : 'Like candidate'}
        >
          <Heart size={15} fill={liked ? 'currentColor' : 'none'} />
          <span>{liked ? 'Liked' : 'Like'}</span>
          {likesCount > 0 && <span>({likesCount})</span>}
        </button>
      </div>

      {candidate.professionalSummary && (
        <p style={{
          fontSize: '0.875rem',
          color: 'var(--color-text-muted)',
          lineHeight: 1.5,
          marginBottom: '0.875rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {candidate.professionalSummary}
        </p>
      )}

      {/* Experience & Education Highlights */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '0.875rem', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
        {candidate.latestExperience && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Briefcase size={14} color="var(--color-primary)" />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {candidate.latestExperience}
            </span>
          </div>
        )}
        {candidate.latestEducation && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <GraduationCap size={14} color="var(--color-primary)" />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {candidate.latestEducation}
            </span>
          </div>
        )}
      </div>

      {/* Skills */}
      {candidate.topSkills && candidate.topSkills.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
          {candidate.topSkills.map((sk, i) => (
            <span
              key={i}
              style={{
                fontSize: '0.75rem',
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary-hover)',
                padding: '0.2rem 0.5rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600
              }}
            >
              {sk}
            </span>
          ))}
        </div>
      )}

      {/* Profile Completion Indicator */}
      <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border-light)', marginBottom: '0.875rem' }}>
        <ProfileProgressBar percentage={candidate.profileCompletionPct} showDetails={false} />
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <Link to={`/employer/candidates/${candidate.id}`} style={{ flex: 1 }}>
          <Button variant="outline-primary" size="sm" style={{ width: '100%' }}>
            View Full Profile
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CandidateCard;
