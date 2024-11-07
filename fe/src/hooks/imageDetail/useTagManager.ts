"use client";

import { tagApi } from "@/api/detail/tagApi";
import { TagRequest } from "@/types/tag";
import { useState } from "react";

export function useTagManager(imageId: string, initialTags: string[]) {
    const [tags, setTags] = useState<string[]>(initialTags);

    const addTag = async (tagName: string) => {
        try {
            const request: TagRequest = {
                image_id: imageId,
                tag_name: tagName,
            };
            const newTag = await tagApi.add(request);
            setTags(newTag);
        } catch (error) {
            console.error("Failed to add tag:", error);
        }
    };

    const removeTag = async (tagName: string) => {
        try {
            const request: TagRequest = {
                image_id: imageId,
                tag_name: tagName,
            };
            await tagApi.delete(request);
            setTags((prevTags) => prevTags.filter((tag) => tag !== tagName));
        } catch (error) {
            console.error("Failed to remove tag:", error);
        }
    };

    return { tags, addTag, removeTag };
}
