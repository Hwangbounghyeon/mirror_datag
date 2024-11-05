import { ImageDetail } from "@/types/metadata";
import apiClient from "../client";

export const loadImageDetail = async (
    imageId: number
): Promise<ImageDetail> => {
    return apiClient<ImageDetail>(`/imagedetail?imageId=${imageId}`, {
        method: "GET",
        cache: "no-store",
    });
};
