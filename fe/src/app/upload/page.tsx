"use client";

import { Provider } from "@/components/ui/provider";
import { PageContainer } from "@/components/common/pageContainer";
import { PageHeader } from "@/components/common/pageHeader";
import { UploadContent } from "./uploadContent";
import { useImageUpload } from "./useImageUpload";

export default function UploadPage() {
    const {
        images,
        handlePrevious,
        handleFileUpload,
        handleMoveToLoadImages,
        handleDeleteImage,
        handleDeleteAllImages,
    } = useImageUpload();

    return (
        <Provider>
            <PageContainer>
                <PageHeader
                    title="Upload Image"
                    rightButtonText="Move To Dataset"
                    onRightButtonClick={handleMoveToLoadImages}
                    onPrevious={handlePrevious}
                />
                <UploadContent
                    images={images}
                    onFileUpload={handleFileUpload}
                    onDeleteImage={handleDeleteImage}
                    onDeleteAllImages={handleDeleteAllImages}
                />
            </PageContainer>
        </Provider>
    );
}
