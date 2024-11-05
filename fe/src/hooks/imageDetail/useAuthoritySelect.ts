import { useState } from "react";
import { Authority } from "@/types/auth";
import { DEPARTMENTS, USERS } from "@/lib/constants/mockData";

export function useAuthoritySelect(existingAuthorities: Authority[]) {
    const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
        null
    );
    const [selectedPeople, setSelectedPeople] = useState<Authority[]>([]);

    const handleDepartmentSelect = (deptId: string) => {
        const dept = DEPARTMENTS.find(
            (d) => d.department_name.toString() === deptId
        );
        if (dept) setSelectedDepartment(dept.department_name);
    };

    const handlePeopleSelect = (selectedIds: string[]) => {
        if (!selectedDepartment) return;

        const currentDeptPeople = selectedIds
            .map((id) => {
                const user = availableUsers.find(
                    (u) => u.uid.toString() === id
                );
                if (!user) return null;
                return {
                    id: user.uid,
                    name: user.name,
                    department: selectedDepartment,
                };
            })
            .filter((auth): auth is Authority => auth !== null);

        const otherDeptPeople = selectedPeople.filter(
            (p) => p.department !== selectedDepartment
        );

        setSelectedPeople([...otherDeptPeople, ...currentDeptPeople]);
    };

    const handleRemovePerson = (id: number) => {
        setSelectedPeople(selectedPeople.filter((p) => p.id !== id));
    };

    const availableUsers = selectedDepartment
        ? USERS.filter(
              (user) =>
                  user.department_name === selectedDepartment &&
                  !existingAuthorities.some((auth) => auth.id === user.uid)
          )
        : [];

    const reset = () => {
        setSelectedPeople([]);
        setSelectedDepartment(null);
    };

    return {
        selectedDepartment,
        selectedPeople,
        availableUsers,
        handleDepartmentSelect,
        handlePeopleSelect,
        handleRemovePerson,
        reset,
    };
}
