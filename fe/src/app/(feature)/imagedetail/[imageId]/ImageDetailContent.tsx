import { loadImageDetail } from "@/api/detail/loadImageDetail";
import ImageDetailClient from "./imageDetailClient";

export async function ImageDetailContent({
    params,
}: {
    params: { imageId: string };
}) {
    const imageId = params.imageId;
    const data = await loadImageDetail("672d73396eb2c6ffde3bee1a"); //TODO 추후 수정

    if (!data.data) {
        throw new Error("Data is undefined");
    }

    const detections =
        data.data.metadata.aiResults[0].predictions[0].detections;

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
        <ImageDetailClient
            imageId={imageId}
            imageIdx={parseInt(imageId, 10)}
            initialAuthorities={initialAuthorities}
            initialTags={initialTags}
            classes={classes}
            imageSrc={imageSrc}
            metadata={metadata}
            detections={detections}
        />
    );
}
