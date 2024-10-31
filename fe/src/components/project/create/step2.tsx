import React from "react";
import SelectCard from "./select-card";
import { modelType, StepProps } from "@/types/projectType";
import { memo } from "react";

const cards: {
  imgUrl: string;
  title: string;
  description: string;
  value: modelType;
}[] = [
  {
    imgUrl: "/images/yolo-v5.png",
    title: "YOLO v5",
    description: "Idenify objecdts and their positions with bounding boxes",
    value: "yolo_v5",
  },
  {
    imgUrl: "/images/yolo-v8.png",
    title: "YOLO v8",
    description: "Idenify objecdts and their positions with bounding boxes",
    value: "yolo_v8",
  },
  {
    imgUrl: "/images/yolo-v11.png",
    title: "YOLO v11",
    description: "Idenify objecdts and their positions with bounding boxes",
    value: "yolo_v11",
  },
];

const Step2 = ({ handleMove, projectItem, setProjectItem }: StepProps) => {
  return (
    <div className="flex justify-center items-center">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-4xl lg:mx-auto p-4">
        {cards.map((card) => (
          <SelectCard
            selected={projectItem.model_name === card.value}
            key={card.title}
            imgUrl={card.imgUrl}
            title={card.title}
            description={card.description}
            onClick={() => {
              setProjectItem((prev) => ({ ...prev, model_name: card.value }));
              if (handleMove) {
                setProjectItem((prev) => ({ ...prev, model_name: card.value }));
                handleMove(3);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default memo(Step2);
