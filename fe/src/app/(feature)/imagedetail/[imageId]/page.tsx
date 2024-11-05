import { loadImageDetail } from "@/api/detail/loadImageDetail";
import { Suspense } from "react";
import ImageDetailClient from "./imageDetailClient";

export default async function ImageDetailPage({
    params,
}: {
    params: { imageId: string };
}) {
    const imageId = Number(params.imageId);
    const data = await loadImageDetail(imageId);

    const initialAuthorities = data.data.access_control.user.map((user) => ({
        id: user.uid,
        name: user.name,
        department: user.department_name,
    }));

    const initialTags =
        data.data.metadata.aiResults[0]?.predictions[0]?.tags || [];

    const classes =
        data.data.metadata.aiResults[0]?.predictions[0]?.detections.map(
            (detection) => detection.prediction
        ) || [];

    const metadata = data.data.metadata.metadata;

    const imageSrc = data.data.metadata.fileList[0];

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ImageDetailClient
                imageId={imageId}
                initialAuthorities={initialAuthorities}
                initialTags={initialTags}
                classes={classes}
                imageSrc={imageSrc}
                metadata={metadata}
            />
        </Suspense>
    );
}
