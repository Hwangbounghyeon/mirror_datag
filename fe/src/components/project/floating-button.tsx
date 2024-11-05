"use client";
import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import { useRouter, usePathname } from "next/navigation";

interface FloatingButtonProps {
}

export function FloatingButton({  }: FloatingButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  const projectId = pathname.split('/')[2];

  return (
    <div className="fixed bottom-5 right-5 w-[3.5rem] h-[3.5rem] rounded-full bg-primary cursor-pointer" onClick={() => setIsVisible(!isVisible)}>
      <div className="relative w-full h-full">
        <div className="flex justify-center items-center w-full h-full">
            Move
        </div>
        <div className={`absolute right-0 flex flex-col gap-2 transition-all duration-300 ease-in-out ${
          isVisible ? '-top-[8rem] opacity-100' : 'top-0 opacity-0 pointer-events-none'
        }`}>
          <Button 
            className="w-[3.5rem] h-[3.5rem] rounded-full p-0 min-w-0"
            color="primary" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/project/${projectId}/analysis`);
            }}
          >
            History
          </Button>
          <Button 
            className="w-[3.5rem] h-[3.5rem] rounded-full p-0 min-w-0"
            color="primary" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/project/${projectId}`);
            }}
          >
            Dataset
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FloatingButton;
