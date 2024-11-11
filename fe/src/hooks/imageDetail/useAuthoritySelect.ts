import { useEffect, useState } from "react";
import { departmentApi } from "@/api/detail/departmentUser";
import { DepartmentType } from "@/types/departmentType";

export function useAuthoritySelect() {
    const [departments, setDepartments] = useState<DepartmentType[]>([]);
    const [selectedDepartments, setSelectedDepartments] = useState<string[]>(
        []
    );

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

    const reset = () => {
        setSelectedDepartments([]);
    };

    return {
        departments,
        selectedDepartments,
        handleDepartmentSelect,
        handleRemoveDepartment,
        reset,
    };
}
