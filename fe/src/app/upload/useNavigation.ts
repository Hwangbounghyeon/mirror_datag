"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

export const useNavigation = () => {
    const router = useRouter();

    const goBack = useCallback(() => {
        router.back();
    }, [router]);

    const goToLoadImages = useCallback(() => {
        router.push("/loadimage");
    }, [router]);

    return {
        goBack,
        goToLoadImages,
    };
};
