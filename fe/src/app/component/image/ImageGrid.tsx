import ImageCard from "./ImageCard";

const ImageGrid = () => {
    const images = [
        { src: "/images/yolo-v5.png", name: "000001.jpg" },
        { src: "/images/yolo-v8.png", name: "000002.jpg" },
        { src: "/images/yolo-v11.png", name: "000003.jpg" },
    ];

    return (
        <div className="grid grid-cols-6 gap-4">
            {images.map((image, index) => (
                <ImageCard
                    key={image.name}
                    src={image.src}
                    name={image.name}
                    index={index + 1}
                />
            ))}
        </div>
    );
};

export default ImageGrid;
