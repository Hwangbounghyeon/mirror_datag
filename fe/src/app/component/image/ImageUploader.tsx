import { FC } from "react";

interface ImageUploaderProps {
    onSelectFiles: (e: React.MouseEvent) => void;
    onSelectFolder: (e: React.MouseEvent) => void;
}

const ImageUploader = ({
    onSelectFiles,
    onSelectFolder,
}: ImageUploaderProps) => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <UploadIcon />
            <UploadInstructions />
            <UploadButtons
                onSelectFiles={onSelectFiles}
                onSelectFolder={onSelectFolder}
            />
            <SupportedFormats />
        </div>
    );
};

export default ImageUploader;

const UploadIcon: FC = () => (
    <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mb-4">
        <svg
            className="w-16 h-16 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
        </svg>
    </div>
);

const UploadInstructions: FC = () => (
    <>
        <p className="text-xl text-gray-600 mb-2">
            Drag and drop to file upload
        </p>
        <p className="text-lg text-gray-500 mb-4">or...</p>
    </>
);

const UploadButtons: FC<ImageUploaderProps> = ({
    onSelectFiles,
    onSelectFolder,
}) => (
    <div className="flex gap-48">
        <button
            className="px-12 py-4 border border-dashed border-gray-500 rounded text-black hover:bg-gray-100"
            onClick={onSelectFiles}
        >
            Select Files
        </button>
        <button
            className="px-12 py-4 border border-dashed border-gray-500 rounded text-black hover:bg-gray-100"
            onClick={onSelectFolder}
        >
            Select Folder
        </button>
    </div>
);

const SupportedFormats: FC = () => (
    <p className="text-base text-black mt-10">Supported Formats</p>
);
