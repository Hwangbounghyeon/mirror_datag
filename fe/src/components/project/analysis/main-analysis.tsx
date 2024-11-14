"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { DataPoint } from "@/types/chartType";
import { 
  ClassificationPredictions, 
  HistoryData, 
  ObjectDetectionLabels, 
  ObjectDetectionPredictions, 
  ReductionResults 
} from "@/types/historyType";
import { Select, SelectItem, Pagination } from "@nextui-org/react";
import { getHistoryDetail } from "@/api/analysis/getHistoryDetail";
import Image from "next/image";

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
  const [selectedPoints, setSelectedPoints] = useState<ReductionResults[]>([]);
  
  // 페이지네이션 관련 상태
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(selectedPoints.length / itemsPerPage);
  
  // 현재 페이지에 표시할 아이템 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = selectedPoints.slice(indexOfFirstItem, indexOfLastItem);

  const isObjectDetectionLabels = (
    label: ObjectDetectionLabels | string | undefined
  ): label is ObjectDetectionLabels => {
    return typeof label === 'object' && label !== null && 'label' in label && 'bbox' in label;
  };

  const isObjectDetectionPredictions = (
    predictions: ClassificationPredictions | ObjectDetectionPredictions | null
  ): predictions is ObjectDetectionPredictions => {
    return predictions !== null && 'bbox' in predictions;
  };

  const getHistory = async () => {
    if (!selectedHistory) return;
    const response = await getHistoryDetail(selectedHistory);
    if (!response.data) return;
    setSelectedData(response.data);
  };

  const featureOptions = Array.from({ length: 10 }, (_, i) => ({
    value: i.toString(),
    label: `Feature ${i}`,
  }));

  const handleIndexChange = (axis: "x" | "y", value: string) => {
    const numValue = parseInt(value);
    setSelectedIndices((prev) => {
      if ((axis === "x" && numValue === prev.y) || (axis === "y" && numValue === prev.x)) {
        return prev;
      }
      return { ...prev, [axis]: numValue };
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  function extractFeatureData(data: HistoryData): DataPoint[] {
    if (!data.results) return [];
    return data.results
      .filter(result => result.features && Array.isArray(result.features))
      .map((result) => ({
        id: result.detailId,
        x: (result.features as number[])[selectedIndices.x],
        y: (result.features as number[])[selectedIndices.y],
        label: result.predictions?.prediction || 'unknown',
      }));
  }

  const selectPoints = (imageIds: string[]) => {
    if (selectedData?.results) {
      const matchingResults = selectedData.results.filter(result =>
        imageIds.includes(result.detailId)
      );
      setSelectedPoints(matchingResults);
      setCurrentPage(1); // 새로운 포인트가 선택되면 첫 페이지로 이동
    }
  };

  useEffect(() => {
    if (selectedData) {
      const extractedData = extractFeatureData(selectedData);
      setPlotData(extractedData);
    }
  }, [selectedData, selectedIndices]);

  useEffect(() => {
    getHistory();
  }, [selectedHistory]);

  return (
    <div className="flex flex-col w-full flex-grow bg-content1 mx-4 rounded-xl shadow-medium">
      <div className="flex flex-col p-6 space-y-6">
        <div className="flex gap-6">
          {/* Chart Container */}
          <div className="w-[60%] bg-white rounded-xl shadow-sm p-4 border border-divider shrink-0">
            <div className="h-[45rem]">
              <ScatterPlot
                data={plotData}
                selectedIndices={selectedIndices}
                onSelectPoints={selectPoints}
              />
            </div>
            <div className="mt-4 flex gap-4">
              <Select
                label="X축 Feature"
                selectedKeys={[selectedIndices.x.toString()]}
                onChange={(e) => handleIndexChange("x", e.target.value)}
                classNames={{
                  base: "flex-1 bg-default-100",
                  trigger: "h-12 rounded-lg border-2 border-divider data-[hover=true]:bg-default-200",
                  label: "text-foreground font-medium",
                  listbox: "rounded-lg border-2 border-divider",
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
              <Select
                label="Y축 Feature"
                selectedKeys={[selectedIndices.y.toString()]}
                onChange={(e) => handleIndexChange("y", e.target.value)}
                classNames={{
                  base: "flex-1 bg-default-100",
                  trigger: "h-12 rounded-lg border-2 border-divider data-[hover=true]:bg-default-200",
                  label: "text-foreground font-medium",
                  listbox: "rounded-lg border-2 border-divider",
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

          {/* Selected Points Panel */}
          <div className="w-[40%] bg-white rounded-xl shadow-sm p-6 border border-divider">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-foreground">선택된 포인트</h2>
              <span className="text-sm text-default-500">
                {selectedPoints.length}개 선택됨
              </span>
            </div>
            <div className="max-h-[44rem] flex-grow overflow-y-auto scrollbar-hide">
              {selectedPoints.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 gap-4">
                    {currentItems.map((point, index) => (
                      <div
                        key={index}
                        className="flex flex-col bg-default-50 rounded-lg border border-divider overflow-hidden hover:border-primary transition-colors"
                      >
                        <div className="flex">
                          <div className="relative flex-grow bg-default-200">
                            <Image
                              src={point.imageUrl}
                              alt={`Selected point ${index + 1}`}
                              fill={true}
                              sizes="100%"
                              style={{ objectFit: 'cover' }}
                            />
                          </div>
                          <div className="w-[70%] p-4 space-y-2">
                            <div className="flex justify-between items-start">
                              <div className="flex flex-col">
                                <span className="text-sm text-default-500 truncate">
                                  ID: {point.imageId}
                                </span>
                                <span className="text-sm text-default-500 truncate">
                                  Detail ID: {point.detailId}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                {point.predictions && (
                                  <>
                                    <span className="text-sm text-default-600">예측:</span>
                                    <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                                      {point.predictions.prediction}
                                    </span>
                                  </>
                                )}
                                {point.label && (
                                  <>
                                    <span className="text-sm text-default-600">실제:</span>
                                    <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                                      {isObjectDetectionLabels(point.label)
                                        ? point.label.label
                                        : point.label}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* 페이지네이션 */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-4">
                      <Pagination
                        total={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        showControls
                        classNames={{
                          wrapper: "gap-2",
                          item: "w-8 h-8",
                        }}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-default-500">
                  <svg
                    className="w-12 h-12 mb-4 text-default-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-center">선택된 포인트가 없습니다</p>
                  <p className="text-sm text-default-400">
                    차트에서 포인트를 선택해주세요
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainAnalysis;