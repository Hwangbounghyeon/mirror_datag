import { ImageDetailResponse } from "@/types/metadata";
import apiClient from "../client";

export const loadImageDetail = async (
    imageId: string
): Promise<ImageDetailResponse> => {
    const response = await apiClient<ImageDetailResponse>(
        `/imageDetail/detail?image_id=${imageId}`,
        {
            method: "GET",
            cache: "no-store",
        }
    );

    if (!response.data) {
        throw new Error("No data received");
    }

    return response;
};
