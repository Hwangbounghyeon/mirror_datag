import { StepProps } from "@/types/projectType";
import { DepartmentType } from "@/types/departmentType";
import { SearchUserType } from "@/types/projectType";

import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Pagination,
  Select,
  SelectItem,
  Spinner,
  Button,
} from "@nextui-org/react";
import { getDepartments } from "@/app/actions/depatment";
import { getUsers } from "@/app/actions/user";
import { ProjectAuthType } from "@/types/projectType";

type AuthorizedDepartmentType = DepartmentType & {
  Auth: ProjectAuthType;
};

type AuthroizedUserType = SearchUserType & {
  Auth: ProjectAuthType;
};

export default function DepartmentSearch({
  handleMove,
  projectItem,
  setProjectItem,
}: StepProps) {
  const [department_list, setDepartment_list] = useState<
    AuthorizedDepartmentType[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  // 부서 전용 권한 변경
  const handleAuthChange = (departmentId: number, newAuth: ProjectAuthType) => {
    setDepartment_list((prevList) =>
      prevList.map((dept) =>
        dept.department_id === departmentId ? { ...dept, Auth: newAuth } : dept
      )
    );
  };

  return (
    <div className="max-w-[700px] w-full flex flex-col items-center justify-center">
      <h1 className="text-[20px] mb-3">
        추가적으로 프로젝트에 접근 허용할 대상을 골라 주세요.
      </h1>

      <section className="w-full flex flex-col">
        <h3 className="text-[14px] text-center">부서 목록</h3>
        <Table
          aria-label="Controlled department table"
          classNames={{
            wrapper: "max-h-[350px] w-full",
          }}
        >
          <TableHeader>
            <TableColumn>부서명</TableColumn>
            <TableColumn>권한</TableColumn>
          </TableHeader>

          <TableBody
            loadingContent={<Spinner />}
            isLoading={isLoading}
            emptyContent={"부서 목록이 비어있습니다."}
          >
            {department_list.map((department) => (
              <TableRow key={department.department_id}>
                <TableCell>{department.department_name}</TableCell>
                <TableCell width={"200px"}>
                  <Select
                    label="권한 선택"
                    selectedKeys={[department.Auth]}
                    className="max-w-xs"
                    onChange={(e) => {
                      handleAuthChange(
                        department.department_id,
                        e.target.value as ProjectAuthType
                      );
                    }}
                  >
                    <SelectItem key="ReadOnly" value="ReadOnly">
                      읽기 전용
                    </SelectItem>
                    <SelectItem key="Read&Write" value="Read&Write">
                      읽기/쓰기
                    </SelectItem>
                    <SelectItem key="None" value="None">
                      권한 없음
                    </SelectItem>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
      <section className="w-full flex flex-col">
        <h3 className="text-[14px] text-center">인원 목록</h3>
        <Table
          aria-label="Controlled User table"
          classNames={{
            base: "w-full",
            table: "w-full",
            wrapper: "max-h-[350px] w-full",
          }}
        >
          <TableHeader>
            <TableColumn>유저명</TableColumn>
            <TableColumn>유저이메일</TableColumn>
            <TableColumn>권한</TableColumn>
          </TableHeader>

          <TableBody
            loadingContent={<Spinner />}
            isLoading={isLoading}
            emptyContent={"부서 목록이 비어있습니다."}
          >
            {department_list.map((department) => (
              <TableRow key={department.department_id}>
                <TableCell>{department.department_name}</TableCell>
                <TableCell width={"200px"}>
                  <Select
                    label="권한 선택"
                    selectedKeys={[department.Auth]}
                    className="max-w-xs"
                    onChange={(e) => {
                      handleAuthChange(
                        department.department_id,
                        e.target.value as ProjectAuthType
                      );
                    }}
                  >
                    <SelectItem key="ReadOnly" value="ReadOnly">
                      읽기 전용
                    </SelectItem>
                    <SelectItem key="Read&Write" value="Read&Write">
                      읽기/쓰기
                    </SelectItem>
                    <SelectItem key="None" value="None">
                      권한 없음
                    </SelectItem>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}
