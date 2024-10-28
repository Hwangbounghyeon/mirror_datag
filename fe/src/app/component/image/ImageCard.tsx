import { Box, Text, Image } from "@chakra-ui/react";

interface ImageCardProps {
    src: string;
    name: string;
    index: number;
}

const ImageCard = ({ src, name }: ImageCardProps) => {
    return (
        <Box position="relative">
            <Box aspectRatio="1/1" borderRadius="lg" overflow="hidden">
                <Image
                    src={src}
                    alt={name}
                    width="100%"
                    height="100%"
                    objectFit="cover"
                />
            </Box>
            <Text fontSize="sm" mt={1} color="gray.600">
                {name}
            </Text>
        </Box>
    );
};

export default ImageCard;
