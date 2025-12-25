import React, { useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 animate-slide-in ${
      type === 'success' 
        ? 'bg-green-500 text-white' 
        : type === 'error' 
          ? 'bg-red-500 text-white' 
          : 'bg-blue-500 text-white'
    }`}>
      {type === 'success' && <CheckCircle className="w-5 h-5" />}
      {type === 'error' && <XCircle className="w-5 h-5" />}
      <span>{message}</span>
    </div>
  );
};

export default Toast;