import { Suspense } from "react";
import { ImageDetailContent } from "./ImageDetailContent";

export default async function ImageDetailPage({
    params,
}: {
    params: { imageId: string };
}) {
    return (
        <Suspense fallback={<div>Loading image details...</div>}>
            <ImageDetailContent params={params} />
        </Suspense>
    );
}
