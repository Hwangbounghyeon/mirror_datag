interface DetailModalProps {
  selectedImageIds: string[];
  modalClose: () => void;
}

const CountModal = ({ selectedImageIds, modalClose }: DetailModalProps) => {
  return (
    <div className="w-screen h-screen bg-gray-500/50 fixed inset-0 flex justify-center items-center" onClick={modalClose}>
      <div>{selectedImageIds}</div>
    </div>
  );
};

export default CountModal;
