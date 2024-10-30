"use client";

import { Box, Flex } from "@chakra-ui/react";
import { Provider } from "@/components/ui/provider";
import { PageContainer } from "@/components/common/pageContainer";
import { PageHeader } from "@/components/common/pageHeader";
import { ContentContainer } from "@/components/common/contentContainer";
import { useLoadImages } from "./useLoadImages";
import FilterComponent from "./filterBox";
import BatchList from "../component/image/BatchList";
import ImageGrid from "../component/image/ImageGrid";
import { useEffect, useRef, useState } from "react";

export default function LoadImagesPage() {
    const { handlePrevious, handleLoadImage, handleFilterClick } =
        useLoadImages();
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterBoxRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                filterBoxRef.current &&
                !filterBoxRef.current.contains(event.target as Node)
            ) {
                setIsFilterOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleDone = () => {
        setIsFilterOpen(false);
    };

    return (
        <Provider>
            <PageContainer>
                <PageHeader
                    title="Load Images"
                    rightButtonText="Load Image"
                    onPrevious={handlePrevious}
                    onRightButtonClick={handleLoadImage}
                />

                <ContentContainer>
                    <Box flex={8}>
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

                    <Flex flex={2} direction="column" gap={4}>
                        <Box
                            ref={filterBoxRef}
                            position="relative"
                            flex={1}
                            border="1px"
                            borderStyle="solid"
                            borderColor="gray.300"
                            borderRadius="lg"
                            p={4}
                            cursor="pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsFilterOpen(!isFilterOpen);
                            }}
                        >
                            <Flex justify="space-between" align="center">
                                필터링
                                <Box
                                    transform={
                                        isFilterOpen
                                            ? "rotate(180deg)"
                                            : "rotate(0deg)"
                                    }
                                    transition="transform 0.2s"
                                >
                                    ▼
                                </Box>
                            </Flex>
                            {isFilterOpen && (
                                <Box
                                    position="absolute"
                                    top="calc(100% - 1px)"
                                    my={2}
                                    right="-1px"
                                    width="45vw"
                                    bg="white"
                                    border="1px"
                                    borderColor="gray.200"
                                    borderBottomRadius="lg"
                                    boxShadow="lg"
                                    zIndex={50}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <FilterComponent onDone={handleDone} />
                                </Box>
                            )}
                        </Box>
                        <Box
                            border="1px"
                            borderStyle="solid"
                            borderColor="gray.300"
                            borderRadius="lg"
                            p={4}
                        >
                            <BatchList />
                        </Box>
                    </Flex>
                </ContentContainer>
            </PageContainer>
        </Provider>
    );
}
