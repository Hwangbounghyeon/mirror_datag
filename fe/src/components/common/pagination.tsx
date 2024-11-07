import React from "react";
import Link from "next/link";

interface PaginationProps {
  totalPage: number;
  currentPage: number;
  queryStrings?: URLSearchParams;
  prefetch?: boolean | null;
}

const PaginationBar = ({
  totalPage,
  currentPage,
  queryStrings = new URLSearchParams(),
  prefetch = null,
}: PaginationProps) => {
  const createPageUrl = (pageNumber: number) => {
    const newQueryStrings = new URLSearchParams(queryStrings);
    newQueryStrings.set("page", pageNumber.toString());
    return `?${newQueryStrings.toString()}`;
  };

  return (
    <div className="flex items-center justify-center gap-2 my-4">
      {currentPage > 1 ? (
        <Link
          prefetch={prefetch}
          href={createPageUrl(currentPage - 1)}
          className="px-3 py-1 border rounded-md "
        >
          {" <"}
        </Link>
      ) : (
        <div className="px-3 py-1 border rounded-md opacity-50 bg-gray-800">
          X
        </div>
      )}
      {Array.from({ length: totalPage }, (_, i) => i + 1).map((page) => (
        <Link
          prefetch={prefetch}
          key={page}
          href={createPageUrl(page)}
          className={`px-3 py-1 border rounded-md ${
            currentPage === page ? "bg-blue-500 text-white" : ""
          }`}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPage ? (
        <Link
          prefetch={prefetch}
          href={createPageUrl(currentPage - 1)}
          className="px-3 py-1 border rounded-md "
        >
          {" <"}
        </Link>
      ) : (
        <div className="px-3 py-1 border rounded-md opacity-50 bg-gray-800">
          X
        </div>
      )}
    </div>
  );
};

export default PaginationBar;
