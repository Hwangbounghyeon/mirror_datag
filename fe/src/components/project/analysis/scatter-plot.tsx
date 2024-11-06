"use client";

import { useRef, useState, useEffect } from "react";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Scatter } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";
import { DataPoint } from "@/types/chartType";

interface ScatterPlotProps {
  data: DataPoint[];
  onSelectPoints?: (points: string[]) => void;
}

interface LabelColors {
  [key: string]: string;
}

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  zoomPlugin
);

const ScatterPlot = ({ data, onSelectPoints }: ScatterPlotProps) => {
  const chartRef = useRef<any>(null);
  const [selectedPoints, setSelectedPoints] = useState<string[]>([]);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [isDragging, setIsDragging] = useState(false);
  const animationFrameRef = useRef<number>();

  const groupedData = data.reduce((acc, point) => {
    if (!acc[point.label]) {
      acc[point.label] = [];
    }
    acc[point.label].push(point);
    return acc;
  }, {} as Record<string, DataPoint[]>);

  const labelColors: LabelColors = {
    A: "rgba(255, 99, 132, 0.8)",
    B: "rgba(54, 162, 235, 0.8)",
  };

  const chartData = {
    datasets: Object.entries(groupedData).map(([label, points]) => ({
      label,
      data: points.map((p) => ({
        x: p.x,
        y: p.y,
        id: p.id,
      })),
      backgroundColor: labelColors[label] || "rgba(0, 0, 0, 0.6)",
      pointBackgroundColor: points.map((p) =>
        selectedPoints.includes(p.id)
          ? "rgba(255, 255, 255, 0.8)"
          : labelColors[label] || "rgba(0, 0, 0, 0.6)"
      ),
      // legend 테두리 색상 추가
      borderColor: labelColors[label] || "rgba(0, 0, 0, 0.6)",
      pointRadius: 8,
      pointHoverRadius: 10,
    })),
  };

  const optionsRef = useRef({
    animation: { duration: 0 },
    scales: {
      x: {
        type: "linear" as const,
        position: "bottom" as const,
      },
      y: {
        type: "linear" as const,
        position: "left" as const,
      },
    },
    plugins: {
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
            speed: 0.1,
          },
          pinch: {
            enabled: false,
          },
          mode: "xy" as const,
        },
      },
      tooltip: {
        enabled: (context: any) => {
          return !context.chart.dragStatus?.isDragging;
        },
        callbacks: {
          label: (context: any) => {
            const point = data.find(
              (p) => p.x === context.parsed.x && p.y === context.parsed.y
            );
            return `ID: ${point?.id}, Label: ${point?.label}`;
          },
        },
      },
      legend: {
        position: "top" as const,
        labels: {
          // legend 텍스트 색상 유지
          usePointStyle: true,
          generateLabels: (chart: any) => {
            const datasets = chart.data.datasets;
            return datasets.map((dataset: any) => ({
              text: dataset.label,
              fillStyle: dataset.backgroundColor,
              strokeStyle: dataset.borderColor,
              lineWidth: 2,
              hidden: !chart.isDatasetVisible(datasets.indexOf(dataset)),
            }));
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    events: [
      "mousemove",
      "mouseout",
      "click",
      "touchstart",
      "touchmove",
      "mousedown",
      "mouseup",
    ] as (keyof HTMLElementEventMap)[],
    hover: {
      mode: "nearest" as const,
      intersect: true,
    },
    interaction: {
      mode: "nearest" as const,
      intersect: true,
    },
  });

  useEffect(() => {
    const dragSelectPlugin = {
      id: "dragSelect",
      beforeEvent: function (chart: any, args: any) {
        const event = args.event;

        if (event.type === "mousedown") {
          setDragStart({ x: event.x, y: event.y });
          setIsDragging(true);
          chart.dragStatus = { isDragging: true };
          // 드래그 시작 시 interaction 비활성화
          chart.options.hover.mode = null;
          chart.options.interaction.mode = null;
        }

        if (event.type === "mousemove" && isDragging && dragStart) {
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }

          animationFrameRef.current = requestAnimationFrame(() => {
            const canvas = chart.canvas;
            const ctx = canvas.getContext("2d");

            chart.draw();
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = "rgba(0, 123, 255, 0.2)";
            ctx.strokeStyle = "rgba(0, 123, 255, 0.8)";
            ctx.lineWidth = 1;

            const rect = {
              x: Math.min(dragStart.x, event.x),
              y: Math.min(dragStart.y, event.y),
              width: Math.abs(event.x - dragStart.x),
              height: Math.abs(event.y - dragStart.y),
            };

            ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
            ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
            ctx.restore();
          });
        }

        if (event.type === "mouseup" && isDragging && dragStart) {
          const xScale = chart.scales.x;
          const yScale = chart.scales.y;
          const startDataX = xScale.getValueForPixel(dragStart.x);
          const endDataX = xScale.getValueForPixel(event.x);
          const startDataY = yScale.getValueForPixel(dragStart.y);
          const endDataY = yScale.getValueForPixel(event.y);

          const newSelectedPoints = data
            .filter(
              (point) =>
                point.x >= Math.min(startDataX, endDataX) &&
                point.x <= Math.max(startDataX, endDataX) &&
                point.y >= Math.min(startDataY, endDataY) &&
                point.y <= Math.max(startDataY, endDataY)
            )
            .map((p) => p.id);

          setSelectedPoints(newSelectedPoints);
          onSelectPoints?.(newSelectedPoints);
          setIsDragging(false);
          setDragStart(null);
          chart.dragStatus = { isDragging: false };
          // 드래그 종료 시 interaction 다시 활성화
          chart.options.hover.mode = "point";
          chart.options.interaction.mode = "point";

          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }
          chart.draw();
        }
      },
    };

    ChartJS.register(dragSelectPlugin);

    return () => {
      ChartJS.unregister(dragSelectPlugin);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isDragging, dragStart, data, onSelectPoints]);

  return (
    <div className="relative w-full h-full">
      <div className="relative" style={{ width: "100%", height: "100%" }}>
        <Scatter ref={chartRef} data={chartData} options={optionsRef.current} />
      </div>
      <button
        className="absolute top-[1rem] right-[1rem] px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        onClick={() => {
          setSelectedPoints([]);
          onSelectPoints?.([]);
        }}
      >
        Clear
      </button>
    </div>
  );
};

export default ScatterPlot;
