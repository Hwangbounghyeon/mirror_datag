export type CreateProjectType = {
  category: string | null;
  model_name: string | null;
  project_name: string; // Project name
  description: string; // Project description
  additional_permission: number[]; // 부서 추가 권한
  is_private: boolean; // 비공개 여부
};

// 실제 이용할 때는 아래와 같이 사용
export type ProjectType = {
  project_id: number;
  project_name: string;
  model_name: string;
  description: string;
  user_name: string; // 생성한 사람 이름
  department_name: string; // 생성한 사람의 부서 이름
  is_private: number; // 0 : 공개, 1 : 비공개
  created_at: string;
  updated_at: string;
  data_count: number;
};

export interface StepProps {
  handleMove?: (stepNumber: number) => void;
  projectItem: CreateProjectType;
  setProjectItem: React.Dispatch<React.SetStateAction<CreateProjectType>>;
}
