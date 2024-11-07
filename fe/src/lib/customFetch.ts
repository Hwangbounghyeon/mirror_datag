"use server";
import { refreshAccessToken } from "@/app/actions/auth";
import { cookies } from "next/headers";

// 리턴 타입 정의
export type DefaultResponseType<T> = {
  status: number;
  data?: T;
  error?: string;
};

// Fetch 옵션 정의
interface AuthFetchProps {
  BASE_URL?: string; // 기본 도메인 URL, 없을 시 process.env.NEXT_PUBLIC_BACKEND_URL 사용
  endpoint: string; // 요청할 엔드포인트
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"; // 요청 메소드
  cache?: "no-store" | "force-cache" | null; // 캐시 정책 1
  next?: NextFetchRequestConfig; // 캐시 정책 2
  body?: BodyInit; // 요청 바디
  searchParams?: URLSearchParams | null; // 쿼리스트링
  ContentType?: // Content-Type
  | "application/json"
    | "application/x-www-form-urlencoded"
    | "multipart/form-data";
}

// Fetch 함수
// T: 응답 데이터 타입 제네릭

export async function customFetch<T>({
  BASE_URL,
  endpoint,
  method,
  searchParams,
  cache,
  next,
  body,
  ContentType = "application/json",
}: AuthFetchProps): Promise<DefaultResponseType<T>> {
  try {
    // Cache 옵션 검증
    if (cache && next) {
      return {
        status: 400,
        error: "cache와 next 옵션은 동시에 사용할 수 없습니다.",
      };
    } else if (!cache && !next) {
      // 기본 캐시 정책 설정 - 아무 설정 없는 경우
      cache = "no-store";
    }

    // Access Token 가져오기
    const accessToken = cookies().get("accessToken");
    const refreshToken = cookies().get("refreshToken");

    // Headers 설정
    const headers: HeadersInit = {
      "Content-Type": ContentType,
    };

    if (accessToken) {
      headers["Authorization"] = `bearer ${accessToken.value}`;
    }

    // URL 생성
    const url = new URL(
      `${BASE_URL || process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`
    );

    if (searchParams) {
      url.search = searchParams.toString();
    }

    // Fetch 옵션 설정
    const fetchOptions: RequestInit = {};
    if (cache) {
      fetchOptions.cache = cache;
    } else if (next) {
      fetchOptions.next = next;
    }

    // Fetch 요청
    const response = await fetch(url.toString(), {
      ...fetchOptions,
      method,
      headers,
      body,
    });
    const responseData = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        // Unauthorized 에러 처리 영역
        if (!refreshToken) {
          // refresh token이 없을 때
          cookies().delete("accessToken");
          cookies().delete("refreshToken");
          return {
            status: 401,
            error: "로그인이 필요합니다.",
          };
        } else {
          try {
            // refresh 시도
            const refreshTokensResponse = await refreshAccessToken();
            if (!refreshTokensResponse) {
              return {
                status: 401,
                error: "로그인이 필요합니다.",
              };
            } else {
              const retry_response = await fetch(url.toString(), {
                ...fetchOptions,
                headers: {
                  ...headers,
                },
              });
              const retry_responseData: DefaultResponseType<T> =
                await retry_response.json();
              return {
                status: retry_response.status,
                data: retry_responseData as T,
              };
            }
          } catch (error) {
            return {
              status: 500,
              error: "알 수 없는 오류가 발생했습니다.",
            };
          }
        }
      } else {
        // 401 외의 다른 에러 처리 영역
        return {
          status: response.status,
          error: responseData.detail || "서버에서 오류가 발생했습니다.",
        };
      }
    }

    return {
      status: response.status,
      data: responseData as T,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      error:
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.",
    };
  }
}
