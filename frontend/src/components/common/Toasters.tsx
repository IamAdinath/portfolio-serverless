// components/common/toasters.tsx
import React from 'react';
import './Toasters.css';

interface ToasterProps {
  message: string;
}

export const SuccessToaster: React.FC<ToasterProps> = ({ message }) => {
  if (!message) return null;
  return <div className="toaster-base toaster-success">{message}</div>;
};

export const ErrorToaster: React.FC<ToasterProps> = ({ message }) => {
  if (!message) return null;
  return <div className="toaster-base toaster-error">{message}</div>;
};

export const InfoToaster: React.FC<ToasterProps> = ({ message }) => {
  if (!message) return null;
  return <div className="toaster-base toaster-info">{message}</div>;
};

export const WarningToaster: React.FC<ToasterProps> = ({ message }) => {
  if (!message) return null;
  return <div className="toaster-base toaster-warning">{message}</div>;
};
