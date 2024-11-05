import {
    AddAuthorityRequest,
    DeleteAuthorityRequest,
    authorityApi,
} from "@/api/detail/authApi";
import { Authority } from "@/types/auth";
import { useState } from "react";

export function useAuthorityManager(
    imageId: number,
    initialAuthorities: Authority[]
) {
    const [authorities, setAuthorities] =
        useState<Authority[]>(initialAuthorities);

    const addAuthorities = async (userIds: number[]) => {
        try {
            const request: AddAuthorityRequest = {
                image_id: imageId,
                user_id: userIds,
            };
            const newAuthority = await authorityApi.add(request);
            setAuthorities((prev) => [...prev, newAuthority]);
        } catch (error) {
            console.error("Failed to add authorities:", error);
        }
    };

    const removeAuthority = async (userId: number) => {
        try {
            const request: DeleteAuthorityRequest = {
                image_id: imageId,
                userId: userId,
            };
            await authorityApi.delete(request);
            setAuthorities((prev) => prev.filter((auth) => auth.id !== userId));
        } catch (error) {
            console.error("Failed to remove authority:", error);
        }
    };

    return { authorities, addAuthorities, removeAuthority };
}
