import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const maxVisiblePages = 5;

    let visiblePages = pages;
    if (totalPages > maxVisiblePages) {
        const start = Math.max(0, Math.min(currentPage - Math.floor(maxVisiblePages / 2), totalPages - maxVisiblePages));
        visiblePages = pages.slice(start, start + maxVisiblePages);
    }

    return (
        <div className="flex items-center justify-center space-x-2 mt-6">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                    currentPage === 1
                        ? 'bg-gray-50 text-lightGray cursor-not-allowed'
                        : 'bg-white text-darkGray hover:bg-gray-50'
                } border border-gray-200`}
            >
                Previous
            </button>

            {totalPages > maxVisiblePages && currentPage > Math.floor(maxVisiblePages / 2) + 1 && (
                <>
                    <button
                        onClick={() => onPageChange(1)}
                        className="px-3 py-1 rounded-md border border-gray-200 bg-white text-darkGray hover:bg-gray-50"
                    >
                        1
                    </button>
                    {currentPage > Math.floor(maxVisiblePages / 2) + 2 && (
                        <span className="px-2 text-darkGray">...</span>
                    )}
                </>
            )}

            {visiblePages?.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-1 rounded-md border ${
                        currentPage === page
                            ? 'bg-primary text-white border-primary hover:bg-primary/90'
                            : 'bg-white text-darkGray hover:bg-gray-50 border-gray-200'
                    }`}
                >
                    {page}
                </button>
            ))}

            {totalPages > maxVisiblePages && currentPage < totalPages - Math.floor(maxVisiblePages / 2) && (
                <>
                    {currentPage < totalPages - Math.floor(maxVisiblePages / 2) - 1 && (
                        <span className="px-2 text-darkGray">...</span>
                    )}
                    <button
                        onClick={() => onPageChange(totalPages)}
                        className="px-3 py-1 rounded-md border border-gray-200 bg-white text-darkGray hover:bg-gray-50"
                    >
                        {totalPages}
                    </button>
                </>
            )}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
                    currentPage === totalPages
                        ? 'bg-gray-50 text-lightGray cursor-not-allowed'
                        : 'bg-white text-darkGray hover:bg-gray-50'
                } border border-gray-200`}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
