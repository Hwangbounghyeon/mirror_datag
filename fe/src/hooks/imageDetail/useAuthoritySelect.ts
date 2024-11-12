import { useEffect, useState } from "react";
import { departmentApi } from "@/api/detail/departmentUser";
import { DepartmentType } from "@/types/departmentType";
import { AuthUser } from "@/types/auth";

export function useAuthoritySelect() {
    const [departments, setDepartments] = useState<DepartmentType[]>([]);
    const [selectedDepartments, setSelectedDepartments] = useState<string[]>(
        []
    );
    const [selectedDepartment, setSelectedDepartment] = useState<string>("");
    const [users, setUsers] = useState<AuthUser[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const departmentList = await departmentApi();
                setDepartments(departmentList);
            } catch (error) {
                console.error("Failed to fetch departments:", error);
                setDepartments([]);
            }
        };
        fetchDepartments();
    }, []);

    const handleDepartmentSelect = (deptNames: string[]) => {
        setSelectedDepartments(deptNames);
    };

    const handleRemoveDepartment = (deptName: string) => {
        setSelectedDepartments(
            selectedDepartments.filter((name) => name !== deptName)
        );
    };

    const handleSingleDepartmentSelect = async (deptName: string) => {
        setSelectedDepartment(deptName);
        try {
            // const departmentUsers = await getUsersByDepartment(deptName);
            // setUsers(departmentUsers);
            // TODO 추후에 선택한 부서에 속한 유저리스트 뽑아오도록 수정
        } catch (error) {
            console.error("Failed to fetch users:", error);
            setUsers([]);
        }
    };

    const handleUserSelect = (userIds: number[]) => {
        setSelectedUsers(userIds);
    };

    const handleRemoveUser = (userId: number) => {
        setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    };

    const reset = () => {
        setSelectedDepartments([]);
        setSelectedDepartment("");
        setSelectedUsers([]);
    };

    return {
        departments,
        selectedDepartments,
        handleDepartmentSelect,
        handleRemoveDepartment,
        reset,
        selectedDepartment,
        users,
        selectedUsers,
        handleSingleDepartmentSelect,
        handleUserSelect,
        handleRemoveUser,
    };
}
