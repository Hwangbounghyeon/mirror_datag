import React from "react";
import ImageGrid from "@/components/image/ImageGrid";

interface UploadedContentProps {
  images: Array<{ src: string; name: string }>;
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
  <div className="flex h-full flex-col">
    <div className="flex justify-end gap-4 mb-4">
      <button
        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-gray-100"
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
    <div className="flex flex-wrap gap-4">
      {images.map((image, index) => (
        <div key={index} className="relative">
          <img
            src={image.src}
            alt={image.name}
            className="w-32 h-32 object-cover"
          />
          <button
            className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
            onClick={() => onDeleteImage(index)}
          >
            X
          </button>
        </div>
      ))}
    </div>
    <ImageGrid images={images} onDeleteImage={onDeleteImage} />;
  </div>
);

export default UploadedContent;
