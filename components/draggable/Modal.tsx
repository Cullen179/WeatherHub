import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDrag } from 'react-dnd';
import { FC, useEffect } from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  // Apply or remove overflow hidden when modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto'; // Reset when modal is closed
    };
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogContent
        className="fixed top-0 left-0 right-0 bottom-0 m-auto bg-white p-4 z-50 overflow-auto"
        onClick={(e) => e.stopPropagation()} // Prevent modal from closing on click
      >
        <DialogHeader>
          <DialogTitle>Modal Title</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
