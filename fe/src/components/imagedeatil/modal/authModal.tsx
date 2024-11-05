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
import { Authority } from "@/types/auth";
import { DEPARTMENTS } from "@/lib/constants/mockData";
import { useAuthoritySelect } from "@/hooks/imageDetail/useAuthoritySelect";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (userIds: number[]) => void;
    existingAuthorities: Authority[];
}

export default function AuthModal({
    isOpen,
    onClose,
    onAdd,
    existingAuthorities,
}: AuthModalProps) {
    const {
        selectedDepartment,
        selectedPeople,
        availableUsers,
        handleDepartmentSelect,
        handlePeopleSelect,
        handleRemovePerson,
        reset,
    } = useAuthoritySelect(existingAuthorities);

    const handleConfirm = () => {
        const userIds = selectedPeople.map((person) => person.id);
        onAdd(userIds);
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
                                <Select
                                    label="Department"
                                    placeholder="Select a department"
                                    selectedKeys={
                                        selectedDepartment
                                            ? [selectedDepartment.toString()]
                                            : []
                                    }
                                    onChange={(e) =>
                                        handleDepartmentSelect(e.target.value)
                                    }
                                >
                                    {DEPARTMENTS.map((dept) => (
                                        <SelectItem key={dept.department_name}>
                                            {dept.department_name}
                                        </SelectItem>
                                    ))}
                                </Select>

                                {selectedDepartment && (
                                    <Select
                                        label="People"
                                        placeholder="Select people"
                                        selectionMode="multiple"
                                        selectedKeys={selectedPeople
                                            .filter(
                                                (p) =>
                                                    p.department ===
                                                    selectedDepartment
                                            )
                                            .map((p) => p.id.toString())}
                                        onChange={(e) =>
                                            handlePeopleSelect(
                                                Array.from(e.target.value)
                                            )
                                        }
                                    >
                                        {availableUsers.map((user) => (
                                            <SelectItem
                                                key={user.user_id.toString()}
                                            >
                                                {user.name}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                )}

                                {selectedPeople.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {selectedPeople.map((person) => (
                                            <Chip
                                                key={person.id}
                                                onClose={() =>
                                                    handleRemovePerson(
                                                        person.id
                                                    )
                                                }
                                                variant="flat"
                                                color="primary"
                                            >
                                                {person.name} /{" "}
                                                {person.department}
                                            </Chip>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="danger"
                                variant="light"
                                onPress={handleCancel}
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
