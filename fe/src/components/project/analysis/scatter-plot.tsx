// components/ScatterPlot.tsx
'use client'

import { useRef, useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import zoomPlugin from 'chartjs-plugin-zoom';

// 타입 정의
interface DataPoint {
  id: string;
  x: number;
  y: number;
  label: string;
}

interface ScatterPlotProps {
  data: DataPoint[];
  onSelectPoints?: (points: string[]) => void;
}

interface LabelColors {
  [key: string]: string;
}

// ChartJS 등록
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
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedPoints, setSelectedPoints] = useState<string[]>([]);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // 데이터 그룹화 (class별 그룹화)
  const groupedData = data.reduce((acc, point) => {
    if (!acc[point.label]) {
      acc[point.label] = [];
    }
    acc[point.label].push(point);
    return acc;
  }, {} as Record<string, DataPoint[]>);

  // 데이터 색상 (class별)
  const labelColors: LabelColors = {
    'A': 'rgba(255, 99, 132, 0.8)',
    'B': 'rgba(54, 162, 235, 0.8)',
  };

  // 차트 데이터 구성
  const chartData = {
    datasets: Object.entries(groupedData).map(([label, points]) => ({
      label,
      data: points.map(p => ({
        x: p.x,
        y: p.y,
        id: p.id,
      })),
      backgroundColor: points.map(p => 
        selectedPoints.includes(p.id) 
          ? 'rgba(255, 255, 255, 0.8)' 
          : labelColors[label] || 'rgba(0, 0, 0, 0.6)'
      ),
      pointRadius: 8,
      pointHoverRadius: 10,
    })),
  };

  // 차트 옵션 구성
  const options = {
    animation: {
      duration: 0
    },
    scales: {
      x: {
        type: 'linear' as const,
        position: 'bottom' as const,
      },
      y: {
        type: 'linear' as const,
        position: 'left' as const,
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
            enabled: true
          },
          mode: 'xy' as const,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const point = data.find(p => 
              p.x === context.parsed.x && p.y === context.parsed.y
            );
            return `ID: ${point?.id}, Label: ${point?.label}`;
          },
        },
      },
      legend: {
        position: 'top' as const,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    preserveAspectRatio: false,
    redraw: false,
  };

  useEffect(() => {
    const mainCanvas = chartRef.current?.canvas;
    if (!mainCanvas) return;

    const container = mainCanvas.parentElement;
    if (!container) return;

    // 오버레이 캔버스 생성 및 설정
    const createOverlayCanvas = () => {
      const overlay = overlayCanvasRef.current;
      if (!overlay) return;

      const rect = mainCanvas.getBoundingClientRect();
      
      // 메인 캔버스와 동일한 크기로 설정
      overlay.width = rect.width;
      overlay.height = rect.height;
      
      // 오버레이 캔버스 스타일 설정
      overlay.style.position = 'absolute';
      overlay.style.left = '0';
      overlay.style.top = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.pointerEvents = 'none';
    };

    createOverlayCanvas();

    const handleMouseDown = (e: MouseEvent) => {
      const rect = mainCanvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setDragStart({ x, y });
      setIsDragging(true);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragStart) return;
      
      requestAnimationFrame(() => {
        const overlay = overlayCanvasRef.current;
        if (!overlay) return;
        const ctx = overlay.getContext('2d');
        if (!ctx) return;

        // 오버레이 캔버스만 클리어
        ctx.clearRect(0, 0, overlay.width, overlay.height);

        const rect = mainCanvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        // 드래그 박스 그리기
        ctx.fillStyle = 'rgba(0, 123, 255, 0.2)';
        ctx.fillRect(
          dragStart.x,
          dragStart.y,
          currentX - dragStart.x,
          currentY - dragStart.y
        );
      });
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!isDragging || !dragStart) return;

      const rect = mainCanvas.getBoundingClientRect();
      const endX = e.clientX - rect.left;
      const endY = e.clientY - rect.top;

      const chart = chartRef.current;
      const xScale = chart.scales.x;
      const yScale = chart.scales.y;

      const startDataX = xScale.getValueForPixel(dragStart.x);
      const endDataX = xScale.getValueForPixel(endX);
      const startDataY = yScale.getValueForPixel(dragStart.y);
      const endDataY = yScale.getValueForPixel(endY);

      const newSelectedPoints = data.filter(point => 
        point.x >= Math.min(startDataX, endDataX) &&
        point.x <= Math.max(startDataX, endDataX) &&
        point.y >= Math.min(startDataY, endDataY) &&
        point.y <= Math.max(startDataY, endDataY)
      ).map(p => p.id);

      setSelectedPoints(newSelectedPoints);
      onSelectPoints?.(newSelectedPoints);

      setIsDragging(false);
      setDragStart(null);

      // 드래그 박스 제거
      const overlay = overlayCanvasRef.current;
      if (overlay) {
        const ctx = overlay.getContext('2d');
        ctx?.clearRect(0, 0, overlay.width, overlay.height);
      }
    };

    // 윈도우 리사이즈 시 오버레이 캔버스 위치 조정
    const handleResize = () => {
      createOverlayCanvas();
    };

    mainCanvas.addEventListener('mousedown', handleMouseDown);
    mainCanvas.addEventListener('mousemove', handleMouseMove);
    mainCanvas.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('resize', handleResize);

    return () => {
      mainCanvas.removeEventListener('mousedown', handleMouseDown);
      mainCanvas.removeEventListener('mousemove', handleMouseMove);
      mainCanvas.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
    };
  }, [isDragging, dragStart, data, selectedPoints, onSelectPoints]);

  return (
    <div className='relative w-full h-full'>
      <div className="relative" style={{ width: '100%', height: '100%' }}>
        <Scatter ref={chartRef} data={chartData} options={options} />
        <canvas 
          ref={overlayCanvasRef} 
          className="absolute inset-0"
        />
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