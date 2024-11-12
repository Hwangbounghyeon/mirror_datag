"use client";

import { Tabs, Tab } from "@nextui-org/react";
import { PageContainer } from "@/components/common/pageContainer";
import { UploadContent } from "@/components/upload/uploadContent";
import { useImageState } from "@/hooks/useImageState";
import { useNavigation } from "@/hooks/useNavigation";
import { useFileValidation } from "@/hooks/filecheck/useFileValidation";
import { PageHeader } from "@/components/common/pageHeader";
import { useLoadContentState } from "@/hooks/useLoadContentState";
import { LoadContent } from "@/app/(feature)/loadimage/LoadContent";
import { TagBySearchRequest } from "@/types/tag";
import { FilterSection } from "@/app/(feature)/loadimage/FilterSection";
import { useState } from "react";

export default function ImageManage() {
    const [selectedTab, setSelectedTab] = useState("upload");
    const { images, addImages, deleteImage, deleteAllImages } = useImageState();
    const { goBack, goToLoadImages } = useNavigation();
    const { handleFileValidation } = useFileValidation({
        images,
        onValidFiles: addImages,
    });

    const loadContentState = useLoadContentState();
    const { tags, currentFilter, searchByFilter, setPage } = loadContentState;

    const handleMoveToDataset = async () => {
        await goToLoadImages(images);
    };

    const handleFilterApply = (filterData: TagBySearchRequest) => {
        setPage(1);
        searchByFilter(filterData, 1);
    };

    return (
        <PageContainer>
            <PageHeader
                title="Image Management"
                rightButtonText="Upload and Move to Dataset"
                onRightButtonClick={handleMoveToDataset}
                onPrevious={goBack}
            />

            <div className="w-full">
                <div className="mx-8 flex justify-between items-center">
                    <Tabs
                        aria-label="For Image Management"
                        variant="bordered"
                        size="lg"
                        radius="sm"
                        selectedKey={selectedTab}
                        onSelectionChange={(key) =>
                            setSelectedTab(key.toString())
                        }
                    >
                        <Tab key="upload" title="Upload" />
                        <Tab key="load" title="Load" />
                    </Tabs>
                    {selectedTab === "load" && (
                        <FilterSection
                            tags={tags}
                            currentFilter={currentFilter}
                            onFilterApply={handleFilterApply}
                        />
                    )}
                </div>

                <div className="mt-4">
                    {selectedTab === "upload" ? (
                        <UploadContent
                            images={images}
                            onFileUpload={handleFileValidation}
                            onDeleteImage={deleteImage}
                            onDeleteAllImages={deleteAllImages}
                        />
                    ) : (
                        <LoadContent {...loadContentState} />
                    )}
                </div>
            </div>
        </PageContainer>
    );
}
