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
                    user_id: 5,
                    task: "cls",
                    model_name: "vgg19_bn",
                    is_private: true,
                    projectId: 17,
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
