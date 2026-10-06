import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import CandidateCard from '../../components/domain/CandidateCard';
import Pagination from '../../components/common/Pagination';
import { Search, Filter, MapPin, GraduationCap, Briefcase, Heart, Download } from 'lucide-react';

export default function EmployerCandidateSearchPage() {
  const { showToast } = useToast();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Filters
  const [title, setTitle] = useState('');
  const [skills, setSkills] = useState('');
  const [education, setEducation] = useState('');
  const [location, setLocation] = useState('');

  // Liked IDs set for instant UI toggle
  const [likedCandidateIds, setLikedCandidateIds] = useState(new Set());

  useEffect(() => {
    fetchInitialLikes();
    fetchCandidates(0);
  }, []);

  const fetchInitialLikes = async () => {
    try {
      const res = await api.get('/employers/candidates/liked');
      const data = res.data.content || res.data || [];
      if (Array.isArray(data)) {
        const ids = new Set(data.map(l => l.candidateId || l.id));
        setLikedCandidateIds(ids);
      }
    } catch (err) {
      console.warn('Likes fetch error', err);
    }
  };

  const fetchCandidates = async (pageNumber = 0) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', pageNumber);
      params.append('size', 10);
      if (title.trim()) params.append('keyword', title.trim());
      if (skills.trim()) params.append('skill', skills.trim());
      if (education.trim()) params.append('education', education.trim());
      if (location.trim()) params.append('location', location.trim());

      const res = await api.get(`/employers/candidates?${params.toString()}`);
      const data = res.data.content || res.data;
      setCandidates(Array.isArray(data) ? data : []);
      setTotalPages(res.data.totalPages || 1);
      setTotalElements(res.data.totalElements || 0);
      setPage(pageNumber);
    } catch (error) {
      showToast('Error searching candidates', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCandidates(0);
  };

  const handleReset = () => {
    setTitle('');
    setSkills('');
    setEducation('');
    setLocation('');
    fetchCandidates(0);
  };

  const handleToggleLike = async (candidateId) => {
    const isLiked = likedCandidateIds.has(candidateId);
    try {
      if (isLiked) {
        await api.delete(`/employers/candidates/${candidateId}/like`);
        setLikedCandidateIds(prev => {
          const next = new Set(prev);
          next.delete(candidateId);
          return next;
        });
        showToast('Removed from liked candidates', 'info');
      } else {
        await api.post(`/employers/candidates/${candidateId}/like`);
        setLikedCandidateIds(prev => new Set(prev).add(candidateId));
        showToast('Candidate liked! They received a notification.', 'success');
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Error updating like status', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Talent Search & Sourcing</h1>
        <p className="text-sm text-gray-500">
          Filter verified candidates across Sri Lanka by technical stack, academic qualification, and geographic location.
        </p>
      </div>

      {/* Search & Filter Form */}
      <form onSubmit={handleSearchSubmit} className="card p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
              Headline / Title
            </label>
            <div className="relative">
              <Briefcase size={14} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Java, Full-Stack"
                className="input pl-8 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
              Skills (comma separated)
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. Spring Boot, React, MySQL"
                className="input pl-8 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
              Education / Degree
            </label>
            <div className="relative">
              <GraduationCap size={14} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="e.g. BSc, Computer Science"
                className="input pl-8 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
              Location / City
            </label>
            <div className="relative">
              <MapPin size={14} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Colombo, Kandy, Galle"
                className="input pl-8 text-xs"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-800">
          <span className="text-xs font-medium text-gray-500">
            {totalElements} candidate(s) found
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-outline btn-sm text-xs"
            >
              Reset
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm text-xs flex items-center gap-1 shadow"
            >
              <Search size={14} /> Filter Candidates
            </button>
          </div>
        </div>
      </form>

      {/* Candidate Search Results */}
      {loading ? (
        <LoadingSpinner text="Searching candidate profiles..." />
      ) : candidates.length === 0 ? (
        <div className="card p-12 text-center">
          <Search className="mx-auto text-gray-300 dark:text-gray-600 mb-3" size={40} />
          <h3 className="font-bold text-gray-800 dark:text-gray-200">No candidates match your criteria</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms, broadening the required skills, or removing location constraints.
          </p>
          <button onClick={handleReset} className="btn btn-sm btn-outline mt-4">
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {candidates.map(c => (
              <CandidateCard
                key={c.id}
                candidate={c}
                isLiked={likedCandidateIds.has(c.id)}
                onToggleLike={() => handleToggleLike(c.id)}
              />
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => fetchCandidates(p)}
          />
        </div>
      )}
    </div>
  );
}
