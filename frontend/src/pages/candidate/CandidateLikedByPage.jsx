import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Heart, Building2, MapPin, Globe, Briefcase, MessageSquare, ExternalLink } from 'lucide-react';

export default function CandidateLikedByPage() {
  const { showToast } = useToast();
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLikes();
  }, []);

  const fetchLikes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/candidates/my-likes');
      setLikes(res.data || []);
    } catch (error) {
      showToast('Failed to load companies interested in you', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Checking who liked your profile..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Heart className="text-rose-600 fill-rose-500" size={24} />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Employers Interested in You</h1>
        </div>
        <p className="text-sm text-gray-500">
          These verified companies have bookmarked your profile and may reach out for upcoming job vacancies.
        </p>
      </div>

      {likes.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/40 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500">
            <Heart size={32} />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white text-lg">No Likes Yet</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto mt-2 mb-6">
            Make sure your profile is 100% complete, add key skills, and highlight your past project experience to get noticed by top employers.
          </p>
          <Link to="/candidate/profile" className="btn btn-primary">
            Improve Your Profile
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {likes.map(item => (
            <div key={item.id || item.employerId} className="card p-5 hover:shadow-md transition border border-gray-200 dark:border-gray-800 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary-50 dark:bg-primary-950 flex items-center justify-center font-bold text-primary-600 text-lg border border-primary-200 dark:border-primary-800">
                      {item.companyName?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-base">
                        {item.companyName || 'Verified Employer'}
                      </h3>
                      <p className="text-xs text-gray-500 flex items-center gap-2">
                        <span>{item.industry || 'Technology'}</span>
                        {item.city && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-0.5"><MapPin size={11} /> {item.city}</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                  <span className="badge bg-rose-50 text-rose-600 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-medium">
                    <Heart size={12} className="fill-rose-500" /> Liked
                  </span>
                </div>

                {item.companyDescription && (
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-3 line-clamp-2">
                    {item.companyDescription}
                  </p>
                )}

                <div className="mt-3 text-[11px] text-gray-400">
                  Favorited on {item.likedAt ? new Date(item.likedAt).toLocaleDateString() : 'Recently'}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <Link to="/messages" className="btn btn-xs btn-outline flex items-center gap-1">
                  <MessageSquare size={12} /> Send Message
                </Link>
                <Link to={`/jobs?search=${encodeURIComponent(item.companyName || '')}`} className="btn btn-xs btn-primary flex items-center gap-1">
                  <Briefcase size={12} /> View Openings
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
