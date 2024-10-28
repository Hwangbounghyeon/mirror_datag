"use client";

import { useState } from "react";
import { Box, Button, Text, Flex } from "@chakra-ui/react";
import ImageGrid from "../component/image/ImageGrid";
import ImageUploader from "../component/image/ImageUploader";
import BatchList from "../component/image/BatchList";

const ImageUploadLayout = () => {
    const [hasImages, setHasImages] = useState(true);

    return (
        <Box h="100vh" bg="white" display="flex" flexDir="column">
            <Flex
                justifyContent="space-between"
                align="center"
                px={8}
                py={8}
                position="relative"
            >
                <Button
                    px={6}
                    py={2}
                    bg="blue.500"
                    color="white"
                    borderRadius="lg"
                    _hover={{ bg: "blue.600" }}
                    transition="colors"
                >
                    Select Model
                </Button>

                <Text
                    fontSize="2xl"
                    position="absolute"
                    left="50%"
                    transform="translateX(-50%)"
                    fontWeight="bold"
                    color="black"
                >
                    Upload Image
                </Text>

                <Button
                    px={6}
                    py={2}
                    bg="blue.500"
                    color="white"
                    borderRadius="lg"
                    _hover={{ bg: "blue.600" }}
                    transition="colors"
                >
                    Move To Dataset
                </Button>
            </Flex>

            <Flex flex={1} w="full" px={8} pb={8} gap={6}>
                <Box flex={1}>
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
                <Box
                    w="64"
                    border="1px"
                    borderStyle="solid"
                    borderColor="gray.300"
                    borderRadius="lg"
                    color="gray.600"
                >
                    <BatchList />
                </Box>
            </Flex>
        </Box>
    );
};

export default ImageUploadLayout;
