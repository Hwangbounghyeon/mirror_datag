"use client";
import { Provider } from "@/components/ui/provider";
import { models } from "@/app/lib/constants/models";
import { CategoryId } from "@/app/types/modeltype";
import { SimpleGrid, Box } from "@chakra-ui/react";
import { useParams, useRouter } from "next/navigation";
import PageLayout from "@/app/layout/PageLayout";
import CommonCard from "@/app/ModelSelector/ModelSelectCard";

export default function SelectModelPage() {
    const params = useParams();
    const category = params.category as CategoryId;
    const router = useRouter();

    return (
        <Provider>
            <PageLayout>
                <SimpleGrid
                    columns={{ base: 1, sm: 2, md: 3 }}
                    padding={4}
                    gap={12}
                    height="100%"
                    width="100%"
                >
                    {models[category]?.map((model) => (
                        <Box key={model.id} height="100%">
                            <CommonCard
                                image={model.image}
                                title={model.name}
                                description={model.description}
                                onClick={() => router.push(`/upload`)}
                            />
                        </Box>
                    ))}
                </SimpleGrid>
            </PageLayout>
        </Provider>
    );
}
