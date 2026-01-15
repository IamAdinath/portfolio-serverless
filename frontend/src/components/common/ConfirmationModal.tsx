import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faTimes } from '@fortawesome/free-solid-svg-icons';
import './ConfirmationModal.css';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'warning'
}) => {
  console.log('ConfirmationModal render:', { isOpen, title, type });
  
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      console.log('Backdrop clicked, canceling');
      onCancel();
    }
  };

  const handleConfirmClick = () => {
    console.log('Confirm button clicked in modal');
    onConfirm();
  };

  const handleCancelClick = () => {
    console.log('Cancel button clicked in modal');
    onCancel();
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="confirmation-modal">
        <div className="modal-header">
          <div className={`modal-icon ${type}`}>
            <FontAwesomeIcon icon={faExclamationTriangle} />
          </div>
          <button className="modal-close" onClick={handleCancelClick}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        
        <div className="modal-content">
          <h3 className="modal-title">{title}</h3>
          <p className="modal-message">{message}</p>
        </div>
        
        <div className="modal-actions">
          <button className="btn-cancel" onClick={handleCancelClick}>
            {cancelText}
          </button>
          <button className={`btn-confirm ${type}`} onClick={handleConfirmClick}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;