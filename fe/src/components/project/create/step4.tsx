// components/DepartmentSearch.tsx

import { StepProps } from "@/types/projectType";
import { use, useEffect, useState } from "react";
import { getDepartments } from "@/lib/constants/department";
import { DepartmentType } from "@/types/departmentType";
import { UserType } from "@/types/auth";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/react";

type AuthorizedDepartmentType = DepartmentType & {
  Auth: "ReadOnly" | "Read&Write";
};
type AuthroizedUserType = UserType & {
  Auth: "ReadOnly" | "Read&Write" | "None";
};

const rowsPerPage = 5; // 한 페이지에 보여질 row 수

const columns = [
  { key: "department_name", label: "부서명" },
  {
    key: "Auth",
    label: "권한",
  },
];

export default function DepartmentSearch({
  handleMove,
  projectItem,
  setProjectItem,
}: StepProps) {
  const [selectedDepartments, setSelectedDepartments] = useState<
    AuthorizedDepartmentType[]
  >([]); // 선택된 부서

  const [selectedUsers, setSelectedUsers] = useState<AuthroizedUserType[]>([]); // 선택된 유저

  const [dpages, setDpages] = useState<number>(1); // 페이지 수

  // Department Pagination Total 수
  useEffect(() => {
    setDpages(Math.ceil(selectedDepartments.length / rowsPerPage));
  }, [selectedDepartments]);

  return (
    <div className="max-w-[700px] w-full flex flex-col items-center justify-center">
      <h1 className="text-[20px] mb-3">
        추가적으로 프로젝트에 접근 허용할 대상을 골라 주세요.
      </h1>
      <section className="w-full flex flex-col">
        <h3 className="text-[14px]">부서 목록</h3>
        <Table></Table>
      </section>
    </div>
  );
}
