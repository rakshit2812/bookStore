import React, { useEffect } from 'react';
import { useConfirmation } from '../contexts/ConfirmationContext';
import { useTheme } from '../contexts/ThemeContext';

export default function ConfirmationModal() {
  const { confirmationState } = useConfirmation();
  const { theme } = useTheme();
  const { isOpen, title, message, confirmText, cancelText, onConfirm, onCancel, type } = confirmationState;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: (
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ),
          buttonClass: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
          ringClass: 'ring-red-500/20',
        };
      case 'success':
        return {
          icon: (
            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          buttonClass: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
          ringClass: 'ring-green-500/20',
        };
      case 'info':
        return {
          icon: (
            <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          buttonClass: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
          ringClass: 'ring-blue-500/20',
        };
      default: // warning
        return {
          icon: (
            <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ),
          buttonClass: 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700',
          ringClass: 'ring-orange-500/20',
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      />

      {/* Modal */}
      <div
        className={`relative z-10 w-full max-w-md mx-4 rounded-2xl shadow-2xl transform transition-all animate-scale-in ${
          theme === 'dark' ? 'bg-slate-900' : 'bg-white'
        }`}
      >
        {/* Content */}
        <div className="p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className={`rounded-full p-3 ring-8 ${typeStyles.ringClass} ${
              theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50'
            }`}>
              {typeStyles.icon}
            </div>
          </div>

          {/* Title */}
          <h3 className={`text-2xl font-bold text-center mb-3 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {title}
          </h3>

          {/* Message */}
          <p className={`text-center mb-8 leading-relaxed ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {message}
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                theme === 'dark'
                  ? 'bg-slate-800 hover:bg-slate-700 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 transform hover:scale-105 ${typeStyles.buttonClass}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
