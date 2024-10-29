"use client";

import { Box, Button, Text, Flex } from "@chakra-ui/react";
import { Provider } from "@/components/ui/provider";
import { PageContainer } from "@/components/common/pageContainer";
import { PageHeader } from "@/components/common/pageHeader";
import { ContentContainer } from "@/components/common/contentContainer";
import { useLoadImages } from "./useLoadImages";
import { FILTER_OPTIONS } from "../lib/constants/filter";
import BatchList from "../component/image/BatchList";
import ImageGrid from "../component/image/ImageGrid";

export default function LoadImagesPage() {
    const { handlePrevious, handleLoadImage, handleFilterClick } =
        useLoadImages();

    return (
        <Provider>
            <PageContainer>
                <PageHeader
                    title="Load Images"
                    rightButtonText="Load Image"
                    onPrevious={handlePrevious}
                    onRightButtonClick={handleLoadImage}
                />

                <Flex justify="space-between" px={8} gap={4} mb={6}>
                    {FILTER_OPTIONS.map((filter) => (
                        <Button
                            key={filter}
                            px={6}
                            py={2}
                            bg="gray.100"
                            color="gray.700"
                            borderRadius="lg"
                            _hover={{ bg: "gray.200" }}
                        >
                            {filter}
                        </Button>
                    ))}
                </Flex>

                <ContentContainer>
                    <Box flex={1}>
                        <Box
                            h="full"
                            border="1px"
                            borderStyle="solid"
                            borderColor="gray.300"
                            borderRadius="lg"
                            p={6}
                        >
                            <ImageGrid />
                        </Box>
                    </Box>

                    <Box
                        w="64"
                        border="1px"
                        borderStyle="solid"
                        borderColor="gray.300"
                        borderRadius="lg"
                        p={4}
                    >
                        <BatchList />
                    </Box>
                </ContentContainer>
            </PageContainer>
        </Provider>
    );
}
