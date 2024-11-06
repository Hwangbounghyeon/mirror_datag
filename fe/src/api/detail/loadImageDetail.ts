import { ImageDetailResponse } from "@/types/metadata";
import apiClient from "../client";

export const loadImageDetail = async (
    imageId: string
): Promise<ImageDetailResponse> => {
    return apiClient<ImageDetailResponse>(
        `/imageDetail/detail?image_id=${imageId}`,
        {
            method: "GET",
            cache: "no-store",
        }
    );
};
