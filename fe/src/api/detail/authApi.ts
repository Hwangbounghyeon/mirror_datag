import apiClient from "../client";
import { Authority } from "@/types/auth";

export interface AddAuthorityRequest {
    image_id: number;
    user_id: number[];
}

export interface DeleteAuthorityRequest {
    image_id: number;
    userId: number;
}

export const authorityApi = {
    add: async (request: AddAuthorityRequest): Promise<Authority> => {
        return apiClient<Authority>("/loadImage", {
            method: "PATCH",
            body: JSON.stringify(request),
            cache: "no-store",
        });
    },

    delete: async (request: DeleteAuthorityRequest): Promise<void> => {
        return apiClient<void>("/loadImage", {
            method: "DELETE",
            body: JSON.stringify(request),
            cache: "no-store",
        });
    },
};
