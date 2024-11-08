export type CreateProjectType = {
  project_name: string;
  project_model_name: string;
  description: string;
  accesscontrol: {
    view_users: string[];
    edit_users: string[];
    view_departments: string[];
    edit_departments: string[];
  };
  is_private: boolean;
};

// 실제 이용할 때는 아래와 같이 사용
export type ProjectType = {
  project_id: number;
  project_name: string;
  model_name: string;
  description: string;
  user_id: string; // 생성한 사람 이름
  department: string; // 생성한 사람의 부서 이름
  is_private: boolean; // 0 : 공개, 1 : 비공개
  created_at: string;
  updated_at: string;
};

export interface StepProps {
  handleMove?: (stepNumber: number) => void;
  projectItem: CreateProjectType;
  setProjectItem: React.Dispatch<React.SetStateAction<CreateProjectType>>;
}
