"use client";

import { PageContainer } from "@/components/common/pageContainer";
import { UploadContent } from "@/components/upload/uploadContent";
import { useImageState } from "@/hooks/useImageState";
import { useNavigation } from "@/hooks/useNavigation";
import { useFileValidation } from "@/hooks/useFileValidation";

export default function UploadPage() {
  const { images, addImages, deleteImage, deleteAllImages } = useImageState();

  const { goBack, goToLoadImages } = useNavigation();

  const { handleFileValidation } = useFileValidation({
    images,
    onValidFiles: addImages,
  });

  interface PageHeaderProps {
    title: string;
    onPrevious: () => void;
    rightButtonText: string;
    onRightButtonClick?: () => void;
  }

  const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    onPrevious,
    rightButtonText,
    onRightButtonClick,
  }) => (
    <div className="flex justify-between items-center px-6 py-8 relative">
      <button className="px-6 py-2" onClick={onPrevious}>
        Previous
      </button>

      <h1 className="text-4xl absolute left-1/2 -translate-x-1/2 font-bold">
        {title}
      </h1>

      <button
        className="px-6 mx-2 py-2 rounded-lg"
        onClick={onRightButtonClick}
      >
        {rightButtonText}
      </button>
    </div>
  );

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
