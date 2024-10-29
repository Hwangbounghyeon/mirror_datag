"use client";

import { Provider } from "@/components/ui/provider";
import { PageContainer } from "@/components/common/pageContainer";
import { PageHeader } from "@/components/common/pageHeader";
import { UploadContent } from "./uploadContent";
import { useImageUpload } from "./useImageUpload";

export default function UploadPage() {
    const {
        hasImages,
        handlePrevious,
        handleMoveToLoadImages,
        handleSelectFiles,
        handleSelectFolder,
    } = useImageUpload();

    return (
        <Provider>
            <PageContainer>
                <PageHeader
                    title="Upload Image"
                    rightButtonText="Move To Dataset"
                    onPrevious={handlePrevious}
                    onRightButtonClick={handleMoveToLoadImages}
                />
                <UploadContent
                    hasImages={hasImages}
                    onSelectFiles={handleSelectFiles}
                    onSelectFolder={handleSelectFolder}
                />
            </PageContainer>
        </Provider>
    );
}
