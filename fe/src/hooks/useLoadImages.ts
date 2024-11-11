"use client";

import { tagApi } from "@/api/detail/tagApi";
import { ImageArray } from "@/types/imageLoad";
import { TagBySearchRequest } from "@/types/tag";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export const useLoadImages = () => {
    const router = useRouter();
    const [images, setImages] = useState<ImageArray>({});
    const [tags, setTags] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [currentFilter, setCurrentFilter] =
        useState<TagBySearchRequest | null>(null);

    const fetchTags = async () => {
        try {
            setIsLoading(true);
            const response = await tagApi.getTag();
            if (response.data) {
                setTags(response.data.tags);
            }
        } catch (error) {
            console.error("Failed to fetch images:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const searchByFilter = useCallback(
        async (filterConditions: TagBySearchRequest, page: number = 1) => {
            try {
                setIsLoading(true);
                console.log("Filter Conditions:", filterConditions);

                const response = await tagApi.searchByTag(
                    filterConditions,
                    page
                );
                console.log("API Response:", response?.data);

                if (response?.data) {
                    const allImages = response.data.data.reduce(
                        (acc, item) => ({
                            ...acc,
                            ...item.images,
                        }),
                        {}
                    );
                    setImages(allImages);
                    setTotalPages(response.data.total_pages);
                    setCurrentFilter(filterConditions);
                }
            } catch (error) {
                console.error("Failed to filter images:", error);
                setImages({});
                setTotalPages(0);
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    useEffect(() => {
        fetchTags();
    }, []);

    useEffect(() => {
        const loadInitialData = async () => {
            if (tags.length > 0) {
                const initialFilter = {
                    conditions: [
                        {
                            and_condition: [],
                            or_condition: [],
                            not_condition: [],
                        },
                    ],
                };
                await searchByFilter(initialFilter, 1);
            }
        };
        loadInitialData();
    }, [searchByFilter, tags.length]);

    const handlePrevious = () => {
        router.push("/upload");
    };

    return {
        images,
        tags,
        isLoading,
        totalPages,
        currentFilter,
        handlePrevious,
        searchByFilter,
    };
};
