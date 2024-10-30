import { ImageGridProps } from "@/types/upload";
import { ImageCard } from "./ImageCard";

const ImageGrid = ({ images, onDeleteImage }: ImageGridProps) => {
  return (
    <div className="grid grid-cols-6 gap-4">
      {images.map((image, index) => (
        <ImageCard
          key={image.name}
          src={image.src}
          name={image.name}
          index={index + 1}
          onDelete={() => onDeleteImage(index)}
        />
      ))}
    </div>
  );
};

export default ImageGrid;
