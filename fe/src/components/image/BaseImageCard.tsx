import { FC, useState } from "react";
import Image from "next/image";

const fallbackImageSrc = "/images/zip.png";

interface BaseImageCardProps {
    src: string;
    className?: string;
    children?: React.ReactNode;
}

export const ImageContainer: FC<{ src: string }> = ({ src }) => {
    const [imgError, setImgError] = useState(false);

    return (
        <div className="aspect-square rounded-lg overflow-hidden relative max-w-[120px] max-h-[120px]">
            <Image
                src={imgError ? fallbackImageSrc : src}
                alt="No Image"
                fill
                className="object-cover pointer-events-none h-full w-full"
                draggable={false}
                onError={() => setImgError(true)}
            />
        </div>
    );
};

const BaseImageCard: FC<BaseImageCardProps> = ({
    src,
    className,
    children,
}) => (
    <div className={`relative ${className || ""}`}>
        <ImageContainer src={src} />
        {children}
    </div>
);

export default BaseImageCard;
