"use client";

import { Tabs, Tab } from "@nextui-org/react";
import { PageContainer } from "@/components/common/pageContainer";
import { UploadContent } from "@/components/upload/uploadContent";
import { useImageState } from "@/hooks/useImageState";
import { useNavigation } from "@/hooks/useNavigation";
import { useFileValidation } from "@/hooks/filecheck/useFileValidation";
import { PageHeader } from "@/components/common/pageHeader";
import { useLoadContentState } from "@/hooks/useLoadContentState";
import { LoadContent } from "@/components/loadimage/LoadContent";
import { TagBySearchRequest } from "@/types/tag";
import { useState } from "react";
import { FilterSection } from "@/components/loadimage/FilterSection";
import { useParams } from "next/navigation";
import BatchList from "@/components/image/BatchList";

export default function ImageManage() {
    const params = useParams();
    const ProjectId = params.project_id as string;
    const [selectedTab, setSelectedTab] = useState("upload");
    const { images, addImages, deleteImage, deleteAllImages } = useImageState();
    const { goBack, goToLoadImages } = useNavigation(ProjectId);
    const { handleFileValidation } = useFileValidation({
        images,
        onValidFiles: addImages,
    });

    const loadContentState = useLoadContentState();
    const { tags, currentFilter, searchByFilter, setPage } = loadContentState;

    const handleMoveToDataset = async () => {
        await goToLoadImages(images, currentFilter);
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
                        <div className="flex">
                            <div className="w-[80%]">
                                <UploadContent
                                    images={images}
                                    onFileUpload={handleFileValidation}
                                    onDeleteImage={deleteImage}
                                    onDeleteAllImages={deleteAllImages}
                                />
                            </div>
                            <div className="w-[20%] h-[80vh] mx-8 mb-8 p-6 min-h-[80vh] border border-solid border-gray-300 rounded-lg overflow-y-auto">
                                <BatchList projectId={ProjectId}/>
                            </div>
                        </div>
                    ) : (
                        <LoadContent {...loadContentState} />
                    )}
                </div>
            </div>
        </PageContainer>
    );
}
