"use client";

import { searchProjectImages } from "@/api/load/uploadData";
import { uploadImage } from "@/api/upload/uploadImage";
import { TagBySearchRequest } from "@/types/tag";
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
        async (images: ImageFile[], currentFilter: TagBySearchRequest) => {
            try {
                const uploadProcess = uploadImage({
                    is_private: true,
                    project_id: "6732f8c4fcec9d2c66a75080",
                    images,
                });

                const searchResponse = await searchProjectImages(
                    "6732f8c4fcec9d2c66a75080",
                    currentFilter
                );

                // TODO 추후에 이동하도록

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
        []
    );

    return {
        goBack,
        goToLoadImages,
    };
};
