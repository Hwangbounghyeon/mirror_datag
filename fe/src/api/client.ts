export const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface ApiOptions {
    method: string;
    headers?: HeadersInit;
    body?: BodyInit;
    cache?: RequestCache;
}

async function apiClient<T>(endpoint: string, options: ApiOptions): Promise<T> {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        throw error;
    }
}

export default apiClient;
