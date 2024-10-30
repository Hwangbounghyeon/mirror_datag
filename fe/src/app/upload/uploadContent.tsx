"use client";

import { Box } from "@chakra-ui/react";
import { useDropzone, FileRejection, DropEvent } from "react-dropzone";
import ImageUploader from "../component/image/ImageUploader";
import { UploadContentProps } from "../types/upload";
import { ACCEPTED_FILE_TYPES } from "../lib/constants/upload";
import { UploadedContent } from "./uploadedContent";
import { useFileValidation } from "./useFileValidation";
import { useFileSelection } from "./useFileSelection";

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
        <Box flex={1}>
            <Box
                {...getRootProps()}
                h="full"
                border="1px"
                borderStyle="solid"
                borderColor="gray.300"
                borderRadius="lg"
                p={6}
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
            </Box>
        </Box>
    );
};
