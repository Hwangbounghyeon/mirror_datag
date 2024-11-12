"use client";

import { Pagination } from "@nextui-org/react";
import { ContentContainer } from "@/components/common/contentContainer";
import { LoadImageGrid } from "@/components/loadimage/loadImageGrid";
import { Suspense } from "react";
import { TagBySearchRequest } from "@/types/tag";
import { ImageArray } from "@/types/imageLoad";

interface LoadContentProps {
    page: number;
    setPage: (page: number) => void;
    images: ImageArray;
    isLoading: boolean;
    totalPages: number;
    currentFilter: TagBySearchRequest;
    searchByFilter: (
        filterConditions: TagBySearchRequest,
        page: number
    ) => Promise<void>;
}

export function LoadContent(props: LoadContentProps) {
    const {
        page,
        setPage,
        images,
        isLoading,
        totalPages,
        currentFilter,
        searchByFilter,
    } = props;

    const imageArray = images
        ? Object.entries(images || {}).map(([id, url]) => ({
              id,
              url,
          }))
        : [];

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        searchByFilter(currentFilter, newPage);
    };

    return (
        <div className="flex flex-col">
            <div className="flex flex-1">
                <ContentContainer>
                    <div className="flex-[10] min-h-[80vh]">
                        <div className="h-full border border-solid border-gray-300 rounded-lg p-6">
                            <Suspense
                                fallback={
                                    <div className="flex items-center justify-center h-full">
                                        <div>Loading images...</div>
                                    </div>
                                }
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div>Loading images...</div>
                                    </div>
                                ) : (
                                    <LoadImageGrid images={imageArray} />
                                )}
                            </Suspense>
                        </div>
                    </div>
                </ContentContainer>
            </div>

            <div className="flex justify-center py-4 border-t">
                <Pagination
                    total={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    showControls
                    boundaries={1}
                    siblings={1}
                    size="lg"
                    isDisabled={isLoading}
                />
            </div>
        </div>
    );
}
