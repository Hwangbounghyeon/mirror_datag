import React from "react";

interface PageHeaderProps {
  title: string;
  onPrevious: () => void;
  rightButtonText: string;
  onRightButtonClick?: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  onPrevious,
  rightButtonText,
  onRightButtonClick,
}) => (
  <div className="flex justify-between items-center px-6 py-8 relative">
    <button className="text-blue-500 hover:text-blue-700" onClick={onPrevious}>
      Back
    </button>
    <h1 className="text-xl font-bold">{title}</h1>
    {onRightButtonClick && (
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={onRightButtonClick}
      >
        {rightButtonText}
      </button>
    )}
  </div>
);
