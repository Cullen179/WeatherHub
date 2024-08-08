import { FC } from 'react';
import ReactDOM from 'react-dom';

interface FullScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
} // Full screen modal props

const FullScreenModal: FC<FullScreenModalProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  if (!isOpen) return null; // Return null if not open (don't render)

  return ReactDOM.createPortal(
    <div
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        <button
          className="modal-close"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>,
    document.body
  );
};

export default FullScreenModal;
