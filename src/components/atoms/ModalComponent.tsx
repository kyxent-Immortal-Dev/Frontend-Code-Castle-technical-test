interface ModalComponentProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  title?: string;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
}

export const ModalComponent = ({
  isOpen,
  onClose,
  children,
  size = 'md',
  title,
  showCloseButton = true,
  closeOnOverlayClick = true,
}: ModalComponentProps) => {
  const sizeClasses = {
    sm: 'modal-box w-11/12 max-w-md',
    md: 'modal-box w-11/12 max-w-lg',
    lg: 'modal-box w-11/12 max-w-2xl',
    xl: 'modal-box w-11/12 max-w-4xl',
    full: 'modal-box w-11/12 max-w-6xl'
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className={`modal ${isOpen ? "modal-open" : ""}`}
      onClick={handleOverlayClick}
    >
      <div className={sizeClasses[size]}>
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">{title}</h3>
            {showCloseButton && (
              <button 
                onClick={onClose}
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="py-2">
          {children}
        </div>

        {/* Footer - Only show if no custom close button */}
        {!showCloseButton && (
          <div className="modal-action">
            <button onClick={onClose} className="btn btn-primary">
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
