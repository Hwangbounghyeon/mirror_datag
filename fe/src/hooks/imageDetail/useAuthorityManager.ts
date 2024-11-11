import {
    AddAuthorityRequest,
    DeleteAuthorityRequest,
    authorityApi,
} from "@/api/detail/authApi";
import { AuthUser } from "@/types/auth";
import { useState } from "react";

export function useAuthorityManager(
    imageId: string,
    initialAuthorities: AuthUser[]
) {
    const [authorities, setAuthorities] =
        useState<AuthUser[]>(initialAuthorities);

    const addAuthorities = async (department_name: string[]) => {
        try {
            const request: AddAuthorityRequest = {
                image_id: imageId,
                user_id_list: department_name,
            };
            const newAuthority = await authorityApi.add(request);
            setAuthorities(newAuthority);
        } catch (error) {
            console.error("Failed to add authorities:", error);
        }
    };

    const removeAuthority = async (userId: number) => {
        try {
            const request: DeleteAuthorityRequest = {
                image_id: imageId,
                user_id_list: [userId],
            };
            const newAuthority = await authorityApi.delete(request);
            setAuthorities(newAuthority);
        } catch (error) {
            console.error("Failed to remove authority:", error);
        }
    };

    return { authorities, addAuthorities, removeAuthority };
}
