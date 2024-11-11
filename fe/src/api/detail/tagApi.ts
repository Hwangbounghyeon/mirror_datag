import {
    LoadImageByFilterResponse,
    TagFilterResponse,
} from "@/types/imageLoad";
import apiClient from "../client";
import {
    AddTagRequest,
    DeleteTagRequest,
    TagBySearchRequest,
    TagResponse,
} from "@/types/tag";

export const tagApi = {
    getTag: async (): Promise<TagFilterResponse> => {
        const response = await apiClient<TagFilterResponse>("/image/tag/list", {
            method: "GET",
            cache: "no-store",
        });

        if (!response.data) {
            throw new Error("No data received");
        }

        console.log(response.data);

        return response;
    },

    searchByTag: async (
        filterConditions: TagBySearchRequest,
        page: number = 1
    ): Promise<LoadImageByFilterResponse> => {
        const searchParams = new URLSearchParams({
            page: page.toString(),
        });

        const response = await apiClient<LoadImageByFilterResponse>(
            `/image/search?${searchParams.toString()}`,
            {
                method: "POST",
                body: JSON.stringify(filterConditions),
                cache: "no-store",
            }
        );

        if (!response.data) {
            throw new Error("No data received");
        }

        return response;
    },

    add: async (request: AddTagRequest): Promise<string[]> => {
        const response = await apiClient<TagResponse>("/image/tag/add", {
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
        const response = await apiClient<TagResponse>("/image/tag/remove", {
            method: "POST",
            body: JSON.stringify(request),
            cache: "no-store",
        });

        if (!response.data) {
            throw new Error("No data received");
        }

        return response.data.tag_name_list;
    },
};
