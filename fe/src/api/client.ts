import { customFetch } from "@/app/actions/customFetch";

interface ApiOptions {
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    headers?: HeadersInit;
    body?: BodyInit;
    cache?: "no-store" | null;
    ContentType?: "application/json" | "multipart/form-data";
    searchParams?: URLSearchParams | null;
}

async function apiClient<T>(endpoint: string, options: ApiOptions): Promise<T> {
    try {
        const response = await customFetch<T>({
            endpoint,
            method: options.method,
            cache: options.cache,
            body: options.body,
            ContentType:
                options.body instanceof FormData
                    ? undefined
                    : options.ContentType || "application/json",
            searchParams: options.searchParams,
        });

        if (response.error || !response.data) {
            const errorMessage = response.error
                ? typeof response.error === "string"
                    ? response.error
                    : JSON.stringify(response.error)
                : "No data returned from API";
            throw new Error(errorMessage);
        }

        return response.data;
    } catch (error) {
        console.error(`API Error (${endpoint}):`, {
            message: error instanceof Error ? error.message : "Unknown error",
            error,
        });

        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error(
                typeof error === "object"
                    ? JSON.stringify(error)
                    : String(error)
            );
        }
    }
}

export default apiClient;
