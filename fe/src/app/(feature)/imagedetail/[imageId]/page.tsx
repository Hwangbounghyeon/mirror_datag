import { Suspense } from "react";
import { ImageDetailContent } from "./ImageDetailContent";

export default async function ImageDetailPage({
    params,
    searchParams,
}: {
    params: { imageId: string };
    searchParams: { imageList: string };
}) {
    return (
        <Suspense fallback={<div>Loading image details...</div>}>
            <ImageDetailContent params={params} searchParams={searchParams} />
        </Suspense>
    );
}
