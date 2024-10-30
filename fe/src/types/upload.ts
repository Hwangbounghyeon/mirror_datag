export interface ImageFile {
    src: string;
    name: string;
}

export type UploadType = "zip" | "images" | null;

export type ValidationResult =
    | { isValid: false; error: string }
    | { isValid: true; files: File[]; type: "zip" | "images" };

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
