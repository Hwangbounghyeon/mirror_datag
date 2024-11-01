import { ImageFile } from "@/types/upload";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface ImageProps {
    user_id: number;
    task: string;
    model_name: string;
    is_private: boolean;
    projectId: number;
    images: ImageFile[];
}

async function uploadImage({
    user_id,
    task,
    model_name,
    is_private,
    projectId,
    images,
}: ImageProps) {
    const formData = new FormData();
    const upload_request = JSON.stringify({
        user_id,
        task,
        model_name,
        project_id: projectId,
        is_private,
    });
    formData.append("upload_request", upload_request);
    images.forEach((item) => {
        formData.append("files", item.data);
    });
    try {
        const response = await fetch(`${BASE_URL}/upload`, {
            method: "POST",
            body: formData,
        });
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Upload error details:", errorData);
            throw new Error(`Upload failed: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
    } catch {
        console.log("error");
    }
}

export default uploadImage;
