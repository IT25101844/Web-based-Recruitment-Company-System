import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Heart, Search, MapPin, Download, MessageSquare, Briefcase, ExternalLink } from 'lucide-react';

export default function EmployerLikedCandidatesPage() {
  const { showToast } = useToast();
  const [likedList, setLikedList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLiked();
  }, []);

  const fetchLiked = async () => {
    setLoading(true);
    try {
      const res = await api.get('/employers/candidates/liked');
      const data = res.data.content || res.data || [];
      setLikedList(Array.isArray(data) ? data : []);
    } catch (error) {
      showToast('Failed to load liked candidate pool', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlike = async (candidateId) => {
    try {
      await api.delete(`/employers/candidates/${candidateId}/like`);
      showToast('Removed candidate from favorites', 'info');
      setLikedList(prev => prev.filter(c => (c.candidateId || c.id) !== candidateId));
    } catch (error) {
      showToast('Failed to remove like', 'error');
    }
  };

  const handleDownloadCv = async (candidateId) => {
    try {
      const res = await api.get(`/candidates/${candidateId}/profile/pdf`, {
        responseType: 'blob'
      });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Candidate_${candidateId}_CV.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      showToast('Failed to download candidate CV', 'error');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading your favorited talent pool..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Heart size={24} className="text-rose-500 fill-rose-500" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Favorited Talent Pool</h1>
          </div>
          <p className="text-sm text-gray-500">
            Keep track of promising applicants, save profiles for future openings, or reach out directly.
          </p>
        </div>
        <Link to="/employer/candidates" className="btn btn-outline btn-sm flex items-center gap-1 self-start sm:self-auto">
          <Search size={14} /> Search More Candidates
        </Link>
      </div>

      {likedList.length === 0 ? (
        <div className="card p-12 text-center">
          <Heart size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <h3 className="font-bold text-gray-800 dark:text-gray-200">No Liked Candidates Yet</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Browse our candidate directory and click the Heart icon on candidate cards to curate your talent pipeline.
          </p>
          <div className="mt-4">
            <Link to="/employer/candidates" className="btn btn-primary btn-sm">
              Discover Candidates
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {likedList.map(c => {
            const candidateId = c.id;
            return (
              <div key={candidateId} className="card p-5 border border-gray-200 dark:border-gray-800 hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 flex items-center justify-center font-bold text-base">
                        {c.fullName?.charAt(0) || 'C'}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-base">
                          {c.fullName}
                        </h3>
                        <p className="text-xs text-primary-600 font-medium">
                          {c.headline || 'Professional Candidate'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleUnlike(candidateId)}
                      className="p-1.5 rounded-full text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 transition"
                      title="Remove from favorites"
                    >
                      <Heart size={20} className="fill-rose-500" />
                    </button>
                  </div>

                  {c.professionalSummary && (
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-3 line-clamp-2">
                      {c.professionalSummary}
                    </p>
                  )}

                  <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
                    {c.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={12} /> {c.location}
                      </span>
                    )}
                    <span>•</span>
                    <span>Favorited on {c.likedAt ? new Date(c.likedAt).toLocaleDateString() : 'Recently'}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <button
                    onClick={() => handleDownloadCv(candidateId)}
                    className="btn btn-xs btn-outline flex items-center gap-1"
                  >
                    <Download size={12} /> Download CV
                  </button>

                  <Link to={`/messages?userId=${c.userId || ''}`} className="btn btn-xs btn-primary flex items-center gap-1">
                    <MessageSquare size={12} /> Message
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
