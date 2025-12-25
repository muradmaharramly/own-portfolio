// src/components/common/ConfirmDialog.jsx
import React from 'react';
import Modal from './Modal';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Əminsiniz?',
  message = 'Bu əməliyyatı geri qaytarmaq mümkün olmayacaq.',
  confirmText = 'Təsdiq et',
  cancelText = 'Ləğv et',
  variant = 'danger'
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="confirm-dialog">
        <p className="confirm-dialog__message">{message}</p>
        <div className="confirm-dialog__actions">
          <button 
            className="confirm-dialog__btn confirm-dialog__btn--cancel" 
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button 
            className={`confirm-dialog__btn confirm-dialog__btn--${variant}`}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;