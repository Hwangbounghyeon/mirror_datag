"use server";

import { customFetch } from "./customFetch";
import {
  DefaultPaginationType,
  DefaultResponseType,
  PaginationType,
} from "@/types/default";

export type SearchUserType = {
  user_id: number;
  name: string;
  email: string;
};

export const getUsers = async (pageNumber: number) => {
  try {
    const response: DefaultResponseType<
      DefaultPaginationType<SearchUserType[]>
    > = await customFetch({
      method: "GET",
      endpoint: "/user/search",
      searchParams: new URLSearchParams({
        page: pageNumber.toString(),
      }),
    });
    if (response.data) {
      console.log("response.data", response.data);
      return {
        status: response.status,
        data: response.data,
      };
    } else {
      return {
        error: response.error || "사용자를 불러오는 중 오류가 발생했습니다.",
        status: response.status,
      };
    }
  } catch (error) {
    console.error("error 요기", error);
    return {
      error: (error as string) || "사용자를 불러오는 중 오류가 발생했습니다.",
      status: 500,
    };
  }
};
