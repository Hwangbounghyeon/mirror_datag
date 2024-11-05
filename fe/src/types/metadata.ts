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
    createdAt: Date;
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
    inferenceStartedAt: Date;
    elapsedTime: number;
    tags: string[];
}

interface AiResult {
    aiModel: string;
    task: string;
    predictions: Prediction[];
}

export interface ImageDetail {
    _id: string;
    schemaVersion: string;
    fileList: string[];
    metadata: Metadata;
    aiResults: AiResult[];
}
