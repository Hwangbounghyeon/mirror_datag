import { FC } from "react";
import { Box, Text, Image } from "@chakra-ui/react";
import { IoCloseCircle } from "react-icons/io5";
import { ImageCardProps } from "@/app/types/upload";

export const ImageCard: FC<ImageCardProps> = ({ src, name, onDelete }) => (
    <Box position="relative">
        <DeleteButton onDelete={onDelete} />
        <ImageContainer src={src} name={name} />
        <ImageName name={name} />
    </Box>
);

const DeleteButton: FC<{ onDelete: () => void }> = ({ onDelete }) => (
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
);

const ImageContainer: FC<{ src: string; name: string }> = ({ src, name }) => (
    <Box aspectRatio="1/1" borderRadius="lg" overflow="hidden">
        <Image src={src} alt={name} w="100%" h="100%" objectFit="cover" />
    </Box>
);

const ImageName: FC<{ name: string }> = ({ name }) => (
    <Text fontSize="sm" mt={1} color="gray.600" textAlign="center">
        {name}
    </Text>
);
