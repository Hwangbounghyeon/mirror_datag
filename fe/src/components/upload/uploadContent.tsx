import { useDropzone, FileRejection, DropEvent } from "react-dropzone";
import ImageUploader from "../image/ImageUploader";
import { UploadContentProps } from "@/types/upload";
import { ACCEPTED_FILE_TYPES } from "@/lib/constants/upload";
import UploadedContent from "@/components/upload/uploadedContent";
import { useFileValidation } from "@/hooks/useFileValidation";
import { useFileSelection } from "@/hooks/useFileSelection";

export const UploadContent = ({
  images,
  onFileUpload,
  onDeleteImage,
  onDeleteAllImages,
}: UploadContentProps) => {
  const { uploadType, handleFileValidation } = useFileValidation({
    images,
    onValidFiles: onFileUpload,
  });

  const { handleSelectFiles, handleSelectFolder } =
    useFileSelection(handleFileValidation);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleFileValidation as <T extends File>(
      acceptedFiles: T[],
      fileRejections: FileRejection[],
      event: DropEvent
    ) => void,
    accept: ACCEPTED_FILE_TYPES,
    noClick: true,
    noKeyboard: true,
  });

  return (
    <div className="flex-1">
      <div
        {...getRootProps()}
        className="h-full border border-solid border-gray-300 rounded-lg p-6"
      >
        <input {...getInputProps()} />
        {images.length > 0 ? (
          <UploadedContent
            images={images}
            onDeleteAllImages={onDeleteAllImages}
            onDeleteImage={onDeleteImage}
            onSelectFiles={handleSelectFiles}
            onSelectFolder={handleSelectFolder}
          />
        ) : (
          <ImageUploader
            onSelectFiles={handleSelectFiles}
            onSelectFolder={handleSelectFolder}
          />
        )}
      </div>
    </div>
  );
};
