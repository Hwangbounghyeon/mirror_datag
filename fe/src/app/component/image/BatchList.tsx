"use client";

import { Box, VStack, Text } from "@chakra-ui/react";

const BatchList = () => {
    const batches = [
        {
            id: 4,
            name: "Batch 04",
            date: "2024-10-26",
            imageCount: 12,
            active: true,
        },
        {
            id: 3,
            name: "Batch 03",
            date: "2024-10-25",
            imageCount: 8,
            active: false,
        },
        {
            id: 2,
            name: "Batch 02",
            date: "2024-10-24",
            imageCount: 15,
            active: false,
        },
        {
            id: 1,
            name: "Batch 01",
            date: "2024-10-23",
            imageCount: 10,
            active: false,
        },
    ];

    return (
        <Box w="full" h="full" overflowY="auto">
            <VStack padding={2} align="stretch">
                {batches.map((batch) => (
                    <Box
                        key={batch.id}
                        p={4}
                        my={1}
                        cursor="pointer"
                        transition="all 0.2s"
                        borderWidth={batch.active ? "2px" : "1px"}
                        borderColor={batch.active ? "blue.500" : "gray.100"}
                        boxShadow="sm"
                        borderRadius="md"
                    >
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Text fontSize="xl" fontWeight="semibold">
                                {batch.name}
                            </Text>
                        </Box>
                        <Text fontSize="sm" color="gray.600">
                            {batch.date}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                            Images: {batch.imageCount}
                        </Text>
                    </Box>
                ))}
            </VStack>
        </Box>
    );
};

export default BatchList;
