"use client";
import React, { useState, useEffect, use } from "react";
import { Button, Modal, ModalContent, useDisclosure } from "@nextui-org/react";
import Image from "next/image";

import { ImagesType, ImageListResponse } from "@/types/ImagesType";
import ImageList from "@/components/project/dataset/image-list";
import PaginationFooter from "@/components/project/dataset/pagination-footer";
import FilterModal from "@/components/project/dataset/filter-modal";
import AnalysisModal from "@/components/project/dataset/analysis-modal";
import Filter from "@/public/filter.svg";

import { getProjectImages } from "@/api/project/getProjectImages";
import { DefaultPaginationType } from "@/types/default";

type SizeType = "md" | "xs" | "sm" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";

const Page = ({ params }: { params: { project_id: string } }) => {
  const [images, setImages] = useState<ImagesType[]>([]);

  const {isOpen, onOpen, onClose} = useDisclosure();
  const [size, setSize] = useState<SizeType>('3xl');
  const [selectedModal, setSelectedModal] = useState<string | null>(null);

  const [selectedCount, setSelectedCount] = useState(0);

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [limit, setLimit] = useState(30);
  const [conditions, setConditions] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const selectImage = (e: React.MouseEvent, targetId: string) => {
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

  const getImages = async () => {
    setIsLoading(true);
    const searchParams = {
      page: page,
      limit: limit
    }

    const response: DefaultPaginationType<ImageListResponse> = await getProjectImages(params.project_id, searchParams)

    if (!response.data) {
      setPage(1);
      setTotalPage(1);
      setImages([]);
    }

    if (response.data) {
      const transformedImages: ImagesType[] = Object.entries(response.data.data.images).map(([id, imageUrl]) => ({
        id: id,
        imageUrl: imageUrl,
        checked: false
      }));
      
      setTotalPage(response.data.total_pages)
      setImages(transformedImages);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    getImages()
  }, [page])

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
      <div className="relative flex flex-col justify-between w-full h-[calc(100%-10rem)] p-[2rem] rounded-lg bg-gray-300">
        <ImageList 
          images={images} 
          selectImage={selectImage} 
          selectedCount={selectedCount}
          selectImageAll={selectImageAll}
          unSelectImageAll={unSelectImageAll}
        />
        <PaginationFooter currentPage={page} totalPage={totalPage} setCurrentPage={(targetPage: number) => {setPage(targetPage)}}/>
        { isLoading ? <div className="absolute top-0 left-0 flex justify-center items-center w-full h-full rounded-lg bg-black/50 text-white">로딩중</div> : <></> }
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
