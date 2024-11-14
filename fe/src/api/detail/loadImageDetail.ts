import { ImageDetailResponse } from "@/types/metadata";
import apiClient from "../client";
import { TagBySearchRequest } from "@/types/tag";

export const loadImageDetail = async (
    filterConditions: TagBySearchRequest,
    imageId: string,
    project_id: string
): Promise<ImageDetailResponse> => {
    const response = await apiClient<ImageDetailResponse>(
        `/image/detail/${project_id}/${imageId}`,
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
};
