import apiClient from "../client";
import { Tag } from "@/types/auth";

interface TagList {
    image_id: number;
    tag_name: string[];
}

interface AddTagRequest {
    image_id: number;
    tag_name: string;
}

interface DeleteTagRequest {
    image_id: number;
    tag_id: number;
}

export const tagApi = {
    getTag: async (): Promise<TagList> => {
        return apiClient<TagList>("/search", {
            method: "GET",
            cache: "no-store",
        });
    },

    add: async (request: AddTagRequest): Promise<Tag> => {
        return apiClient<Tag>("/loadImage", {
            method: "PATCH",
            body: JSON.stringify(request),
            cache: "no-store",
        });
    },

    delete: async (request: DeleteTagRequest): Promise<void> => {
        return apiClient("/loadImage", {
            method: "DELETE",
            body: JSON.stringify(request),
            cache: "no-store",
        });
    },
};
