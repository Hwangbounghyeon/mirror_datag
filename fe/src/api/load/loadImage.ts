import apiClient from "../client";

interface FilterCondition {
    field: string;
    operator: string;
    values: string[];
}

interface LoadImageRequest {
    condition: string[];
    operator: string[];
}

interface ImageItem {
    imageId: number;
    imageUrl: string;
}

export const imageLoadApi = {
    getFiltered: async (request: LoadImageRequest): Promise<ImageItem[]> => {
        return apiClient<ImageItem[]>("/search/image", {
            method: "POST",
            body: JSON.stringify(request),
            cache: "no-store",
        });
    },
};
