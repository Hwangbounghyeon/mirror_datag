// "use client";

// import { FilterSection } from "./FilterSection";
// import { Pagination } from "@nextui-org/react";
// import { useLoadImages } from "@/hooks/useLoadImages";
// import { useRouter } from "next/navigation";
// import { ContentContainer } from "@/components/common/contentContainer";
// import { LoadImageGrid } from "@/components/loadimage/loadImageGrid";
// import { Suspense, useState, useTransition } from "react";

// interface LoadImageContainerProps {
//     currentPage: number;
// }

// export function LoadImageContainer({ currentPage }: LoadImageContainerProps) {
//     const router = useRouter();
//     const [isPending, startTransition] = useTransition();
//     const [isNavigating, setIsNavigating] = useState(false);
//     const {
//         images,
//         tags,
//         isLoading,
//         totalPages,
//         currentFilter,
//         searchByFilter,
//     } = useLoadImages(currentPage);

//     const imageArray = images
//         ? Object.entries(images || {}).map(([id, url]) => ({
//               id,
//               url,
//           }))
//         : [];

//     const handlePageChange = (page: number) => {
//         setIsNavigating(true);
//         const filterToUse = currentFilter || {
//             conditions: [
//                 {
//                     and_condition: [],
//                     or_condition: [],
//                     not_condition: [],
//                 },
//             ],
//         };

//         startTransition(() => {
//             router.push(`/loadimage?page=${page}`);
//             searchByFilter(filterToUse, page).finally(() => {
//                 setIsNavigating(false);
//             });
//         });
//     };

//     const isLoadingState = isLoading || isPending || isNavigating;

//     return (
//         <div className="flex flex-col min-h-screen">
//             <div className="flex flex-1">
//                 <ContentContainer>
//                     <div className="flex-[8] min-h-[80vh]">
//                         <div className="h-full border border-solid border-gray-300 rounded-lg p-6">
//                             <Suspense
//                                 fallback={
//                                     <div className="flex items-center justify-center h-full">
//                                         <div>Loading images...</div>
//                                     </div>
//                                 }
//                             >
//                                 {isLoadingState ? (
//                                     <div className="flex items-center justify-center h-full">
//                                         <div>Loading images...</div>
//                                     </div>
//                                 ) : (
//                                     <LoadImageGrid images={imageArray} />
//                                 )}
//                             </Suspense>
//                         </div>
//                     </div>

//                     <FilterSection
//                         tags={tags}
//                         onFilterApply={(filterData) => {
//                             setIsNavigating(true);
//                             startTransition(() => {
//                                 searchByFilter(filterData, 1).finally(() => {
//                                     setIsNavigating(false);
//                                 });
//                             });
//                         }}
//                     />
//                 </ContentContainer>
//             </div>

//             <div className="flex justify-center py-4 border-t">
//                 <Pagination
//                     total={totalPages}
//                     page={currentPage}
//                     onChange={handlePageChange}
//                     showControls
//                     boundaries={1}
//                     siblings={1}
//                     size="lg"
//                     isDisabled={isLoadingState}
//                 />
//             </div>
//         </div>
//     );
// }
