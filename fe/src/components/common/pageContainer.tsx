import { Box } from "@chakra-ui/react";

export const PageContainer = ({ children }: { children: React.ReactNode }) => (
    <Box h="100vh" bg="white" display="flex" flexDir="column" mx="auto">
        {children}
    </Box>
);
