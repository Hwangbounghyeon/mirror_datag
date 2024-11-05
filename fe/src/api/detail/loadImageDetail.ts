import { ImageDetailResponse } from "@/types/metadata";
import apiClient from "../client";

export const loadImageDetail = async (
    imageId: number
): Promise<ImageDetailResponse> => {
    return apiClient<ImageDetailResponse>(`/imagedetail?imageId=${imageId}`, {
        method: "GET",
        cache: "no-store",
    });
};
