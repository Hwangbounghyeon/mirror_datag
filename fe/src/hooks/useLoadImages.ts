import { useRouter } from "next/navigation";

export const useLoadImages = () => {
    const router = useRouter();

    const handlePrevious = () => {
        router.push("/upload");
    };

    const handleLoadImage = () => {
        // 이미지 로드 로직
    };

    const handleFilterClick = () => {
        // 필터링 로직
    };

    return {
        handlePrevious,
        handleLoadImage,
        handleFilterClick,
    };
};
