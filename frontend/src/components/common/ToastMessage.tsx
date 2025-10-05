// src/components/common/ToastMessage.tsx
import React, { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle, faInfoCircle, faExclamationTriangle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Toast, ToastMessageProps } from '../../types';
import './Toast.css';

// Re-export Toast type for backward compatibility
export type { Toast } from '../../types';

const toastConfig = {
  success: { icon: faCheckCircle, className: 'toast-success' },
  error: { icon: faExclamationCircle, className: 'toast-error' },
  info: { icon: faInfoCircle, className: 'toast-info' },
  warning: { icon: faExclamationTriangle, className: 'toast-warning' },
};

export const ToastMessage: React.FC<ToastMessageProps> = ({ toast, onDismiss }) => {
  const { icon, className } = toastConfig[toast.type];

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any timers when the component unmounts
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div className={`toast-message ${className}`}>
      <FontAwesomeIcon icon={icon} className="toast-icon" />
      <p className="toast-text">{toast.message}</p>
      <button onClick={onDismiss} className="toast-close-button">
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
  );
};