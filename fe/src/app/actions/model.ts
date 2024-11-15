"use server";

import { ModelListResponseType } from "@/types/modelType";
import { customFetch } from "./customFetch";

export const getModels = async () => {
  try {
    const response = await customFetch<ModelListResponseType>({
      endpoint: "/project/model/list",
      method: "GET",
      cache: "no-store",
    });

    if (response.data) {
      return response.data;
    } else {
      console.error(response.error);
      return {};
    }
  } catch (error) {
    console.error(error);
    return {};
  }
};
