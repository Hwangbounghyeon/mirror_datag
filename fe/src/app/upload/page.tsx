"use client";

import { Provider } from "@/components/ui/provider";
import { PageContainer } from "@/components/common/pageContainer";
import { PageHeader } from "@/components/common/pageHeader";
import { UploadContent } from "./uploadContent";
import { useImageState } from "./useImageState";
import { useNavigation } from "./useNavigation";
import { useFileValidation } from "./useFileValidation";

export default function UploadPage() {
    const { images, addImages, deleteImage, deleteAllImages } = useImageState();

    const { goBack, goToLoadImages } = useNavigation();

    const { handleFileValidation } = useFileValidation({
        images,
        onValidFiles: addImages,
    });

    return (
        <Provider>
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
        </Provider>
    );
}
