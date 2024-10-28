"use client";

import { SimpleGrid, Box } from "@chakra-ui/react";
import { categories } from "../lib/constants/models";
import { useRouter } from "next/navigation";
import { Provider } from "@/components/ui/provider";
import PageLayout from "../layout/PageLayout";
import CommonCard from "../ModelSelector/ModelSelectCard";

export default function SelectCategoryPage() {
    const router = useRouter();

    return (
        <Provider>
            <PageLayout isFirstPage>
                <SimpleGrid
                    columns={{ base: 1, sm: 2 }}
                    padding={4}
                    height="100%"
                >
                    {categories.map((category) => (
                        <Box key={category.id} height="100%" px={4} py={2}>
                            <CommonCard
                                image={category.image}
                                title={category.title}
                                description={category.description}
                                types={category.types}
                                onClick={() => {
                                    console.log("click");
                                    router.push(`/select-model/${category.id}`);
                                }}
                            />
                        </Box>
                    ))}
                </SimpleGrid>
            </PageLayout>
        </Provider>
    );
}
