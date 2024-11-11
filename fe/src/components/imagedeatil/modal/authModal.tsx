import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Select,
    SelectItem,
    Chip,
} from "@nextui-org/react";
import { useAuthoritySelect } from "@/hooks/imageDetail/useAuthoritySelect";
import { AuthUser } from "@/types/auth";
import { Suspense } from "react";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (departmentName: string[]) => void;
    existingAuthorities: AuthUser[];
}

export default function AuthModal({ isOpen, onClose, onAdd }: AuthModalProps) {
    const {
        departments,
        selectedDepartments,
        handleDepartmentSelect,
        handleRemoveDepartment,
        reset,
    } = useAuthoritySelect();

    const handleConfirm = () => {
        onAdd(selectedDepartments);
        reset();
        onClose();
    };

    const handleCancel = () => {
        reset();
        onClose();
    };

    return (
        <Modal
            size={"4xl"}
            isOpen={isOpen}
            onClose={handleCancel}
            classNames={{
                base: "min-h-[30%]",
                wrapper: "min-h-[30%]",
                body: "flex-grow",
            }}
        >
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader>Add Authority</ModalHeader>
                        <ModalBody>
                            <div className="space-y-4">
                                <Suspense
                                    fallback={
                                        <div className="flex items-center justify-center">
                                            <div>Loading departments...</div>
                                        </div>
                                    }
                                >
                                    {Array.isArray(departments) &&
                                    departments.length > 0 ? (
                                        <Select
                                            label="Department"
                                            placeholder="Select departments"
                                            selectionMode="multiple"
                                            selectedKeys={selectedDepartments}
                                            onSelectionChange={(keys) => {
                                                const selectedValues =
                                                    Array.from(
                                                        keys as Set<string>
                                                    );
                                                handleDepartmentSelect(
                                                    selectedValues
                                                );
                                            }}
                                        >
                                            {departments.map((dept) => {
                                                return (
                                                    <SelectItem
                                                        key={
                                                            dept.department_name
                                                        }
                                                        value={
                                                            dept.department_name
                                                        }
                                                    >
                                                        {dept.department_name}
                                                    </SelectItem>
                                                );
                                            })}
                                        </Select>
                                    ) : (
                                        <div>No departments available</div>
                                    )}
                                </Suspense>

                                {selectedDepartments.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {selectedDepartments.map((deptName) => (
                                            <Chip
                                                key={deptName}
                                                onClose={() =>
                                                    handleRemoveDepartment(
                                                        deptName
                                                    )
                                                }
                                                variant="flat"
                                            >
                                                {deptName}
                                            </Chip>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" onPress={handleCancel}>
                                Close
                            </Button>
                            <Button
                                color="primary"
                                onPress={handleConfirm}
                                isDisabled={selectedDepartments.length === 0}
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
