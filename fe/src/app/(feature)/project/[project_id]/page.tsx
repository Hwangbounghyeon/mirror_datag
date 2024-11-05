"use client";
import React, { useState } from "react";
import { Button, Modal, ModalContent, useDisclosure } from "@nextui-org/react";
import Image from "next/image";

import { ImagesType } from "@/types/ImagesType";
import ImageList from "@/components/project/dataset/image-list";
import FilterModal from "@/components/project/dataset/filter-modal";
import AnalysisModal from "@/components/project/dataset/analysis-modal";

import Filter from "@/public/filter.svg";

type SizeType = "md" | "xs" | "sm" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";

const Page = ({ params }: { params: { project_id: string } }) => {
  const [images, setImages] = useState<ImagesType[]>([
    {
      id: 20,
      imageUrl: "https://img.freepik.com/free-photo/panoramic-sea_1048-2667.jpg?semt=ais_hybrid",
      checked: false
    },
    {
      id: 21,
      imageUrl: "https://img.animalplanet.co.kr/news/2019/08/10/700/2w4w02ks9531p3v874c7.jpg",
      checked: false
    },
    {
      id: 22,
      imageUrl: "https://img.animalplanet.co.kr/news/2019/08/10/700/2w4w02ks9531p3v874c7.jpg",
      checked: false
    },
    {
      id: 23,
      imageUrl: "https://img.animalplanet.co.kr/news/2019/08/10/700/2w4w02ks9531p3v874c7.jpg",
      checked: false
    },
    {
      id: 24,
      imageUrl: "https://img.animalplanet.co.kr/news/2019/08/10/700/2w4w02ks9531p3v874c7.jpg",
      checked: false
    },
    {
      id: 25,
      imageUrl: "https://img.animalplanet.co.kr/news/2019/08/10/700/2w4w02ks9531p3v874c7.jpg",
      checked: false
    },
    {
      id: 26,
      imageUrl: "https://img.animalplanet.co.kr/news/2019/08/10/700/2w4w02ks9531p3v874c7.jpg",
      checked: false
    },
    {
      id: 27,
      imageUrl: "https://img.animalplanet.co.kr/news/2019/08/10/700/2w4w02ks9531p3v874c7.jpg",
      checked: false
    },
    {
      id: 28,
      imageUrl: "https://img.animalplanet.co.kr/news/2019/08/10/700/2w4w02ks9531p3v874c7.jpg",
      checked: false
    },
    {
      id: 29,
      imageUrl: "https://img.animalplanet.co.kr/news/2019/08/10/700/2w4w02ks9531p3v874c7.jpg",
      checked: false
    },
    {
      id: 30,
      imageUrl: "https://img.animalplanet.co.kr/news/2019/08/10/700/2w4w02ks9531p3v874c7.jpg",
      checked: false
    },
    {
      id: 31,
      imageUrl: "https://img.animalplanet.co.kr/news/2019/08/10/700/2w4w02ks9531p3v874c7.jpg",
      checked: false
    },
    {
      id: 32,
      imageUrl: "https://img.animalplanet.co.kr/news/2019/08/10/700/2w4w02ks9531p3v874c7.jpg",
      checked: false
    },
    {
      id: 33,
      imageUrl: "https://img.animalplanet.co.kr/news/2019/08/10/700/2w4w02ks9531p3v874c7.jpg",
      checked: false
    },
    {
      id: 34,
      imageUrl: "https://img.animalplanet.co.kr/news/2019/08/10/700/2w4w02ks9531p3v874c7.jpg",
      checked: false
    },
    {
      id: 35,
      imageUrl: "https://img.animalplanet.co.kr/news/2019/08/10/700/2w4w02ks9531p3v874c7.jpg",
      checked: false
    },
    {
      id: 36,
      imageUrl: "https://img.animalplanet.co.kr/news/2019/08/10/700/2w4w02ks9531p3v874c7.jpg",
      checked: false
    },
    {
      id: 37,
      imageUrl: "https://img.animalplanet.co.kr/news/2019/08/10/700/2w4w02ks9531p3v874c7.jpg",
      checked: false
    },
    {
      id: 38,
      imageUrl: "https://img.animalplanet.co.kr/news/2019/08/10/700/2w4w02ks9531p3v874c7.jpg",
      checked: false
    },
    {
      id: 39,
      imageUrl: "https://img.animalplanet.co.kr/news/2019/08/10/700/2w4w02ks9531p3v874c7.jpg",
      checked: false
    }
  ]);

  const {isOpen, onOpen, onClose} = useDisclosure();
  const [size, setSize] = useState<SizeType>('3xl');
  const [selectedModal, setSelectedModal] = useState<string | null>(null);

  const [selectedCount, setSelectedCount] = useState(0);

  const selectImage = (e: React.MouseEvent, targetId: number) => {
    e.stopPropagation();
    const currentImage = images.find(image => image.id === targetId);
    setSelectedCount(prev => currentImage?.checked ? prev - 1 : prev + 1);
    setImages(prevImages => 
      prevImages.map(image => 
        image.id === targetId 
          ? { ...image, checked: !image.checked }
          : image
      )
    );
  };

  const selectImageAll = () => {
    setImages(prevImages => 
      prevImages.map(image => ({ ...image, checked: true }))
    );
    
    setSelectedCount(images.length);
  };

  const unSelectImageAll = () => {
    setImages(prevImages => 
      prevImages.map(image => ({ ...image, checked: false }))
    );
    
    setSelectedCount(0);
  }

  const filterChecked = () => {
    return images.filter(image => image.checked).map(image => image.id);
  };

  const handleAnalysisOpen = (componentName: string) => {
    setSelectedModal(componentName)
    onOpen();
  }

  const getModalBody = () => {
    switch(selectedModal) {
      case 'analysis':
        return (
          <AnalysisModal 
            onClose={onClose}
            filterChecked={filterChecked}
            projectId={Number(params.project_id)}
          />
        );
      case 'filter':
        return <FilterModal onClose={onClose} />;
      default:
        return null;
    }
  }

  return (
    <div className="h-full flex flex-col gap-[1rem] mx-[3rem] pt-[2rem]">
      <div className="w-full h-[3rem] flex justify-between">
        <div className="text-3xl">Dataset (Project ID: {params.project_id})</div>
        <div className="">
          <Button className="text-lg" onPress={() => handleAnalysisOpen("analysis")}>Analysis</Button>
        </div>
      </div>
      <div className="w-full h-[2.5rem] flex items-center rounded-lg bg-gray-300">
        <div className="w-[3rem] flex justify-center border-r border-gray-400 cursor-pointer" onClick={() => handleAnalysisOpen("filter")}>
          <Image src={Filter} alt="leftBtn" className="w-[1.8rem]"/>
        </div>
        <div className="flex-grow ms-1">추가된 필터 여기에</div>
      </div>
      <div className="w-full h-[calc(100%-10rem)] p-[2rem] rounded-lg bg-gray-300">
        <ImageList 
          images={images} 
          selectImage={selectImage} 
          selectedCount={selectedCount}
          selectImageAll={selectImageAll}
          unSelectImageAll={unSelectImageAll}
        />
      </div>

      <Modal 
        size={size} 
        isOpen={isOpen} 
        onClose={onClose} 
      >
        <ModalContent>
          {() => (
            <>
              {getModalBody()}
            </>
          )}
        </ModalContent>
      </Modal>

    </div>
  );
};

export default Page;
