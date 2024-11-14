"use client";

import { searchProjectImages } from "@/api/load/uploadData";
import { uploadImage } from "@/api/upload/uploadImage";
import { TagBySearchRequest } from "@/types/tag";
import { ImageFile } from "@/types/upload";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { Bounce, toast } from "react-toastify";

export const useNavigation = (projectId: string) => {
    const router = useRouter();

    const goBack = useCallback(() => {
        router.back();
    }, [router]);

    const goToLoadImages = useCallback(
        async (images: ImageFile[], currentFilter: TagBySearchRequest) => {
            try {
                const uploadProcess = uploadImage({
                    is_private: true,
                    project_id: projectId,
                    images,
                });

                const searchResponse = await searchProjectImages(
                    projectId,
                    currentFilter
                );

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
        [projectId]
    );

    return {
        goBack,
        goToLoadImages,
    };
};
