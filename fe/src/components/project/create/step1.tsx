import React from "react";
import SelectCard from "./select-card";

import { StepProps } from "@/types/projectType";
import { categoryType } from "@/types/projectType";

const cards: {
  imgUrl: string;
  title: string;
  description: string;
  value: categoryType;
}[] = [
  {
    imgUrl: "/images/object-detection.png",
    title: "Object Detection",
    description: "Idenify objecdts and their positions with bounding boxes",
    value: "object-detection",
  },
  {
    imgUrl: "/images/classification.png",
    title: "Image Classification",
    description: "Assign Labels to the entire Image",
    value: "image-classification",
  },
];

const Step1 = ({ handleMove, projectItem, setProjectItem }: StepProps) => {
  return (
    <div className="flex justify-center items-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-4xl lg:mx-auto p-4">
        {cards.map((card) => (
          <SelectCard
            selected={projectItem.category === card.value}
            key={card.title}
            imgUrl={card.imgUrl}
            title={card.title}
            description={card.description}
            onClick={() => {
              setProjectItem((prev) => ({ ...prev, category: card.value }));
              if (handleMove) {
                handleMove(2);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Step1;
