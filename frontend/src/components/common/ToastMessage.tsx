// src/components/common/ToastMessage.tsx
import React, { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle, faInfoCircle, faExclamationTriangle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ToastMessageProps } from '../../types';
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
    // Auto-dismiss toast after 5 seconds (except for error toasts)
    if (toast.type !== 'error') {
      const timer = timerRef.current;
      timerRef.current = setTimeout(() => {
        onDismiss();
      }, 5000);
      
      // Clear any existing timer
      if (timer) {
        clearTimeout(timer);
      }
    }

    // Clear timer when component unmounts
    return () => {
      const timer = timerRef.current;
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [toast.type, onDismiss]);

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