import { ImageListResponse, SearchRequest } from "@/types/ImagesType";
import { DefaultPaginationType } from "@/types/default";
import apiClient from "../client";

export const getProjectImages = async (
  projectId: string,
  searchParams?: SearchRequest
): Promise<DefaultPaginationType<ImageListResponse>> => {
  if (searchParams) {
    const response = await apiClient<DefaultPaginationType<ImageListResponse>>(
      `/project/image/${projectId}/list`,
      {
        method: "POST",
        body: JSON.stringify({
          page: searchParams?.page,
          limit: searchParams?.limit,
          ...(searchParams.conditions && { conditions: searchParams.conditions })
        }),
        cache: "no-store",
      }
    );
  
    if (!response.data) {
      throw new Error("No data received");
    }

    return response;
  } else {
    const response = await apiClient<DefaultPaginationType<ImageListResponse>>(
      `/project/image/${projectId}/list`,
      {
        method: "POST",
        cache: "no-store",
      }
    );
  
    if (!response.data) {
      throw new Error("No data received");
    }

    return response;
  }
};
