import { Box, Button, Flex } from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import { useEffect, useState } from "react";
import ImageGrid from "../component/image/ImageGrid";
import ImageUploader from "../component/image/ImageUploader";

interface UploadContentProps {
    images: Array<{ src: string; name: string }>;
    onFileUpload: (files: File[]) => void;
    onDeleteImage: (index: number) => void;
    onDeleteAllImages: () => void;
}

export const UploadContent = ({
    images,
    onFileUpload,
    onDeleteImage,
    onDeleteAllImages,
}: UploadContentProps) => {
    const [uploadType, setUploadType] = useState<"zip" | "images" | null>(null);

    useEffect(() => {
        if (images.length === 0) {
            setUploadType(null);
        }
    }, [images]);

    const validateAndUploadFiles = (files: File[]) => {
        const zipFiles = files.filter(
            (file) =>
                file.type === "application/zip" ||
                file.type === "application/x-zip-compressed"
        );

        const existingFileNames = new Set(images.map((img) => img.name));
        const duplicateFiles = files.filter((file) =>
            existingFileNames.has(file.name)
        );

        if (duplicateFiles.length > 0) {
            alert(
                `이미 업로드된 파일이 있습니다: ${duplicateFiles
                    .map((f) => f.name)
                    .join(", ")}`
            );
            return;
        }

        const imageFiles = files.filter((file) =>
            file.type.startsWith("image/")
        );

        if (zipFiles.length > 0 && imageFiles.length > 0) {
            alert("zip와 이미지 파일을 동시에 업로드하지 마세요");
            return;
        }

        if (
            zipFiles.length > 0 &&
            (uploadType === null || uploadType === "zip")
        ) {
            if (zipFiles.length > 1) {
                alert("하나의 zip 파일만 올려주세요");
                return;
            }
            setUploadType("zip");
            onFileUpload([zipFiles[0]]);
        } else if (
            imageFiles.length > 0 &&
            (uploadType === null || uploadType === "images")
        ) {
            setUploadType("images");
            onFileUpload(imageFiles);
        } else {
            alert("zip파일과 이미지 파일 중 한 가지 타입만을 올려주세요.");
        }
    };

    const handleSelectFiles = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.multiple = true;
        input.accept = "image/*,.zip";
        input.onchange = (e) => {
            const files = Array.from(
                (e.target as HTMLInputElement).files || []
            );
            validateAndUploadFiles(files);
        };
        input.click();
    };

    // 폴더 선택 버튼 핸들러
    const handleSelectFolder = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.multiple = true;
        input.webkitdirectory = true;
        input.onchange = (e) => {
            const files = Array.from(
                (e.target as HTMLInputElement).files || []
            );
            validateAndUploadFiles(files);
        };
        input.click();
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: validateAndUploadFiles,
        accept: {
            "image/*": [".jpeg", ".jpg", ".png", ".gif"],
            "application/zip": [".zip"],
            "application/x-zip-compressed": [".zip"],
        },
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
                    <Flex h="full" flexDir="column">
                        <Flex justify="flex-end" gap={4} mb={4}>
                            <Button
                                px={6}
                                py={2}
                                bg="red.600"
                                color="white"
                                borderRadius="lg"
                                _hover={{ bg: "gray.100" }}
                                onClick={onDeleteAllImages}
                            >
                                Delete All Files
                            </Button>
                            <Button
                                px={6}
                                py={2}
                                borderWidth={2}
                                borderStyle="dashed"
                                borderColor="gray.300"
                                borderRadius="lg"
                                _hover={{ bg: "gray.100" }}
                                onClick={handleSelectFiles}
                            >
                                Select Files
                            </Button>
                            <Button
                                px={6}
                                py={2}
                                borderWidth={2}
                                borderStyle="dashed"
                                borderColor="gray.300"
                                borderRadius="lg"
                                _hover={{ bg: "gray.100" }}
                                onClick={handleSelectFolder}
                            >
                                Select Folder
                            </Button>
                        </Flex>
                        <ImageGrid
                            images={images}
                            onDeleteImage={onDeleteImage}
                        />
                    </Flex>
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
