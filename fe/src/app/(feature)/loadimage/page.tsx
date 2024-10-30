"use client";

import { PageContainer } from "@/components/common/pageContainer";
import { PageHeader } from "@/components/common/pageHeader";
import { ContentContainer } from "@/components/common/contentContainer";
import { useLoadImages } from "@/hooks/useLoadImages";
import FilterComponent from "@/components/loadimage/filterBox";
import BatchList from "@/components/image/BatchList";
import ImageGrid from "@/components/image/ImageGrid";
import { useEffect, useRef, useState } from "react";

export default function LoadImagesPage() {
    const { handlePrevious, handleLoadImage, handleFilterClick } =
        useLoadImages();
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterBoxRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                filterBoxRef.current &&
                !filterBoxRef.current.contains(event.target as Node)
            ) {
                setIsFilterOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleDone = () => {
        setIsFilterOpen(false);
    };

    return (
        <PageContainer>
            <PageHeader
                title="Load Images"
                rightButtonText="Load Image"
                onPrevious={handlePrevious}
                onRightButtonClick={handleLoadImage}
            />

            <ContentContainer>
                <div className="flex-[7.5] h-[80vh]">
                    <div className="h-full border border-solid border-gray-300 rounded-lg p-6">
                        <ImageGrid images={[]} onDeleteImage={() => {}} />
                    </div>
                </div>

                <div className="h-[80vh] flex flex-[2.5] flex-col gap-4">
                    <div
                        ref={filterBoxRef}
                        className="relative h-[8%] border border-solid border-gray-300 rounded-lg p-2 cursor-pointer items-center"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsFilterOpen(!isFilterOpen);
                        }}
                    >
                        <div className="flex justify-between items-center">
                            필터링
                            <div
                                className={`transform transition-transform duration-200 ${
                                    isFilterOpen ? "rotate-180" : "rotate-0"
                                }`}
                            >
                                ▼
                            </div>
                        </div>
                        {isFilterOpen && (
                            <div
                                className="absolute top-[calc(100%-1px)] my-2 right-[-1px] w-[45vw] bg-white border border-gray-200 rounded-b-lg shadow-lg z-50"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <FilterComponent onDone={handleDone} />
                            </div>
                        )}
                    </div>
                    <div className="h-[92%] border border-solid border-gray-300 rounded-lg p-4">
                        <BatchList />
                    </div>
                </div>
            </ContentContainer>
        </PageContainer>
    );
}
