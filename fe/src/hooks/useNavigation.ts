"use client";

import { uploadImage } from "@/api/upload/uploadImage";
import { ImageFile } from "@/types/upload";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { Bounce, toast } from "react-toastify";

export const useNavigation = () => {
    const router = useRouter();

    const goBack = useCallback(() => {
        router.back();
    }, [router]);

    const goToLoadImages = useCallback(
        async (images: ImageFile[]) => {
            try {
                const uploadProcess = uploadImage({
                    is_private: true,
                    project_id: "672d6cb4da504f5b140ecffc",
                    images,
                });
                router.push("/loadimage");

                await uploadProcess;
                toast.success("Image Upload Success!", {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    draggable: true,
                    progress: undefined,
                    transition: Bounce,
                });
            } catch (error) {
                console.error("Upload failed:", error);
                toast.error("Image Upload Failed!", {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    draggable: true,
                    progress: undefined,
                    transition: Bounce,
                });
            }
        },
        [router]
    );

    return {
        goBack,
        goToLoadImages,
    };
};
