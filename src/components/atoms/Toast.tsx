import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export const Toast = ({ message, type, isVisible, onClose, duration = 3000 }: ToastProps) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const toastClasses = {
    success: 'alert-success',
    error: 'alert-error',
    info: 'alert-info'
  };

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️'
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
      <div className={`alert ${toastClasses[type]} shadow-lg max-w-sm`}>
        <span className="text-lg">{icons[type]}</span>
        <span>{message}</span>
        <button 
          onClick={onClose}
          className="btn btn-sm btn-ghost"
        >
          ✕
        </button>
      </div>
    </div>
  );
}; 