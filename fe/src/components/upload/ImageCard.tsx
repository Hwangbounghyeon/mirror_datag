import { FC } from "react";
import { IoCloseCircle } from "react-icons/io5";
import { ImageCardProps } from "@/types/upload";
import BaseImageCard from "../image/BaseImageCard";

const DeleteButton: FC<{ onDelete: () => void }> = ({ onDelete }) => (
    <div
        className="absolute top-2 right-2 cursor-pointer z-10 rounded-full hover:opacity-80"
        onClick={onDelete}
    >
        <IoCloseCircle size={24} color="#ff0000" />
    </div>
);

const ImageName: FC<{ name: string }> = ({ name }) => (
    <p className="text-sm mt-1 text-center truncate max-w-[120px]">{name}</p>
);

export const ImageCard: FC<ImageCardProps> = ({ src, name, onDelete }) => (
    <BaseImageCard src={src}>
        <DeleteButton onDelete={onDelete} />
        <ImageName name={name} />
    </BaseImageCard>
);
