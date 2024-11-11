"use client";

import { Tabs, Tab } from "@nextui-org/react";
import { PageContainer } from "@/components/common/pageContainer";
import { UploadContent } from "@/components/upload/uploadContent";
import { useImageState } from "@/hooks/useImageState";
import { useNavigation } from "@/hooks/useNavigation";
import { useFileValidation } from "@/hooks/useFileValidation";
import { PageHeader } from "@/components/common/pageHeader";
import { useLoadContentState } from "@/hooks/useLoadContentState";
import { LoadContent } from "@/app/(feature)/loadimage/LoadContent";

export default function ImageManage() {
    const { images, addImages, deleteImage, deleteAllImages } = useImageState();
    const { goBack, goToLoadImages } = useNavigation();
    const { handleFileValidation } = useFileValidation({
        images,
        onValidFiles: addImages,
    });

    const loadContentState = useLoadContentState();

    const handleMoveToDataset = async () => {
        await goToLoadImages(images);
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
                <Tabs
                    aria-label="For Image Management"
                    className="mx-8"
                    variant="bordered"
                    size="lg"
                    radius="sm"
                >
                    <Tab key="upload" title="Upload">
                        <UploadContent
                            images={images}
                            onFileUpload={handleFileValidation}
                            onDeleteImage={deleteImage}
                            onDeleteAllImages={deleteAllImages}
                        />
                    </Tab>
                    <Tab key="load" title="Load">
                        <LoadContent {...loadContentState} />
                    </Tab>
                </Tabs>
            </div>
        </PageContainer>
    );
}
