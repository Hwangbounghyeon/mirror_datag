import React from "react";
import SelectCard from "./select-card";

const cards = [
  {
    imgUrl: "/images/object-detection.png",
    title: "Object Detection",
    description: "Idenify objecdts and their positions with bounding boxes",
  },
  {
    imgUrl: "/images/classification.png",
    title: "Image Classification",
    description: "Assign Labels to the entire Image",
  },
];

const Step1 = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-4xl lg:mx-auto p-4">
        {cards.map((card, idx) => (
          <SelectCard
            selected={idx == 0}
            key={card.title}
            imgUrl={card.imgUrl}
            title={card.title}
            description={card.description}
          />
        ))}
      </div>
    </div>
  );
};

export default Step1;
