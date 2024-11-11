interface BaseImage {
    id?: string;
    name?: string;
    url?: string;
    src?: string;
}

interface BaseImageGridProps<T extends BaseImage> {
    images: T[];
    renderItem: (image: T, index: number) => React.ReactNode;
    className?: string;
}

export const BaseImageGrid = <T extends BaseImage>({
    images,
    renderItem,
    className = "grid grid-cols-6 gap-4",
}: BaseImageGridProps<T>) => {
    return (
        <div className={className}>
            {images.map((image, index) => renderItem(image, index))}
        </div>
    );
};
