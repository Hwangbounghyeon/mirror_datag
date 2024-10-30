"use client";

import React from "react";

const BatchList = () => {
  const batches = [
    {
      id: 4,
      name: "Batch 04",
      date: "2024-10-26",
      imageCount: 12,
      active: true,
    },
    {
      id: 3,
      name: "Batch 03",
      date: "2024-10-25",
      imageCount: 8,
      active: false,
    },
    {
      id: 2,
      name: "Batch 02",
      date: "2024-10-24",
      imageCount: 15,
      active: true,
    },
  ];

  return (
    <div className="flex flex-col space-y-4">
      {batches.map((batch) => (
        <div
          key={batch.id}
          className={`p-4 border rounded-lg ${
            batch.active ? "bg-green-100" : "bg-gray-100"
          }`}
        >
          <h2 className="text-lg font-bold">{batch.name}</h2>
          <p className="text-sm text-gray-600">{batch.date}</p>
          <p className="text-sm text-gray-600">{batch.imageCount} images</p>
        </div>
      ))}
    </div>
  );
};

export default BatchList;
