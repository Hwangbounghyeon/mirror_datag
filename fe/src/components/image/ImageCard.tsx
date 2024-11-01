import { FC } from "react";
import { IoCloseCircle } from "react-icons/io5";
import { ImageCardProps } from "@/types/upload";

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

const ImageContainer: FC<{ src: string; name: string }> = ({ src, name }) => (
    <div className="aspect-square rounded-lg overflow-hidden">
        <img src={src} alt={name} className="w-full h-full object-cover" />
    </div>
);

const ImageName: FC<{ name: string }> = ({ name }) => (
    <p className="text-sm mt-1 text-center">{name}</p>
);
