// "use client";

// import { tagApi } from "@/api/detail/tagApi";
// import { ImageArray } from "@/types/imageLoad";
// import { TagBySearchRequest } from "@/types/tag";
// import { useRouter } from "next/navigation";
// import { useCallback, useEffect, useState } from "react";

// export const useLoadImages = (initialPage: number = 1) => {
//     const router = useRouter();
//     const [images, setImages] = useState<ImageArray>({});
//     const [tags, setTags] = useState<string[]>([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const [totalPages, setTotalPages] = useState(0);
//     const searchParams = new URLSearchParams(
//         typeof window !== "undefined" ? window.location.search : ""
//     );
//     const filterParam = searchParams.get("filter");
//     const [currentFilter, setCurrentFilter] = useState<TagBySearchRequest>(
//         () => {
//             if (filterParam) {
//                 try {
//                     return JSON.parse(decodeURIComponent(filterParam));
//                 } catch {
//                     return {
//                         conditions: [
//                             {
//                                 and_condition: [],
//                                 or_condition: [],
//                                 not_condition: [],
//                             },
//                         ],
//                     };
//                 }
//             }
//             return {
//                 conditions: [
//                     {
//                         and_condition: [],
//                         or_condition: [],
//                         not_condition: [],
//                     },
//                 ],
//             };
//         }
//     );

//     const fetchTags = async () => {
//         try {
//             setIsLoading(true);
//             const response = await tagApi.getTag();
//             if (response.data) {
//                 setTags(response.data.tags);
//             }
//         } catch (error) {
//             console.error("Failed to fetch images:", error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const searchByFilter = useCallback(
//         async (filterConditions: TagBySearchRequest, page: number) => {
//             try {
//                 setIsLoading(true);

//                 const newSearchParams = new URLSearchParams(
//                     window.location.search
//                 );
//                 newSearchParams.set("page", page.toString());
//                 newSearchParams.set(
//                     "filter",
//                     encodeURIComponent(JSON.stringify(filterConditions))
//                 );
//                 router.push(`/loadimage?${newSearchParams.toString()}`);

//                 const response = await tagApi.searchByTag(
//                     filterConditions,
//                     page
//                 );

//                 if (response?.data) {
//                     const allImages = response.data.data.reduce(
//                         (acc, item) => ({
//                             ...acc,
//                             ...item.images,
//                         }),
//                         {}
//                     );
//                     setImages(allImages);
//                     setTotalPages(response.data.total_pages);
//                     setCurrentFilter(filterConditions);
//                 }
//             } catch (error) {
//                 console.error("Failed to filter images:", error);
//                 setImages({});
//                 setTotalPages(0);
//             } finally {
//                 setIsLoading(false);
//             }
//         },
//         [router]
//     );

//     useEffect(() => {
//         fetchTags();
//     }, []);

//     useEffect(() => {
//         searchByFilter(currentFilter, initialPage);
//     }, []);

//     return {
//         images,
//         tags,
//         isLoading,
//         totalPages,
//         currentFilter,
//         searchByFilter,
//     };
// };
