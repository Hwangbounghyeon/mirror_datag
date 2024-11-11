import React from "react";

interface PaginationFooterProps {
  currentPage: number;
  totalPage: number;
  setCurrentPage: (targetPage: number) => void;
}

const PaginationFooter = ({ currentPage, totalPage, setCurrentPage }: PaginationFooterProps) => {
  return (
    <div className="flex items-center justify-center gap-2 my-4">
      {currentPage > 1 ? (
        <div
          onClick={() => setCurrentPage(currentPage - 1)}
          className="px-3 py-1 border rounded-md cursor-pointer"
        >
          {" <"}
        </div>
      ) : (
        <div className="px-3 py-1 border rounded-md opacity-50 bg-gray-800">
          X
        </div>
      )}
      {Array.from({ length: totalPage }, (_, i) => i + 1).map((page) => (
        <div
        key={page}
        onClick={() => setCurrentPage(page)}
          className={`px-3 py-1 border rounded-md cursor-pointer ${
            currentPage === page ? "bg-blue-500 text-white" : ""
          }`}
        >
          {page}
        </div>
      ))}

      {currentPage < totalPage ? (
        <div
          onClick={() => setCurrentPage(currentPage + 1)}
          className="px-3 py-1 border rounded-md cursor-pointer"
        >
          {" >"}
        </div>
      ) : (
        <div className="px-3 py-1 border rounded-md opacity-50 bg-gray-800">
          X
        </div>
      )}
    </div>
  );
};

export default PaginationFooter;
