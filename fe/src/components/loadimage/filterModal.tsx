import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react";
import FilterComponent from "./filterBox";

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDone: () => void;
}

export const FilterModal = ({ isOpen, onClose, onDone }: FilterModalProps) => {
    return (
        <Modal
            size="3xl"
            isOpen={isOpen}
            onClose={onClose}
            classNames={{
                base: "bg-content1",
                body: "py-6",
                wrapper: "z-[100]",
            }}
        >
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader className="flex justify-between items-center">
                            <span className="text-lg font-semibold">
                                필터 설정
                            </span>
                        </ModalHeader>

                        <ModalBody>
                            <FilterComponent onDone={onDone} />
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};
