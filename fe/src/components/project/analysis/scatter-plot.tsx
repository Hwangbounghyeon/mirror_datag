'use client'

import { useRef, useState, useEffect, useMemo } from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  ScatterDataPoint,
  Chart,
  ScriptableTooltipContext,
  TooltipItem
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import zoomPlugin from 'chartjs-plugin-zoom';
import { DataPoint } from '@/types/chartType';

interface SelectedIndices {
  x: number;
  y: number;
}

interface ScatterPlotProps {
  data: DataPoint[];
  selectedIndices: SelectedIndices;
  onSelectPoints?: (points: string[]) => void;
}

interface LabelColors {
  [key: string]: string;
}

interface ChartDataset {
  label: string;
  data: Array<{
    x: number;
    y: number;
    id: string;
  }>;
  backgroundColor: string;
  pointBackgroundColor: string[];
  borderColor: string;
  pointRadius: number;
  pointHoverRadius: number;
}

interface DragStatus {
  isDragging: boolean;
}

interface CustomChart extends Chart<'scatter', ScatterDataPoint[], unknown> {
  dragStatus?: DragStatus;
}

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  zoomPlugin
);

const ScatterPlot = ({ data, selectedIndices, onSelectPoints }: ScatterPlotProps) => {
  const chartRef = useRef<CustomChart | null>(null);
  const [selectedPoints, setSelectedPoints] = useState<string[]>([]);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const animationFrameRef = useRef<number>();

  const labelColors: LabelColors = {
    'cat': 'rgba(255, 99, 132, 0.8)',
    'car': 'rgba(54, 162, 235, 0.8)',
  };

  const groupedData = useMemo(() => {
    return data.reduce((acc, point) => {
      if (!acc[point.label]) {
        acc[point.label] = [];
      }
      acc[point.label].push(point);
      return acc;
    }, {} as Record<string, DataPoint[]>);
  }, [data]);

  const chartData: ChartData<'scatter'> = useMemo(() => ({
    datasets: Object.entries(groupedData).map(([label, points]) => ({
      label,
      data: points.map(p => ({
        x: p.x,
        y: p.y,
        id: p.id,
      })),
      backgroundColor: labelColors[label] || 'rgba(0, 0, 0, 0.6)',
      pointBackgroundColor: points.map(p =>
        selectedPoints.includes(p.id)
          ? 'rgba(255, 255, 255, 0.8)'
          : labelColors[label] || 'rgba(0, 0, 0, 0.6)'
      ),
      borderColor: labelColors[label] || 'rgba(0, 0, 0, 0.6)',
      pointRadius: 8,
      pointHoverRadius: 10,
    })),
  }), [groupedData, selectedPoints]);

  const options: ChartOptions<'scatter'> = useMemo(() => ({
    animation: { duration: 0 },
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: `Feature ${selectedIndices.x}`,
          color: '#000',
          font: {
            size: 14,
            weight: 'bold',
          },
          padding: { top: 10, bottom: 0 }
        }
      },
      y: {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: `Feature ${selectedIndices.y}`,
          color: '#000',
          font: {
            size: 14,
            weight: 'bold',
          },
          padding: { top: 0, bottom: 10 }
        }
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
            enabled: false
          },
          mode: 'xy',
        },
      },
      tooltip: {
        enabled: (ctx: ScriptableTooltipContext<'scatter'>) => {
          const chart = ctx.chart as CustomChart;
          return !chart.dragStatus?.isDragging;
        },
        callbacks: {
          label: (context: TooltipItem<'scatter'>) => {
            const point = data.find(p =>
              p.x === context.parsed.x && p.y === context.parsed.y
            );
            return `ID: ${point?.id}, Label: ${point?.label}`;
          },
        },
      },
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          generateLabels: (chart: Chart) => {
            const datasets = chart.data.datasets;
            return datasets.map((dataset, index) => ({
              text: dataset.label || '',
              fillStyle: dataset.backgroundColor as string,
              strokeStyle: dataset.borderColor as string,
              lineWidth: 2,
              hidden: !chart.isDatasetVisible(index),
            }));
          }
        }
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove', 'mousedown', 'mouseup'],
    hover: {
      mode: 'nearest',
      intersect: true
    },
    interaction: {
      mode: 'nearest',
      intersect: true
    }
  }), [selectedIndices, data]);

  useEffect(() => {
    const chart = chartRef.current;
    if (chart) {
      const zoomState = {
        x: chart.scales.x.options.min !== undefined ? {
          min: chart.scales.x.options.min,
          max: chart.scales.x.options.max
        } : null,
        y: chart.scales.y.options.min !== undefined ? {
          min: chart.scales.y.options.min,
          max: chart.scales.y.options.max
        } : null
      };

      if (zoomState.x) {
        chart.scales.x.options.min = zoomState.x.min;
        chart.scales.x.options.max = zoomState.x.max;
      }
      if (zoomState.y) {
        chart.scales.y.options.min = zoomState.y.min;
        chart.scales.y.options.max = zoomState.y.max;
      }
      chart.update('none');
    }
  }, [data, selectedIndices]);

  useEffect(() => {
    const dragSelectPlugin = {
      id: 'dragSelect',
      beforeEvent: function(chart: CustomChart, args: { event: { type: string; x: number; y: number; }}) {
        const event = args.event;
        if (event.type === 'mousedown') {
          setDragStart({ x: event.x, y: event.y });
          setIsDragging(true);
          chart.dragStatus = { isDragging: true };
          chart.options.hover = { mode: undefined };
          chart.options.interaction = { mode: undefined };
        }

        if (event.type === 'mousemove' && isDragging && dragStart) {
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }

          animationFrameRef.current = requestAnimationFrame(() => {
            const canvas = chart.canvas;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            chart.draw();
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = 'rgba(0, 123, 255, 0.2)';
            ctx.strokeStyle = 'rgba(0, 123, 255, 0.8)';
            ctx.lineWidth = 1;

            const rect = {
              x: Math.min(dragStart.x, event.x),
              y: Math.min(dragStart.y, event.y),
              width: Math.abs(event.x - dragStart.x),
              height: Math.abs(event.y - dragStart.y)
            };

            ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
            ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
            ctx.restore();
          });
        }

        if (event.type === 'mouseup' && isDragging && dragStart) {
          const xScale = chart.scales.x;
          const yScale = chart.scales.y;
          
          if (!xScale || !yScale) return;
          
          const startDataX = xScale.getValueForPixel(dragStart.x);
          const endDataX = xScale.getValueForPixel(event.x);
          const startDataY = yScale.getValueForPixel(dragStart.y);
          const endDataY = yScale.getValueForPixel(event.y);

          if (startDataX === undefined || endDataX === undefined || 
              startDataY === undefined || endDataY === undefined) return;

          const newSelectedPoints = data
            .filter(point =>
              point.x >= Math.min(startDataX, endDataX) &&
              point.x <= Math.max(startDataX, endDataX) &&
              point.y >= Math.min(startDataY, endDataY) &&
              point.y <= Math.max(startDataY, endDataY)
            )
            .map(p => p.id);

          setSelectedPoints(newSelectedPoints);
          onSelectPoints?.(newSelectedPoints);
          setIsDragging(false);
          setDragStart(null);
          chart.dragStatus = { isDragging: false };
          chart.options.hover = { mode: 'point' };
          chart.options.interaction = { mode: 'point' };

          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }
          chart.draw();
        }
      }
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
    <div className='relative w-full h-full'>
      <div className="relative" style={{ width: '100%', height: '100%' }}>
        <Scatter ref={chartRef} data={chartData} options={options} />
      </div>
      <button
        className="absolute top-[1rem] right-[1rem] px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        onClick={() => {
          setSelectedPoints([]);
          onSelectPoints?.([]);
          if (chartRef.current) {
            chartRef.current.resetZoom();
          }
        }}
      >
        Clear
      </button>
    </div>
  );
};

export default ScatterPlot;