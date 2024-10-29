import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";

interface ImageFile {
    src: string;
    name: string;
}

export const useImageUpload = () => {
    const router = useRouter();
    const [images, setImages] = useState<ImageFile[]>([]);

    const handlePrevious = useCallback(() => {
        router.back();
    }, [router]);

    const handleFileUpload = useCallback((files: File[]) => {
        const newImages = files.map((file) => ({
            src: URL.createObjectURL(file),
            name: file.name,
        }));

        setImages((prev) => [...prev, ...newImages]);
    }, []);

    const handleMoveToLoadImages = useCallback(() => {
        router.push("/loadimage");
    }, [router]);

    const handleDeleteImage = useCallback((index: number) => {
        setImages((prev) => {
            const newImages = [...prev];
            newImages.splice(index, 1);
            return newImages;
        });
    }, []);

    const handleDeleteAllImages = useCallback(() => {
        setImages([]);
    }, []);

    return {
        images,
        handlePrevious,
        handleFileUpload,
        handleMoveToLoadImages,
        handleDeleteImage,
        handleDeleteAllImages,
    };
};
