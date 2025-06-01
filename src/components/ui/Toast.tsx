import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 5000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const bgColor = {
    success: 'bg-success-100 border-success-500 text-success-900',
    error: 'bg-error-100 border-error-500 text-error-900',
    info: 'bg-primary-100 border-primary-500 text-primary-900',
    warning: 'bg-warning-100 border-warning-500 text-warning-900'
  }[type];

  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-lg border ${bgColor} shadow-lg max-w-md animate-slide-up`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className="ml-4 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;