import React from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const Alert = ({ 
  type = 'info', 
  message, 
  title,
  onClose, 
  className = '',
  dismissible = true 
}) => {
  const variants = {
    success: {
      container: 'bg-emerald-50 border-emerald-200 shadow-emerald-100',
      icon: 'text-emerald-600',
      title: 'text-emerald-900',
      message: 'text-emerald-800',
      closeButton: 'text-emerald-500 hover:text-emerald-700'
    },
    error: {
      container: 'bg-red-50 border-red-200 shadow-red-100',
      icon: 'text-red-600',
      title: 'text-red-900',
      message: 'text-red-800',
      closeButton: 'text-red-500 hover:text-red-700'
    },
    warning: {
      container: 'bg-amber-50 border-amber-200 shadow-amber-100',
      icon: 'text-amber-600',
      title: 'text-amber-900',
      message: 'text-amber-800',
      closeButton: 'text-amber-500 hover:text-amber-700'
    },
    info: {
      container: 'bg-blue-50 border-blue-200 shadow-blue-100',
      icon: 'text-blue-600',
      title: 'text-blue-900',
      message: 'text-blue-800',
      closeButton: 'text-blue-500 hover:text-blue-700'
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return CheckCircle;
      case 'error':
      case 'warning':
        return AlertCircle;
      default:
        return AlertCircle;
    }
  };

  const Icon = getIcon();
  const variant = variants[type] || variants.info;

  return (
    <div className={`
      border rounded-lg p-4 mb-4 shadow-sm transition-all duration-200
      ${variant.container}
      ${className}
    `}>
      <div className="flex items-start">
        <Icon className={`w-5 h-5 mr-3 mt-0.5 flex-shrink-0 ${variant.icon}`} />
        
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={`text-sm font-semibold mb-1 ${variant.title}`}>
              {title}
            </h4>
          )}
          <p className={`text-sm leading-relaxed pr-4 ${variant.message}`}>
            {message}
          </p>
        </div>

        {dismissible && onClose && (
          <button
            onClick={onClose}
            className={`
              ml-3 flex-shrink-0 cursor-pointer
              ${variant.closeButton}
            `}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              margin: 0,
              outline: 'none',
              boxShadow: 'none',
              appearance: 'none',
              WebkitAppearance: 'none',
              MozAppearance: 'none'
            }}
            aria-label="Close alert"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
