import { useRouter } from "next/navigation";
import { useState } from "react";

export const useImageUpload = () => {
    const router = useRouter();
    const [hasImages, setHasImages] = useState(false);

    const handlePrevious = () => {};

    const handleMoveToLoadImages = () => {
        router.push("/loadimage");
    };

    const handleSelectFiles = () => {};

    const handleSelectFolder = () => {};

    return {
        hasImages,
        handlePrevious,
        handleMoveToLoadImages,
        handleSelectFiles,
        handleSelectFolder,
    };
};
