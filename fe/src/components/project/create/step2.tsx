import React from "react";
import SelectCard from "./select-card";

const cards = [
  {
    imgUrl: "/images/yolo-v5.png",
    title: "YOLO v5",
    description: "Idenify objecdts and their positions with bounding boxes",
  },
  {
    imgUrl: "/images/yolo-v8.png",
    title: "YOLO v8",
    description: "Idenify objecdts and their positions with bounding boxes",
  },
  {
    imgUrl: "/images/yolo-v11.png",
    title: "YOLO v11",
    description: "Idenify objecdts and their positions with bounding boxes",
  },
];

const Step2 = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-4xl lg:mx-auto p-4">
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

export default Step2;
