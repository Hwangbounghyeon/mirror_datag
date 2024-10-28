import { Button, Flex, Text } from "@chakra-ui/react";

interface PageHeaderProps {
    title: string;
    onPrevious: () => void;
    rightButtonText: string;
    onRightButtonClick?: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    onPrevious,
    rightButtonText,
    onRightButtonClick,
}) => (
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
            onClick={onPrevious}
        >
            Previous
        </Button>

        <Text
            fontSize="4xl"
            position="absolute"
            left="50%"
            transform="translateX(-50%)"
            fontWeight="bold"
            color="black"
        >
            {title}
        </Text>

        <Button
            px={6}
            py={2}
            bg="blue.500"
            color="white"
            borderRadius="lg"
            _hover={{ bg: "blue.600" }}
            transition="colors"
            onClick={onRightButtonClick}
        >
            {rightButtonText}
        </Button>
    </Flex>
);
