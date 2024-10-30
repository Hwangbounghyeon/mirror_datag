export type categoryType = "object-detection" | "image-classification" | null;
export type modelType = "yolo_v5" | "yolo_v8" | "yolo_v11" | null;

export type ProjectType = {
  category: categoryType;
  model: modelType;
  name: string; // Project name
  description: string; // Project description
  additional_permission: number[]; // 부서 추가 권한
};

export interface StepProps {
  handleMove?: (stepNumber: number) => void;
  projectItem: ProjectType;
  setProjectItem: React.Dispatch<React.SetStateAction<ProjectType>>;
}
