import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@nextui-org/react";

import DetailModal from "@/components/project/dataset/detail-modal";
import { ImagesType } from "@/types/ImagesType";
import CheckMark from "@/public/check-mark.svg";

interface ImageListProps {
  images: ImagesType[];
  selectImage: (e: React.MouseEvent, targetId: string) => void;
  selectedCount: number;
  selectImageAll: () => void;
  unSelectImageAll: () => void;
}

const ImageList = ({ images, selectImage, selectedCount, selectImageAll, unSelectImageAll }: ImageListProps) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  

  const detailOpen = (imageId: string) => {
    setSelectedImageId(imageId)
    setIsDetailOpen(true)
  };

  const detailClose = () => {
    setIsDetailOpen(false)  
  };

  return (
    <div className="w-full max-h-full flex flex-col gap-[1rem] overflow-y-auto">
      <div className="w-full h-[3rem] flex">
        <div className="flex gap-[1rem]">
          <Button className="bg-blue-300" onClick={selectImageAll}>전체 선택</Button>
          <Button className="bg-blue-300" onClick={unSelectImageAll}>전체 선택해제</Button>
        </div>
        <div className="text-right text-lg flex-grow">
          선택된 아이템 수: {selectedCount}개
        </div>
      </div>
      <div className="flex-grow flex justify-center items-center flex-wrap gap-[1.5rem] overflow-y-auto">
        {images?.map((image, index) => (
          <div 
            key={index} 
            className="w-[8%] min-w-[7rem] aspect-[1/1] bg-yellow-100 cursor-pointer relative rounded-xl overflow-hidden"
            onClick={() => detailOpen(image.id)}
          > 
            <img 
              src={image.imageUrl} 
              alt=""
              className="w-full h-full object-cover"
            />
            <div 
              className="absolute top-0 right-0 m-1 bg-gray-200 w-[20%] h-[20%] flex justify-center items-center border-1 border-black" 
              onClick={(e) => selectImage(e, image.id)}
            >
              {image.checked && (
                <Image src={CheckMark} alt="leftBtn" className="w-[80%]"/>
              )}
            </div>
          </div>
        ))}
      </div>
      {isDetailOpen ? <DetailModal imageId={selectedImageId} modalClose={detailClose}></DetailModal> : <></>}
    </div>
  );
};

export default ImageList;
