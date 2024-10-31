import { useState } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "@nextui-org/react";
import { DepartmentSelect } from "./departmentSelect";
import { PersonSelect } from "./personSelect";
import { SelectedPeople } from "./selectedPerson";
import { Authority, Department, User } from "@/types/auth";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (authorities: Authority[]) => void;
    existingAuthorities: Authority[];
}

export default function AuthModal({
    isOpen,
    onClose,
    onAdd,
    existingAuthorities,
}: AuthModalProps) {
    const [departmentSearch, setDepartmentSearch] = useState("");
    const [selectedDepartment, setSelectedDepartment] =
        useState<Department | null>(null);
    const [personSearch, setPersonSearch] = useState("");
    const [selectedPeople, setSelectedPeople] = useState<Authority[]>([]);

    const handleDepartmentSelect = (dept: Department) => {
        setSelectedDepartment(dept);
        setDepartmentSearch(dept.department_name);
        setPersonSearch("");
    };

    const handlePersonSelect = (user: User) => {
        if (!selectedDepartment) return;
        const newAuthority: Authority = {
            id: user.user_id,
            name: user.nickname,
            department: selectedDepartment.department_name,
        };
        setSelectedPeople([...selectedPeople, newAuthority]);
        setPersonSearch("");
    };

    const handleRemovePerson = (id: number) => {
        setSelectedPeople(selectedPeople.filter((p) => p.id !== id));
    };

    const handleConfirm = () => {
        onAdd(selectedPeople);
        setSelectedPeople([]);
        setSelectedDepartment(null);
        setDepartmentSearch("");
        setPersonSearch("");
        onClose();
    };

    return (
        <Modal
            size={"4xl"}
            isOpen={isOpen}
            onClose={onClose}
            classNames={{
                base: "min-h-[50%]",
                wrapper: "min-h-[50%]",
                body: "flex-grow",
            }}
        >
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader>Add Authority</ModalHeader>
                        <ModalBody>
                            <div className="space-y-4">
                                <DepartmentSelect
                                    departmentSearch={departmentSearch}
                                    selectedDepartment={selectedDepartment}
                                    onSearchChange={setDepartmentSearch}
                                    onSelect={handleDepartmentSelect}
                                />
                                {selectedDepartment && (
                                    <PersonSelect
                                        selectedDepartment={selectedDepartment}
                                        personSearch={personSearch}
                                        onSearchChange={setPersonSearch}
                                        onSelect={handlePersonSelect}
                                        selectedPeople={selectedPeople}
                                        existingAuthorities={
                                            existingAuthorities
                                        }
                                    />
                                )}
                                <SelectedPeople
                                    people={selectedPeople}
                                    onRemove={handleRemovePerson}
                                />
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="danger"
                                variant="light"
                                onPress={onClose}
                            >
                                Close
                            </Button>
                            <Button
                                color="primary"
                                onPress={handleConfirm}
                                isDisabled={selectedPeople.length === 0}
                            >
                                Add
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
