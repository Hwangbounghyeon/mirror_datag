import ImageCard from "./ImageCard";

interface ImageGridProps {
    images: Array<{
        src: string;
        name: string;
    }>;
    onDeleteImage: (index: number) => void;
}

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
