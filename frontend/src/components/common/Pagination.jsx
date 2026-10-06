import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({
  currentPage = 0,
  totalPages = 1,
  onPageChange
}) => {
  if (totalPages <= 1) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
      <button
        className="btn btn-outline btn-sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        aria-label="Previous Page"
      >
        <ChevronLeft size={16} />
        <span>Prev</span>
      </button>

      <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: '0 0.5rem' }}>
        Page <strong>{currentPage + 1}</strong> of <strong>{totalPages}</strong>
      </span>

      <button
        className="btn btn-outline btn-sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
        aria-label="Next Page"
      >
        <span>Next</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
