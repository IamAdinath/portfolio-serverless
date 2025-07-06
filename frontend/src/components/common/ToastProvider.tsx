import React, { createContext, useContext, useState, useCallback } from 'react';
import { SuccessToaster, ErrorToaster, InfoToaster, WarningToaster } from '../common/Toasters';

interface ToastContextType {
  showSuccess: (msg: string) => void;
  showError: (msg: string) => void;
  showInfo: (msg: string) => void;
  showWarning: (msg: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Hook to use the context
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [warningMessage, setWarningMessage] = useState('');

  const triggerToast = useCallback((setMsg: React.Dispatch<React.SetStateAction<string>>) => {
    return (msg: string) => {
      setMsg(msg);
      setTimeout(() => setMsg(''), 5000);
    };
  }, []);

  const contextValue = {
    showSuccess: triggerToast(setSuccessMessage),
    showError: triggerToast(setErrorMessage),
    showInfo: triggerToast(setInfoMessage),
    showWarning: triggerToast(setWarningMessage),
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <SuccessToaster message={successMessage} />
      <ErrorToaster message={errorMessage} />
      <InfoToaster message={infoMessage} />
      <WarningToaster message={warningMessage} />
    </ToastContext.Provider>
  );
};
