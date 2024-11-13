export interface ImageFile {
    src: string;
    name: string;
    data: File;
}

export type UploadType = "zip" | "images" | ".7z" | ".json" | null;

export type ValidationResult =
    | { isValid: false; error: string }
    | { isValid: true; files: File[]; type: "zip" | "images" | "json" | ".7z" };

export interface UploadContentProps {
    images: ImageFile[];
    onFileUpload: (files: File[]) => void;
    onDeleteImage: (index: number) => void;
    onDeleteAllImages: () => void;
}

export interface ImageCardProps {
    src: string;
    name: string;
    index: number;
    onDelete: () => void;
}

export interface ImageGridProps {
    images: ImageFile[];
    onDeleteImage: (index: number) => void;
}
