interface ModalComponentProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const ModalComponent = ({
  isOpen,
  onClose,
  children,
}: ModalComponentProps) => {
  return (
    <div className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box">
        {children}
        <div className="modal-action">
          <button onClick={onClose} className="btn">Close</button>
        </div>
      </div>
    </div>
  );
};
