import { Department } from "@/types/auth";
import { useMemo, useState } from "react";
import { DEPARTMENTS } from "../../../lib/constants/mockData";
import { Input, Listbox, ListboxItem } from "@nextui-org/react";

interface DepartmentSelectProps {
    departmentSearch: string;
    selectedDepartment: Department | null;
    onSearchChange: (value: string) => void;
    onSelect: (dept: Department) => void;
}

export function DepartmentSelect({
    departmentSearch,
    selectedDepartment,
    onSearchChange,
    onSelect,
}: DepartmentSelectProps) {
    const [isFocused, setIsFocused] = useState(false);

    const filteredDepartments = useMemo(() => {
        if (
            selectedDepartment &&
            departmentSearch === selectedDepartment.department_name
        ) {
            return [];
        }

        if (!isFocused) {
            return [];
        }

        if (!departmentSearch) {
            return DEPARTMENTS;
        }

        return DEPARTMENTS.filter((dept) =>
            dept.department_name
                .toLowerCase()
                .includes(departmentSearch.toLowerCase())
        );
    }, [departmentSearch, selectedDepartment, isFocused]);

    return (
        <div className="relative">
            <Input
                label="Department"
                value={departmentSearch}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search department..."
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                    setTimeout(() => setIsFocused(false), 200);
                }}
            />
            {isFocused && filteredDepartments.length > 0 && (
                <div className="absolute z-30 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-auto">
                    <Listbox>
                        {filteredDepartments.map((dept) => (
                            <ListboxItem
                                key={dept.department_id}
                                onClick={() => onSelect(dept)}
                            >
                                {dept.department_name}
                            </ListboxItem>
                        ))}
                    </Listbox>
                </div>
            )}
        </div>
    );
}
