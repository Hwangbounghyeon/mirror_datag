"use client";

import { PageContainer } from "@/components/common/pageContainer";
import { UploadContent } from "@/components/upload/uploadContent";
import { useImageState } from "@/hooks/useImageState";
import { useNavigation } from "@/hooks/useNavigation";
import { useFileValidation } from "@/hooks/filecheck/useFileValidation";
import { PageHeader } from "@/components/common/pageHeader";

export default function UploadPage() {
    const { images, addImages, deleteImage, deleteAllImages } = useImageState();

    const { goBack, goToLoadImages } = useNavigation();

    const { handleFileValidation } = useFileValidation({
        images,
        onValidFiles: addImages,
    });

    const handleMoveToDataset = async () => {
        await goToLoadImages(images);
    };

    return (
        <PageContainer>
            <PageHeader
                title="Upload Image"
                rightButtonText="Upload Images"
                onRightButtonClick={handleMoveToDataset}
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
