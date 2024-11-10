"use client";

import { useState } from "react";
import { IoFilter } from "react-icons/io5";
import { TagBySearchRequest } from "@/types/tag";
import { createInitialRow, FilterRow } from "@/components/loadimage/filterBox";
import BatchList from "@/components/image/BatchList";
import { FilterModal } from "@/components/loadimage/filterModal";

interface FilterSectionProps {
    tags: string[];
    onFilterApply: (filterData: TagBySearchRequest) => void;
}

export function FilterSection({ tags, onFilterApply }: FilterSectionProps) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterRows, setFilterRows] = useState<FilterRow[]>([
        createInitialRow(),
    ]);

    const handleDone = (filterData: TagBySearchRequest) => {
        onFilterApply(filterData);
        setIsFilterOpen(false);
    };

    return (
        <div className="min-h-[80vh] flex flex-[2] flex-col gap-4">
            <div
                className="relative h-[8%] hover:bg-gray-100 flex justify-between border border-solid border-gray-300 rounded-lg p-2 cursor-pointer items-center"
                onClick={() => setIsFilterOpen(true)}
            >
                <div className="flex justify-between items-center min-w-full">
                    {tags.length === 0 ? "태그 로딩중..." : "필터링"}
                    <IoFilter />
                </div>
            </div>
            <div className="h-[92%] border border-solid border-gray-300 rounded-lg p-4">
                <BatchList />
            </div>
            <FilterModal
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onDone={handleDone}
                tags={tags}
                filterRows={filterRows}
                setFilterRows={setFilterRows}
            />
        </div>
    );
}
