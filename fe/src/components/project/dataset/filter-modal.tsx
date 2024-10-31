import { Button, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";

interface FilterModalProps {
  onClose: () => void;
}

const FilterModal = ({ onClose }: FilterModalProps) => {
  return (
    <>
      <ModalHeader>
        Filter
      </ModalHeader>
      <ModalBody>
        Filter
      </ModalBody>
      <ModalFooter>
        <Button color="danger" variant="light" onPress={onClose}>
          Close
        </Button>
      </ModalFooter>
    </>
  );
};

export default FilterModal;
