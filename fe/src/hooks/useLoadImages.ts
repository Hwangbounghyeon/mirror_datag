import { useRouter } from "next/navigation";
import { FilterOption } from "../lib/constants/filter";

export const useLoadImages = () => {
    const router = useRouter();

    const handlePrevious = () => {
        router.push("/upload");
    };

    const handleLoadImage = () => {
        // 이미지 로드 로직
    };

    const handleFilterClick = (filter: FilterOption) => {
        // 필터링 로직
    };

    return {
        handlePrevious,
        handleLoadImage,
        handleFilterClick,
    };
};
