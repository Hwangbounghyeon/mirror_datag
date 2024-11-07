import { UploadImageRequest, UploadResponse } from "@/types/imageUpload";
import apiClient from "../client";

export const uploadImage = async (
    request: UploadImageRequest
): Promise<UploadResponse> => {
    const formData = new FormData();
    const upload_request = JSON.stringify({
        user_id: request.user_id,
        task: request.task,
        model_name: request.model_name,
        project_id: request.projectId,
        is_private: request.is_private,
    });

    formData.append("upload_request", upload_request);
    request.images.forEach((item) => {
        formData.append("files", item.data);
    });

    return apiClient<UploadResponse>("/upload", {
        method: "POST",
        body: formData,
        headers: {},
        cache: "no-store",
    });
};
