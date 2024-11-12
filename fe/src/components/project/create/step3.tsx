import { StepProps } from "@/types/projectType";

import { AppDispatch, RootState } from "@/store/store";
import {
  updateDepartmentAuth,
  updateUserAuth,
  removeUser,
  removeDepartment,
} from "@/store/create-store";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Spinner,
} from "@nextui-org/react";
import AddAuthUser from "./add-auth-user";
import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import AddAuthDeps from "./add-auth-deps";

export default function Step3({ handleMove }: StepProps) {
  const dispatch = useDispatch<AppDispatch>();
  const addedAuthUsers = useSelector(
    (state: RootState) => state.project.accesscontrol.users
  );
  const addedAuthDeps = useSelector(
    (state: RootState) => state.project.accesscontrol.departments
  );

  const [isOpenUserModal, setIsOpenUserModal] = useState(false);
  const [isOpenDepModal, setIsOpenDepModal] = useState(false);

  return (
    <div className="max-w-[700px] w-full flex flex-col items-center justify-center">
      <header>
        <h1 className="text-[20px] mb-3">
          추가적으로 프로젝트에 접근 허용할 대상을 골라 주세요.
        </h1>
        <div className="w-full flex flex-row justify-evenly flex-wrap">
          <Button onClick={() => setIsOpenUserModal(true)}>인원 추가</Button>
          <Button onClick={() => setIsOpenDepModal(true)}>부서 추가</Button>
        </div>
      </header>

      <section className="w-full flex flex-col">
        <h3 className="text-[14px] text-center">부서 목록</h3>
        <Table
          classNames={{
            base: "min-w-[400px] h-[300px] ",
          }}
          selectionMode="none"
          aria-label=" 선택된 사용자 목록"
        >
          <TableHeader>
            <TableColumn>부서 이름</TableColumn>
            <TableColumn>권한</TableColumn>
          </TableHeader>
          <TableBody
            loadingContent={
              <div className="w-full h-full flex flex-row justify-center items-center bg-slate-600 opacity-50">
                <Spinner size="lg" />
              </div>
            }
            emptyContent="등록된 부서가 없습니다."
          >
            {Object.values(addedAuthDeps).map((department) => (
              <TableRow key={department.department_id}>
                <TableCell>{department.department_name}</TableCell>
                <TableCell>
                  <Dropdown>
                    <DropdownTrigger className="cursor-pointer">
                      {department.Auth}
                    </DropdownTrigger>
                    <DropdownMenu>
                      <DropdownItem
                        onPress={() => {
                          if (department.Auth !== "Read&Write") {
                            dispatch(
                              updateDepartmentAuth({
                                departmentId: department.department_id,
                                auth: "Read&Write",
                              })
                            );
                          }
                        }}
                        key="change WR"
                      >
                        권환을 W/R로 변경
                      </DropdownItem>
                      <DropdownItem
                        onPress={() => {
                          if (department.Auth !== "Read&Write") {
                            dispatch(
                              updateDepartmentAuth({
                                departmentId: department.department_id,
                                auth: "Read&Write",
                              })
                            );
                          }
                        }}
                        key="change RO"
                      >
                        권환을 RO로 변경
                      </DropdownItem>
                      <DropdownItem
                        onPress={() => {
                          dispatch(removeDepartment(department.department_id));
                        }}
                        key="delete"
                      >
                        목록 삭제
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
      <section className="w-full flex flex-col">
        <h3 className="text-[14px] text-center">인원 목록</h3>
        <Table
          classNames={{
            base: "min-w-[400px] h-[300px] ",
          }}
          selectionMode="none"
          aria-label=" 선택된 사용자 목록"
        >
          <TableHeader>
            <TableColumn>유저 이름</TableColumn>
            <TableColumn>이메일</TableColumn>
            <TableColumn>권한</TableColumn>
          </TableHeader>
          <TableBody
            loadingContent={
              <div className="w-full h-full flex flex-row justify-center items-center bg-slate-600 opacity-50">
                <Spinner size="lg" />
              </div>
            }
            emptyContent="등록된 인원이 없습니다."
          >
            {Object.values(addedAuthUsers).map((user) => (
              <TableRow key={user.user_id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Dropdown>
                    <DropdownTrigger className="cursor-pointer">
                      {user.Auth}
                    </DropdownTrigger>
                    <DropdownMenu>
                      <DropdownItem
                        onPress={() => {
                          if (user.Auth !== "Read&Write") {
                            dispatch(
                              updateUserAuth({
                                userId: user.user_id,
                                auth: "Read&Write",
                              })
                            );
                          }
                        }}
                        key="change WR"
                      >
                        권환을 W/R로 변경
                      </DropdownItem>
                      <DropdownItem
                        onPress={() => {
                          if (user.Auth !== "ReadOnly") {
                            dispatch(
                              updateUserAuth({
                                userId: user.user_id,
                                auth: "ReadOnly",
                              })
                            );
                          }
                        }}
                        key="change RO"
                      >
                        권환을 RO로 변경
                      </DropdownItem>
                      <DropdownItem
                        onPress={() => {
                          dispatch(removeUser(user.user_id));
                        }}
                        key="delete"
                      >
                        목록 삭제
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
      <AddAuthUser
        isOpen={isOpenUserModal}
        onClose={() => setIsOpenUserModal(false)}
      />
      <AddAuthDeps
        isOpen={isOpenDepModal}
        onClose={() => setIsOpenDepModal(false)}
      />
    </div>
  );
}
