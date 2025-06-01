import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationProps {
  type: NotificationType;
  message: string;
  duration?: number;
  onClose?: () => void;
}

const Notification: React.FC<NotificationProps> = ({
  type,
  message,
  duration = 5000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  const iconMap = {
    success: <CheckCircle className="h-5 w-5 text-success-500" />,
    error: <XCircle className="h-5 w-5 text-error-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-warning-500" />,
    info: <Info className="h-5 w-5 text-primary-500" />
  };

  const bgColorMap = {
    success: 'bg-success-50',
    error: 'bg-error-50',
    warning: 'bg-warning-50',
    info: 'bg-primary-50'
  };

  const borderColorMap = {
    success: 'border-success-200',
    error: 'border-error-200',
    warning: 'border-warning-200',
    info: 'border-primary-200'
  };

  return (
    <div
      className={`rounded-md ${bgColorMap[type]} border ${borderColorMap[type]} p-4 animate-fade-in shadow-md`}
    >
      <div className="flex">
        <div className="flex-shrink-0">{iconMap[type]}</div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-gray-800">{message}</p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              onClick={handleClose}
              className="inline-flex rounded-md p-1.5 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <span className="sr-only">Dismiss</span>
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;