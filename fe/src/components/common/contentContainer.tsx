import { Flex } from "@chakra-ui/react";

export const ContentContainer = ({
    children,
}: {
    children: React.ReactNode;
}) => (
    <Flex flex={1} w="full" px={8} pb={8} gap={6}>
        {children}
    </Flex>
);
