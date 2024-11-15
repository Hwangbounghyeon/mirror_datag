'use client'

import { useEffect, useMemo, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Card } from "@nextui-org/card";
import { ObjectDetectionLabels, ReductionResults } from '@/types/historyType';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: ReductionResults[] | undefined;
  selectedIndex: number | null;
  setSelectedIndex: (n: number | null) => void;
  onDataSelect?: (points: ReductionResults[]) => void;
}

const PieChart = ({ data, selectedIndex, setSelectedIndex, onDataSelect }: PieChartProps) => {
  // const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!data) return;

  // 타입 가드
  const isObjectDetectionLabels = (
    label: ObjectDetectionLabels | string | undefined
  ): label is ObjectDetectionLabels => {
    return typeof label === 'object' && label !== null && 'label' in label && 'bbox' in label;
  };

  const filteredData = useMemo(() => {
    const matching = data.filter(item => 
      item.predictions?.prediction && 
      isObjectDetectionLabels(item.label) &&
      item.predictions.prediction === item.label.label
    );
    
    const mismatch = data.filter(item => 
      item.predictions?.prediction && 
      isObjectDetectionLabels(item.label) &&
      item.predictions.prediction !== item.label.label
    );
    
    const labelOnly = data.filter(item => 
      !item.predictions?.prediction && 
      isObjectDetectionLabels(item.label)
    );

    return { matching, mismatch, labelOnly };
  }, [data]);

  const chartData = useMemo(() => {
    const { matching, mismatch, labelOnly } = filteredData;
  
    return {
      labels: ['Matching Predictions', 'Mismatching Predictions', 'Label Only'],
      datasets: [{
        data: [matching.length, mismatch.length, labelOnly.length],
        backgroundColor: [
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(255, 206, 86, 0.8)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: [
          selectedIndex === 0 ? 5 : 0,
          selectedIndex === 1 ? 5 : 0,
          selectedIndex === 2 ? 5 : 0
        ],
        hoverBorderWidth: 10,
        offset: [
          selectedIndex === 0 ? 10 : 0,
          selectedIndex === 1 ? 10 : 0,
          selectedIndex === 2 ? 10 : 0
        ],
        hoverOffset: 10
      }],
    };
  }, [filteredData, selectedIndex]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 12
          },
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((acc: number, curr: number) => acc + curr, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    onClick: (event: any, elements: any[]) => {
      if (elements.length > 0) {
        const { matching, mismatch, labelOnly } = filteredData;
        const index = elements[0].index;
        
        console.log(index)

        // 이미 선택된 섹션을 다시 클릭하면 선택 해제
        if (selectedIndex === index) {
          setSelectedIndex(null);
          onDataSelect?.([]);
          return;
        }

        setSelectedIndex(index);
        
        // 클릭된 섹션에 따라 해당하는 데이터 선택
        switch(index) {
          case 0:
            onDataSelect?.(matching);
            break;
          case 1:
            onDataSelect?.(mismatch);
            break;
          case 2:
            onDataSelect?.(labelOnly);
            break;
        }
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true
    }
  };

  return (
    <Card className="w-full h-full p-6 bg-white shadow-md">
      <div className="h-full">
        <Pie data={chartData} options={options} />
      </div>
    </Card>
  );
};

export default PieChart;