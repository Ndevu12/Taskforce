import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (pageNumber: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`p-2 ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-gray-300'} rounded mx-1`}
          onClick={() => onPageChange(i)}
        >
          {i}
        </button>,
      );
    }
    return pageNumbers;
  };

  return (
    <div className="flex justify-between mt-4 items-center">
      <button
        className="p-2 bg-gray-300 rounded"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <div className="flex">{renderPageNumbers()}</div>
      <label htmlFor="itemsPerPage" className="sr-only">
        Items per page
      </label>
      <select
        id="itemsPerPage"
        className="p-2 border border-gray-300 rounded"
        value={itemsPerPage}
        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
      >
        <option value={3}>3</option>
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={20}>20</option>
      </select>
      <button
        className="p-2 bg-gray-300 rounded"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
