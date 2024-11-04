import apiClient from "../client";
import { Authority, Tag } from "@/types/auth";

interface LoadImageDetailProps {
    imageId: number;
}

interface ImageDetailResponse {
    imageId: number;
    metaData: string;
    authInfo: Authority[];
    tag: Tag[];
    imageUrl: string;
}

export const loadImageDetail = async ({
    imageId,
}: LoadImageDetailProps): Promise<ImageDetailResponse> => {
    return apiClient<ImageDetailResponse>(`/imagedetail?imageId=${imageId}`, {
        method: "GET",
        cache: "no-store",
    });
};
