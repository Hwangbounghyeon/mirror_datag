import { FC, useState } from "react";
import { IoCloseCircle } from "react-icons/io5";
import { ImageCardProps } from "@/types/upload";
import Image from "next/image";

const fallbackImageSrc = "/images/zip.png";

export const ImageCard: FC<ImageCardProps> = ({ src, name, onDelete }) => (
    <div className="relative">
        <DeleteButton onDelete={onDelete} />
        <ImageContainer src={src} name={name} />
        <ImageName name={name} />
    </div>
);

const DeleteButton: FC<{ onDelete: () => void }> = ({ onDelete }) => (
    <div
        className="absolute top-2 right-2 cursor-pointer z-10 rounded-full hover:opacity-80"
        onClick={onDelete}
    >
        <IoCloseCircle size={24} color="#ff0000" />
    </div>
);

const ImageContainer: FC<{ src: string; name: string }> = ({ src }) => {
    const [imgError, setImgError] = useState(false);

    return (
        <div className="aspect-square rounded-lg overflow-hidden relative min-w-[120px] min-h-[120px]">
            <Image
                src={imgError ? fallbackImageSrc : src}
                alt="No Image"
                fill
                className="object-cover pointer-events-none"
                draggable={false}
                onError={() => setImgError(true)}
            />
        </div>
    );
};

const ImageName: FC<{ name: string }> = ({ name }) => (
    <p className="text-sm mt-1 text-center truncate max-w-[120px]">{name}</p>
);
