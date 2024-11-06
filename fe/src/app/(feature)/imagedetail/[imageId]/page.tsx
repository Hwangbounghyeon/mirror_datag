import { loadImageDetail } from "@/api/detail/loadImageDetail";
import { Suspense } from "react";
import ImageDetailClient from "./imageDetailClient";

export default async function ImageDetailPage({
    params,
}: {
    params: { imageId: string };
}) {
    const imageId = params.imageId;
    const data = await loadImageDetail("6729792cae005e3836525cae"); //TODO 추후 수정

    if (!data.data) {
        throw new Error("Data is undefined");
    }

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
                imageIdx={parseInt(imageId, 10)} //TODO 추후 수정
                initialAuthorities={initialAuthorities}
                initialTags={initialTags}
                classes={classes}
                imageSrc={imageSrc}
                metadata={metadata}
            />
        </Suspense>
    );
}
