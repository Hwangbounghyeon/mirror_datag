import { Button } from "@nextui-org/react";
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
    <div className="flex justify-between items-center px-6 pb-8 pt-4 relative">
        <Button
            className="px-6 py-2 mx-2 border border-solid"
            onClick={onPrevious}
        >
            Previous
        </Button>

        <h1 className="text-4xl absolute left-1/2 -translate-x-1/2 font-bold">
            {title}
        </h1>

        <Button
            className="px-6 mx-2 py-2 rounded-lg border border-solid"
            onClick={onRightButtonClick}
        >
            {rightButtonText}
        </Button>
    </div>
);
