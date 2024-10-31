interface DetailModalProps {
  imageId: number | null;
  modalClose: () => void;
}

const DetailModal = ({ imageId, modalClose }: DetailModalProps) => {
  return (
    <div className="w-screen h-screen bg-gray-500/50 fixed inset-0 flex justify-center items-center" onClick={modalClose}>
      <div>{imageId}</div>
    </div>
  );
};

export default DetailModal;
