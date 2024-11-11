import React, { useState } from "react";
import Image from "next/image";
import { Button, Card } from "@nextui-org/react";

import DetailModal from "@/components/project/dataset/detail-modal";
import CountModal from "@/components/project/dataset/count-modal";
import { ImagesType } from "@/types/ImagesType";
import CheckMark from "@/public/check-mark.svg";

interface ImageListProps {
  images: ImagesType[];
  selectImage: (e: React.MouseEvent, targetId: string) => void;
  selectedCount: number;
  selectedImageIds: string[];
  selectImageAll: () => void;
  unSelectImageAll: () => void;
}

const ImageList = ({ images, selectImage, selectedCount, selectedImageIds, selectImageAll, unSelectImageAll }: ImageListProps) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCountModalOpen, setIsCountModalOpen] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  const detailOpen = (imageId: string) => {
    setSelectedImageId(imageId)
    setIsDetailOpen(true)
  };

  const detailClose = () => {
    setIsDetailOpen(false)  
  };

  const CountOpen = () => {
    setIsCountModalOpen(true)
    console.log(selectedImageIds)
  };

  const CountClose = () => {
    setIsCountModalOpen(false)  
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button 
            color="primary" 
            variant="flat"
            onPress={selectImageAll}
            className="flex-1 sm:flex-none"
          >
            Select All
          </Button>
          <Button 
            color="danger" 
            variant="flat"
            onPress={unSelectImageAll}
            className="flex-1 sm:flex-none"
          >
            Deselect All
          </Button>
        </div>
        <div 
          className="text-lg cursor-pointer w-full sm:w-auto text-center sm:text-right" 
          onClick={CountOpen}
        >
          {selectedCount} Items Selected
        </div>
      </div>

      <div className="w-full flex justify-center">
        <div className="grid max-md:gap-x-[2.5rem] grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-10 gap-3 sm:gap-4 max-w-[calc(10rem*10+1rem*9)]">
          {images?.map((image, index) => (
            <Card 
              key={index}
              isPressable
              onPress={() => detailOpen(image.id)}
              className="aspect-square w-full max-w-[10rem]"
            >
              <div className="relative w-full h-full">
                <img 
                  src={image.imageUrl} 
                  alt=""
                  className="w-full h-full object-cover"
                />
                <Button
                  isIconOnly
                  className="absolute top-2 right-2 bg-white/80 dark:bg-gray-800/80"
                  size="sm"
                  onClick={(e) => selectImage(e, image.id)}
                >
                  {image.checked && <Image src={CheckMark} alt="check" className="w-4 h-4" />}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {isDetailOpen && <DetailModal imageId={selectedImageId} modalClose={detailClose} />}
      {isCountModalOpen && <CountModal selectedImageIds={selectedImageIds} modalClose={CountClose} />}
    </div>
  );
};

export default ImageList;
