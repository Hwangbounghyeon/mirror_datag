import apiClient from "../client";

interface TagList {
    image_id: string;
    tag_name: string[];
}

interface AddTagRequest {
    image_id: string;
    tag_name: string;
}

interface DeleteTagRequest {
    image_id: string;
    tag_name: string;
}

export const tagApi = {
    getTag: async (): Promise<TagList> => {
        return apiClient<TagList>("/search", {
            method: "GET",
            cache: "no-store",
        });
    },

    add: async (request: AddTagRequest): Promise<string[]> => {
        return apiClient<string[]>("/loadImage", {
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
