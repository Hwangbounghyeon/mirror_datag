"use client";

import { tagApi } from "@/api/detail/tagApi";
import { Tag } from "@/types/auth";
import { useState } from "react";

export function useTagManager(image_id: number) {
    const [tags, setTags] = useState<Tag[]>([]);

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

    const removeTag = async (tag_id: number) => {
        try {
            const request = {
                image_id: image_id,
                tag_id: tag_id,
            };
            await tagApi.delete(request);
            setTags((prevTags) => prevTags.filter((tag) => tag.id !== tag_id));
        } catch (error) {
            console.error("Failed to remove tag:", error);
        }
    };

    return { tags, addTag, removeTag };
}
