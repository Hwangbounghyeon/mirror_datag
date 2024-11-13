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

export type ProjectRequest = {
  page: string;
  limit: string;
  model_name?: string;
}

// 실제 이용할 때는 아래와 같이 사용
export type ProjectType = {
  project_id: number;
  project_name: string;
  task: string;
  model_name: string;
  description: string;
  user_id: number; // 생성한 사람 이름
  department: string; // 생성한 사람의 부서 이름
  is_private: boolean; // 0 : 공개, 1 : 비공개
  is_editor: boolean;
  is_creator: boolean;
  created_at: string;
  updated_at: string;
};

export interface StepProps {
  projectItem: CreateProjectType;
  setProjectItem: (updates: Partial<CreateProjectType>) => void;
  handleMove: (step: number) => void;
  category?: string; // Step1에만 필요
  setCategory?: (category: string) => void; // Step1에만 필요
}
