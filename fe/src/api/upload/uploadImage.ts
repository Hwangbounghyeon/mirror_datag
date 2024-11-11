import { UploadImageRequest, UploadResponse } from "@/types/imageUpload";
import apiClient from "../client";

export const uploadImage = async (
    request: UploadImageRequest
): Promise<UploadResponse> => {
    console.log("Starting image upload process", {
        projectId: request.project_id,
        imageCount: request.images.length,
    });

    const formData = new FormData();

    try {
        formData.append(
            "upload_request",
            JSON.stringify({
                project_id: request.project_id,
                is_private: request.is_private,
            })
        );
        console.log("FormData upload_request added");

        request.images.forEach((item, index) => {
            formData.append("files", item.data);
            console.log(`Added image ${index + 1} to FormData`);
        });

        console.log("Sending request to API");
        const response = await apiClient<UploadResponse>(
            "/project/image/upload",
            {
                method: "POST",
                body: formData,
                cache: "no-store",
                headers: {},
            }
        );
        console.log("Upload response received", { status: response });
        return response;
    } catch (error) {
        console.error("Upload failed:", error);
        throw error;
    }
};
