import { loadImageDetail } from "@/api/detail/loadImageDetail";
import { Suspense } from "react";
import ImageDetailClient from "./imageDetailClient";

export default async function ImageDetailPage({
    params,
}: {
    params: { imageId: string };
}) {
    const imageId = params.imageId;
    const data = await loadImageDetail("672c4ad2d00bbc3d9b3d5d66"); //TODO 추후 수정

    if (!data.data) {
        throw new Error("Data is undefined");
    }

    const initialAuthorities = data.data.access_control.users.map((user) => ({
        user_id: user.uid,
        user_name: user.name,
        department_name: user.department_name,
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
