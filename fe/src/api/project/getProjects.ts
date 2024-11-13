import { ProjectType, ProjectRequest } from "@/types/projectType";
import { DefaultPaginationType } from "@/types/default";
import apiClient from "../client";

export const getProjects = async (
  searchParams?: ProjectRequest
): Promise<DefaultPaginationType<ProjectType[]>> => {
  if (searchParams) {
    const requestParams = new URLSearchParams(searchParams);

    const response = await apiClient<DefaultPaginationType<ProjectType[]>>(
      `/project/list`,
      {
        method: "GET",
        cache: "no-store",
        searchParams: requestParams
      }
    );
  
    if (!response.data) {
      throw new Error("No data received");
    }

    return response;
  }

  const response = await apiClient<DefaultPaginationType<ProjectType[]>>(
    `/project/list`,
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
