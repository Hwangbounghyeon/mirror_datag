import { LoadImageByFilterResponse } from "@/types/imageLoad";
import apiClient from "../client";
import { TagBySearchRequest } from "@/types/tag";

export const searchProjectImages = async (
    projectId: string,
    filterConditions: TagBySearchRequest,
    page: number = 1,
    limit: number = 40
): Promise<number> => {
    const searchParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });

    const response = await apiClient<LoadImageByFilterResponse>(
        `/project/image/${projectId}/list?${searchParams.toString()}`,
        {
            method: "POST",
            body: JSON.stringify(filterConditions),
            cache: "no-store",
        }
    );

    if (response.status !== 0) {
        throw new Error("Failed to process request");
    }

    return response.status;
};
