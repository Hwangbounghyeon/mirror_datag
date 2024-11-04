"use client";

import { PageContainer } from "@/components/common/pageContainer";
import { PageHeader } from "@/components/common/pageHeader";
import { ContentContainer } from "@/components/common/contentContainer";
import { useLoadImages } from "@/hooks/useLoadImages";
import BatchList from "@/components/image/BatchList";
import ImageGrid from "@/components/image/ImageGrid";
import { useState } from "react";
import { IoFilter } from "react-icons/io5";
import { FilterModal } from "@/components/loadimage/filterModal";

export default function LoadImagesPage() {
    const { handlePrevious, handleLoadImage } = useLoadImages();
    const [isFilterOpen, setIsFilterOpen] = useState(false);

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
                <div className="flex-[7.5] min-h-[80vh]">
                    <div className="h-full border border-solid border-gray-300 rounded-lg p-6">
                        <ImageGrid images={[]} onDeleteImage={() => {}} />
                    </div>
                </div>

                <div className="min-h-[80vh] flex flex-[2.5] flex-col gap-4">
                    <div
                        className="relative h-[8%] hover:bg-gray-100 flex justify-between border border-solid border-gray-300 rounded-lg p-2 cursor-pointer items-center"
                        onClick={() => setIsFilterOpen(true)}
                    >
                        <div className="flex justify-between items-center min-w-full">
                            필터링
                            <IoFilter />
                        </div>
                    </div>
                    <div className="h-[92%] border border-solid border-gray-300 rounded-lg p-4">
                        <BatchList />
                    </div>
                </div>
            </ContentContainer>
            <FilterModal
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onDone={handleDone}
            />
        </PageContainer>
    );
}
