import { Box, Button, Flex } from "@chakra-ui/react";
import ImageGrid from "../component/image/ImageGrid";
import ImageUploader from "../component/image/ImageUploader";

interface UploadContentProps {
    hasImages: boolean;
    onSelectFiles?: () => void;
    onSelectFolder?: () => void;
}

export const UploadContent = ({
    hasImages,
    onSelectFiles,
    onSelectFolder,
}: UploadContentProps) => (
    <Box flex={1} px={8} pb={8}>
        <Box
            h="full"
            border="1px"
            borderStyle="solid"
            borderColor="gray.300"
            borderRadius="lg"
            p={6}
        >
            {hasImages ? (
                <Flex h="full" flexDir="column">
                    <Flex justify="flex-end" gap={4} mb={4}>
                        <Button
                            px={6}
                            py={2}
                            borderWidth={2}
                            borderStyle="dashed"
                            borderColor="gray.300"
                            borderRadius="lg"
                            color="gray.600"
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
                            color="gray.600"
                            _hover={{ bg: "gray.50" }}
                            onClick={onSelectFolder}
                        >
                            Select Folder
                        </Button>
                    </Flex>
                    <ImageGrid />
                </Flex>
            ) : (
                <ImageUploader />
            )}
        </Box>
    </Box>
);
