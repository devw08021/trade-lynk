import React from 'react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  totalPages: number; // total pages (e.g. 10)
  currentPage: number; // current page (0-based)
  onPageChange: (page: number) => void;
}

export default function Pagination({ totalPages, currentPage, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const handleClick = (page: number) => {
    if (page >= 0 && page < totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const generatePageRange = () => {
    const range: (number | 'ellipsis')[] = [];
    const showTotal = 5;

    const left = Math.max(1, currentPage - 1);
    const right = Math.min(totalPages - 2, currentPage + 1);

    range.push(0); // first page

    if (left > 1) range.push('ellipsis');

    for (let i = left; i <= right; i++) {
      range.push(i);
    }

    if (right < totalPages - 2) range.push('ellipsis');

    if (totalPages > 1) range.push(totalPages - 1); // last page

    return range;
  };

  const pageRange = generatePageRange();

  return (
    <nav className="flex space-x-1 items-center justify-center text-sm mt-4">
      <button
        onClick={() => handleClick(currentPage - 1)}
        className={cn(
          "px-3 py-1 rounded border",
          currentPage === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-muted"
        )}
        disabled={currentPage === 0}
      >
        Prev
      </button>

      {pageRange.map((item, idx) =>
        item === 'ellipsis' ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={item}
            onClick={() => handleClick(item)}
            className={cn(
              "px-3 py-1 rounded border",
              item === currentPage ? "bg-primary text-white" : "hover:bg-muted"
            )}
          >
            {item + 1}
          </button>
        )
      )}

      <button
        onClick={() => handleClick(currentPage + 1)}
        className={cn(
          "px-3 py-1 rounded border",
          currentPage === totalPages - 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-muted"
        )}
        disabled={currentPage === totalPages - 1}
      >
        Next
      </button>
    </nav>
  );
}
