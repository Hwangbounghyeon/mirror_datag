import apiClient from "../client";
import { TagRequest, AddTagResponse } from "@/types/tag";

interface TagList {
    image_id: string;
    tag_name: string[];
}

export const tagApi = {
    getTag: async (): Promise<TagList> => {
        return apiClient<TagList>("/search", {
            method: "GET",
            cache: "no-store",
        });
    },

    add: async (request: TagRequest): Promise<string[]> => {
        const response = await apiClient<AddTagResponse>(
            "/imageDetail/tagging",
            {
                method: "POST",
                body: JSON.stringify(request),
                cache: "no-store",
            }
        );

        if (!response.data) {
            throw new Error("No data received");
        }

        return response.data.tag_name_list;
    },

    delete: async (request: TagRequest): Promise<void> => {
        return apiClient("/imageDetail/deleteTag", {
            method: "DELETE",
            body: JSON.stringify(request),
            cache: "no-store",
        });
    },
};
