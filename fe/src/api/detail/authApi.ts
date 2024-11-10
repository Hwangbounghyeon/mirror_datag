import apiClient from "../client";
import { AuthResponse, AuthUser } from "@/types/auth";

export interface AddAuthorityRequest {
    image_id: string;
    user_id_list: number[];
}

export interface DeleteAuthorityRequest {
    image_id: string;
    user_id_list: number[];
}

export const authorityApi = {
    add: async (request: AddAuthorityRequest): Promise<AuthUser[]> => {
        const response = await apiClient<AuthResponse>("/image/permission/add", {
            method: "POST",
            body: JSON.stringify(request),
            cache: "no-store",
        });

        if (!response.data) {
            throw new Error("No data received");
        }

        console.log(response.data.auth_list);

        return response.data.auth_list;
    },

    delete: async (request: DeleteAuthorityRequest): Promise<AuthUser[]> => {
        const response = await apiClient<AuthResponse>(
            "/image/permission/remove",
            {
                method: "POST",
                body: JSON.stringify(request),
                cache: "no-store",
            }
        );

        if (!response.data) {
            throw new Error("No data received");
        }
        console.log(response.data.auth_list);

        return response.data.auth_list;
    },
};
