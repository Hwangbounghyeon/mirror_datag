import { Button, Flex } from "@chakra-ui/react";
import ImageGrid from "../component/image/ImageGrid";

export const UploadedContent = ({
    images,
    onDeleteAllImages,
    onDeleteImage,
    onSelectFiles,
    onSelectFolder,
}: {
    images: Array<{ src: string; name: string }>;
    onDeleteAllImages: () => void;
    onDeleteImage: (index: number) => void;
    onSelectFiles: () => void;
    onSelectFolder: () => void;
}) => (
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
                onClick={onSelectFiles}
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
                onClick={onSelectFolder}
            >
                Select Folder
            </Button>
        </Flex>
        <ImageGrid images={images} onDeleteImage={onDeleteImage} />
    </Flex>
);
