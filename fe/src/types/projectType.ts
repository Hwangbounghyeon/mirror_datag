export type categoryType = "object-detection" | "image-classification" | null;
export type modelType = "yolo_v5" | "yolo_v8" | "yolo_v11" | null;

export type CreateProjectType = {
  category: categoryType;
  model_name: modelType;
  project_name: string; // Project name
  description: string; // Project description
  additional_permission: number[]; // 부서 추가 권한
  is_private: boolean; // 비공개 여부
};

export type ProjectType = {
  project_id: number;
  user_id: number;
  project_name: string;
  description: string;
  model_name: string;
  is_private: boolean;
  permission_id: string;
  created_at: string;
  updated_at: string;
};

export interface StepProps {
  handleMove?: (stepNumber: number) => void;
  projectItem: CreateProjectType;
  setProjectItem: React.Dispatch<React.SetStateAction<CreateProjectType>>;
}
