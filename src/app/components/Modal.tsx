'use client';

import Modal from 'react-modal';
import { useEffect, ReactNode } from 'react';

// Set accessibility root
Modal.setAppElement('body'); // Ensure it matches the root element in your app

interface ReusableModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  modalClassName?: string;
  button?: boolean;
}

const ReusableModal: React.FC<ReusableModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  modalClassName,
  button,
}) => {
  // Disable scrolling on modal open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel={title || 'Modal'}
      overlayClassName="fixed inset-0 bg-black/75 flex items-center justify-center z-50"
      className={`relative rounded-lg shadow-lg overflow-hidden w-full max-w-3xl ${modalClassName}`}
    >
      {/* Close Button */}
      {button && <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-4xl z-50 hover:text-primary"
        aria-label="Close"
      >
        &times;
      </button>}

      {/* Modal Content */}
      <div className="w-full h-full">{children}</div>
    </Modal>
  );
};

export default ReusableModal;
