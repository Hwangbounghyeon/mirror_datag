// components/SelectCard.tsx
import React from "react";
import Image from "next/image";

interface SelectCardProps {
  imgUrl: string;
  imgAlt?: string;
  title: string;
  description: string;
  selected: boolean;
  onClick?: () => void;
}

const SelectCard = ({
  imgUrl,
  imgAlt,
  title,
  description,
  selected = false,
  onClick,
}: SelectCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`
        h-full
        w-full
        max-w-[400px]
        flex 
        flex-col 
        bg-gray-100
        dark:bg-slate-700
        rounded-lg
        shadow-sm
        transition-all
        cursor-pointer
      
        ${selected ? "border-[6px] border-blue-500" : "border-none"}
        hover:scale-[101%]
        active:scale-[99%]
      `}
    >
      <div className="relative w-full pt-[60%]">
        <Image
          src={imgUrl}
          alt={imgAlt || "img"}
          fill
          className="absolute top-0 left-0 w-full h-full object-cover "
        />
      </div>

      <div className="flex flex-col flex-grow p-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-100 mb-2">
          with YOLO v5, v8, v11
        </p>
        <p className="text-gray-700">{description}</p>
      </div>
    </div>
  );
};

export default SelectCard;
