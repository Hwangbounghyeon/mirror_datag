"use client";

import { PageContainer } from "@/components/common/pageContainer";
import { UploadContent } from "@/components/upload/uploadContent";
import { useImageState } from "@/hooks/useImageState";
import { useNavigation } from "@/hooks/useNavigation";
import { useFileValidation } from "@/hooks/useFileValidation";
import { PageHeader } from "@/components/common/pageHeader";

export default function UploadPage() {
    const { images, addImages, deleteImage, deleteAllImages } = useImageState();

    const { goBack, goToLoadImages } = useNavigation();

    const { handleFileValidation } = useFileValidation({
        images,
        onValidFiles: addImages,
    });

    return (
        <PageContainer>
            <PageHeader
                title="Upload Image"
                rightButtonText="Move To Dataset"
                onRightButtonClick={goToLoadImages}
                onPrevious={goBack}
            />
            <UploadContent
                images={images}
                onFileUpload={handleFileValidation}
                onDeleteImage={deleteImage}
                onDeleteAllImages={deleteAllImages}
            />
        </PageContainer>
    );
}
