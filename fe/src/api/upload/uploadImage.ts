import { UploadImageRequest, UploadResponse } from "@/types/imageUpload";
import apiClient from "../client";

export const uploadImage = async (
    request: UploadImageRequest
): Promise<UploadResponse> => {
    const formData = new FormData();
    const upload_request = JSON.stringify({
        project_id: request.project_id,
        is_private: request.is_private,
    });

    formData.append("upload_request", upload_request);
    request.images.forEach((item) => {
        formData.append("files", item.data);
    });

    return apiClient<UploadResponse>("/project/image/upload", {
        method: "POST",
        body: formData,
        cache: "no-store",
    });
};
