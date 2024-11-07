import { DefaultResponseType } from "./default";
import { ImageFile } from "./upload";

export interface UploadImageRequest {
    user_id: number;
    task: string;
    model_name: string;
    is_private: boolean;
    projectId: number;
    images: ImageFile[];
}

export type UploadResponse = DefaultResponseType<string[]>;
