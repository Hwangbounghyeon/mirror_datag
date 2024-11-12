"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { DataPoint } from "@/types/chartType";
import { HistoryData } from "@/types/historyType";
import { Select, SelectItem } from "@nextui-org/react";
import { getHistoryDetail } from "@/api/analysis/getHistoryDetail";
import { data } from "framer-motion/client";

// ScatterPlot 컴포넌트를 동적으로 import
const ScatterPlot = dynamic(
  () => import("@/components/project/analysis/scatter-plot"),
  { ssr: false }
);

interface SelectedIndices {
  x: number;
  y: number;
}

interface MainAnalysisProps {
  selectedHistory: string | null | undefined;
}

export function MainAnalysis({ selectedHistory }: MainAnalysisProps) {
  const [selectedIndices, setSelectedIndices] = useState<SelectedIndices>({
    x: 0,
    y: 1,
  });

  const [selectedData, setSelectedData] = useState<HistoryData | null>(null);
  const [plotData, setPlotData] = useState<DataPoint[]>([]);
  const [selectedPoints, setSelectedPoints] = useState<string[]>([]);

  const getHistory = async () => {
    if (!selectedHistory) return;

    const response = await getHistoryDetail(selectedHistory);

    if (!response.data) {
      return;
    }

    setSelectedData(response.data);
  };

  const featureOptions = Array.from({ length: 10 }, (_, i) => ({
    value: i.toString(),
    label: `Feature ${i}`,
  }));

  const handleIndexChange = (axis: "x" | "y", value: string) => {
    const numValue = parseInt(value);
    setSelectedIndices((prev) => {
      // 다른 축과 같은 값을 선택하려고 할 때
      if (
        (axis === "x" && numValue === prev.y) ||
        (axis === "y" && numValue === prev.x)
      ) {
        return prev;
      }
      return {
        ...prev,
        [axis]: numValue,
      };
    });
  };

  function extractFeatureData(data: HistoryData): DataPoint[] {
    if (!data.results) return [];
  
    return data.results
      .filter(result => 
        result.features && 
        Array.isArray(result.features)
      )
      .map((result) => ({
        id: result.imageId,
        x: (result.features as number[])[selectedIndices.x],
        y: (result.features as number[])[selectedIndices.y],
        label: result.predictions?.prediction || 'unknown',
      }));
  }

  useEffect(() => {
    if (selectedData) {
      const extractedData = extractFeatureData(selectedData);
      setPlotData(extractedData);
    }
  }, [selectedData, selectedIndices]);

  useEffect(() => {
    getHistory();
  }, [selectedHistory]);

  useEffect(() => {
    console.log(plotData)
  }, [plotData])

  return (
    <div className="flex flex-col max-w-[calc(80%-2rem)] flex-grow bg-gray-300 mx-[1rem]">
      <div className="flex flex-col">
        <div className="w-full flex bg-gray-300">
          <div className="w-[60%] h-[45rem]">
            <ScatterPlot
              data={plotData}
              selectedIndices={selectedIndices}
              onSelectPoints={setSelectedPoints}
            />
          </div>
          <div className="w-[40%]">
            <h2 className="text-lg font-semibold">Selected Points:</h2>
            <p>{selectedPoints.join(", ") || "None"}</p>
          </div>
        </div>

        <div className="w-full">
          <div className="w-[60%] flex items-center">
            <div className="flex-1">
              <Select
                label="X축 Feature"
                selectedKeys={[selectedIndices.x.toString()]}
                onChange={(e) => handleIndexChange("x", e.target.value)}
                className="w-full"
                classNames={{
                  base: "bg-white rounded-xl ",
                  trigger: "data-[hover=true]:border-none",
                  label: "text-black",
                }}
              >
                {featureOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    isDisabled={parseInt(option.value) === selectedIndices.y}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <div className="flex-1">
              <Select
                label="Y축 Feature"
                selectedKeys={[selectedIndices.y.toString()]}
                onChange={(e) => handleIndexChange("y", e.target.value)}
                className="w-full"
                classNames={{
                  base: "bg-white rounded-xl",
                  trigger: "data-[hover=true]:border-none",
                  label: "text-black",
                }}
              >
                {featureOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    isDisabled={parseInt(option.value) === selectedIndices.x}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-blue-500">Additional Analysis</div>
    </div>
  );
}

export default MainAnalysis;
