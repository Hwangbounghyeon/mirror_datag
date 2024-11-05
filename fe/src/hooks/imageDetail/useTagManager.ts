"use client";

import { tagApi } from "@/api/detail/tagApi";
import { useState } from "react";

export function useTagManager(image_id: number, initialTags: string[]) {
    const [tags, setTags] = useState<string[]>(initialTags);

    const addTag = async (tagName: string) => {
        try {
            const request = {
                image_id: image_id,
                tag_name: tagName,
            };
            const newTag = await tagApi.add(request);
            setTags((prev) => [...prev, newTag]);
        } catch (error) {
            console.error("Failed to add tag:", error);
        }
    };

    const removeTag = async (tag_name: string) => {
        try {
            const request = {
                image_id: image_id,
                tag_name: tag_name,
            };
            await tagApi.delete(request);
            setTags((prevTags) => prevTags.filter((tag) => tag !== tag_name));
        } catch (error) {
            console.error("Failed to remove tag:", error);
        }
    };

    return { tags, addTag, removeTag };
}
