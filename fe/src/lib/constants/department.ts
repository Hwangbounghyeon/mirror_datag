import { DepartmentType } from "@/types/departmentType";

export const getDepartments = (): DepartmentType[] => {
  return [
    {
      department_id: 1,
      department_name: "AI연구소",
    },
    {
      department_id: 2,
      department_name: "비전팀",
    },
    {
      department_id: 3,
      department_name: "의료AI팀",
    },
    {
      department_id: 4,
      department_name: "보안팀",
    },
    {
      department_id: 5,
      department_name: "데이터팀",
    },
  ];
};
