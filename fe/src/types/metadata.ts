import { User } from "./auth";
import { DefaultResponseType } from "./default";

interface AccessControlResponse {
    user: User[];
    department: string[];
}

interface AccessControl {
    users: number[];
    departments: string[];
    projects: string[];
}

interface Metadata {
    branch: string;
    process: string;
    location: string;
    equipmentId: string;
    uploader: number;
    isPrivate: boolean;
    accessControl: AccessControl;
    createdAt: string;
    mode: string;
}

interface Detection {
    prediction: string;
    confidence: number;
    threshold: number;
    bbox: number[];
}

interface Prediction {
    fileIndex: number;
    detections: Detection[];
    inferenceStartedAt: string;
    elapsedTime: number;
    tags: string[];
}

interface AiResult {
    aiModel: string;
    task: string;
    predictions: Prediction[];
}

interface ImageDetail {
    _id: string;
    schemaVersion: string;
    fileList: string[];
    metadata: Metadata;
    aiResults: AiResult[];
}

interface ImageDetailResponseData {
    metadata: ImageDetail;
    access_control: AccessControlResponse;
}

export type ImageDetailResponse = DefaultResponseType<ImageDetailResponseData>;
