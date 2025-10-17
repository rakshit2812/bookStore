import React, { createContext, useContext, useState, useCallback } from 'react';

const ConfirmationContext = createContext();

export const useConfirmation = () => {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error('useConfirmation must be used within a ConfirmationProvider');
  }
  return context;
};

export const ConfirmationProvider = ({ children }) => {
  const [confirmationState, setConfirmationState] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: null,
    onCancel: null,
    type: 'warning', // 'warning', 'danger', 'info', 'success'
  });

  const showConfirmation = useCallback(
    ({
      title = 'Confirm Action',
      message = 'Are you sure you want to proceed?',
      confirmText = 'Confirm',
      cancelText = 'Cancel',
      type = 'warning',
      onConfirm,
      onCancel,
    }) => {
      return new Promise((resolve) => {
        setConfirmationState({
          isOpen: true,
          title,
          message,
          confirmText,
          cancelText,
          type,
          onConfirm: () => {
            if (onConfirm) onConfirm();
            resolve(true);
            setConfirmationState((prev) => ({ ...prev, isOpen: false }));
          },
          onCancel: () => {
            if (onCancel) onCancel();
            resolve(false);
            setConfirmationState((prev) => ({ ...prev, isOpen: false }));
          },
        });
      });
    },
    []
  );

  const hideConfirmation = useCallback(() => {
    setConfirmationState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <ConfirmationContext.Provider
      value={{ showConfirmation, hideConfirmation, confirmationState }}
    >
      {children}
    </ConfirmationContext.Provider>
  );
};
