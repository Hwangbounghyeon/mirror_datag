"use client";
import React, { useState } from "react";
import dynamic from 'next/dynamic';

// ScatterPlot 컴포넌트를 동적으로 import
const ScatterPlot = dynamic(
  () => import('@/components/project/analysis/scatter-plot'),
  { ssr: false }
);

interface MainAnalysisProps {
}

export function MainAnalysis({  }: MainAnalysisProps) {
  const [selectedPoints, setSelectedPoints] = useState<string[]>([]);

  const sampleData = [
    { id: '1', x: 10, y: 20, label: 'A' },
    { id: '2', x: 15, y: 30, label: 'A' },
    { id: '3', x: 20, y: 25, label: 'B' },
    { id: '4', x: 25, y: 35, label: 'B' },
  ];

  return (
    <div className="flex flex-col flex-grow bg-gray-300">
      <div className="w-full flex bg-gray-300">
        <div className="w-[60%] h-[45rem]">
          <ScatterPlot 
            data={sampleData}
            onSelectPoints={setSelectedPoints}
          />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Selected Points:</h2>
          <p>{selectedPoints.join(', ') || 'None'}</p>
        </div>
      </div>
      <div className="w-full bg-blue-500">
        Additional Analysis
      </div>
    </div>
  );
}

export default MainAnalysis;
