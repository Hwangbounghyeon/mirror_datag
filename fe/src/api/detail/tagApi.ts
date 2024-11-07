import apiClient from "../client";
import { AddTagRequest, DeleteTagRequest, TagResponse } from "@/types/tag";

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

    add: async (request: AddTagRequest): Promise<string[]> => {
        const response = await apiClient<TagResponse>("/imageDetail/addTag", {
            method: "POST",
            body: JSON.stringify(request),
            cache: "no-store",
        });

        if (!response.data) {
            throw new Error("No data received");
        }

        return response.data.tag_name_list;
    },

    delete: async (request: DeleteTagRequest): Promise<string[]> => {
        const response = await apiClient<TagResponse>(
            "/imageDetail/deleteTag",
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
};
