"use client";

import { Suspense } from "react";
import { PageContainer } from "@/components/common/pageContainer";
import { PageHeader } from "@/components/common/pageHeader";
import { useRouter } from "next/navigation";

export default function LoadImagesPage() {}
// {
//     searchParams,
// }: {
//     searchParams: { page?: string };
// }) {
//     const router = useRouter();
//     const currentPage = searchParams.page ? Number(searchParams.page) : 1;

//     const handlePrevious = () => {
//         router.push("/upload");
//     };

//     return (
//         <PageContainer>
//             <PageHeader
//                 title="Load Image"
//                 rightButtonText="Load Images"
//                 onPrevious={handlePrevious}
//             />

//             <Suspense fallback={<div>Loading...</div>}>
//                 <LoadImageContainer currentPage={currentPage} />
//             </Suspense>
//         </PageContainer>
//     );
// }
