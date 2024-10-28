import { Box, Image, Text, VStack, Flex, AspectRatio } from "@chakra-ui/react";

interface CommonCardProps {
    image: string;
    title: string;
    description: string;
    types?: string;
    onClick: () => void;
}

export default function CommonCard({
    image,
    title,
    description,
    types,
    onClick,
}: CommonCardProps) {
    return (
        <Box
            onClick={onClick}
            height="100%"
            width="100%"
            display="flex"
            flexDirection="column"
            cursor="pointer"
            borderRadius="12px"
            overflow="hidden"
            transition="box-shadow 0.3s"
            _hover={{ boxShadow: "2xl" }}
            borderWidth="1px"
            borderStyle="solid"
            borderColor="gray.600"
        >
            <Box p={3}>
                <AspectRatio ratio={16 / 9}>
                    <Image
                        src={image}
                        alt={title}
                        width="100%"
                        objectFit="cover"
                        borderRadius="12px"
                    />
                </AspectRatio>
            </Box>

            <Box flex={1} display="flex" flexDirection="column" p={6}>
                {types ? (
                    <>
                        <Box>
                            <Text
                                textAlign="center"
                                fontWeight="bold"
                                fontSize="24px"
                                color="black"
                            >
                                {title}
                            </Text>
                            <Text
                                textAlign="right"
                                color="gray.600"
                                fontSize="12px"
                            >
                                {types}
                            </Text>
                        </Box>
                        <Flex flex={1} align="center">
                            <Text
                                width="100%"
                                textAlign="center"
                                color="gray.600"
                            >
                                {description}
                            </Text>
                        </Flex>
                    </>
                ) : (
                    <VStack flex={1} justify="space-around" pb={6} padding={4}>
                        <Text
                            textAlign="center"
                            fontWeight="bold"
                            fontSize="24px"
                            color="black"
                        >
                            {title}
                        </Text>
                        <Text textAlign="center" color="gray.600">
                            {description}
                        </Text>
                    </VStack>
                )}
            </Box>
        </Box>
    );
}
