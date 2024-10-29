import { Box, Text, Image } from "@chakra-ui/react";
import { IoCloseCircle } from "react-icons/io5";

interface ImageCardProps {
    src: string;
    name: string;
    index: number;
    onDelete: () => void;
}

const ImageCard = ({ src, name, onDelete }: ImageCardProps) => {
    return (
        <Box position="relative">
            <Box
                position="absolute"
                top={2}
                right={2}
                cursor="pointer"
                zIndex={2}
                onClick={onDelete}
                borderRadius="full"
                bg="white"
                _hover={{ opacity: 0.8 }}
            >
                <IoCloseCircle size={24} color="#ff0000" />
            </Box>
            <Box aspectRatio="1/1" borderRadius="lg" overflow="hidden">
                <Image
                    src={src}
                    alt={name}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                />
            </Box>
            <Text fontSize="sm" mt={1} color="gray.600" textAlign="center">
                {name}
            </Text>
        </Box>
    );
};

export default ImageCard;
