import { DepartmentType } from "@/types/departmentType";
import { delay } from "@/utils/delay";
export const getDepartments = async (): Promise<DepartmentType[]> => {
  await delay(1000);
  return [
    { department_id: 1, department_name: "HR" },
    { department_id: 2, department_name: "Finance" },
    { department_id: 3, department_name: "Engineering" },
    { department_id: 4, department_name: "Marketing" },
    { department_id: 5, department_name: "Sales" },
    { department_id: 6, department_name: "IT" },
    { department_id: 7, department_name: "Customer Service" },
    { department_id: 8, department_name: "Legal" },
    { department_id: 9, department_name: "Operations" },
    { department_id: 10, department_name: "R&D" },
  ];
};
