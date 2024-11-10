import { ImageDetailResponse } from "@/types/metadata";
import apiClient from "../client";

export const loadImageDetail = async (
    imageId: string
): Promise<ImageDetailResponse> => {
    const response = await apiClient<ImageDetailResponse>(
        `/image/detail/${imageId}`,
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
