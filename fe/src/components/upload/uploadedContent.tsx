import React from "react";
import { ImageGrid } from "../image/ImageGrid";

interface UploadedContentProps {
    images: Array<{ src: string; name: string; data: File }>;
    onDeleteAllImages: () => void;
    onDeleteImage: (index: number) => void;
    onSelectFiles: () => void;
    onSelectFolder: () => void;
}

const UploadedContent: React.FC<UploadedContentProps> = ({
    images,
    onDeleteAllImages,
    onDeleteImage,
    onSelectFiles,
    onSelectFolder,
}) => (
    <div className="flex h-full flex-col justify-center">
        <div className="flex justify-end gap-4 mb-4">
            <button
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                onClick={onDeleteAllImages}
            >
                Delete All Files
            </button>
            <button
                className="px-6 py-2 border-2 border-dashed border-gray-300"
                onClick={onSelectFiles}
            >
                Select Files
            </button>
            <button
                className="px-6 py-2 border-2 border-dashed border-gray-300"
                onClick={onSelectFolder}
            >
                Select Folder
            </button>
        </div>
        <div className="flex flex-wrap gap-4 h-full">
            <ImageGrid images={images} onDeleteImage={onDeleteImage} />
        </div>
    </div>
);

export default UploadedContent;
