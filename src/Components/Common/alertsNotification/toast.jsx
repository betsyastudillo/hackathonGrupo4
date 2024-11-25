import React, { useState, useEffect } from 'react';
import { Toast, ToastBody } from 'reactstrap';
import KUPIICONS from '../../../common/icons/icons';

const ToastKupi = ({ 
  title = "Notificación", 
  message = " ", 
  type = "regular", // Puede ser 'regular', 'success', 'danger'
  isVisible, 
  onClose, 
  autoCloseTime = 3000 
}) => {

  const [isOpen, setIsOpen] = useState(isVisible)

  useEffect(() => {
    if (isVisible) {
      setIsOpen(true); // Abrir el toast si `isVisible` es true
      const timer = setTimeout(() => {
        setIsOpen(false); // Cerrar el toast después de `autoCloseTime`
        onClose?.()
      }, autoCloseTime);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, autoCloseTime]);

  const handleClose = () => {
    setIsOpen(false)
    onClose?.()
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <KUPIICONS.CheckCircle height="20" width="20" stroke='#FFFFFF' strokeWidth="2"/>;
      case 'danger':
        return <KUPIICONS.Warning height="20" width="20"/>;
      default:
        return <KUPIICONS.CheckCircle height="20" width="20" stroke='#FFFFFF' strokeWidth="2"/>;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-success'
      case 'danger':
        return 'bg-danger'
      default:
        return 'bg-primary'
    }
  }

  const getColorComplement = () => {
    switch (type) {
      case 'success':
        return '#FFFFFF'
      case 'danger':
        return '#FFFFFF'
      default:
        return '#FFFFFF'
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1050,
        maxWidth: '300px'
      }}
    >
      <Toast isOpen={isOpen} className={getBackgroundColor()}>
        <ToastBody>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="d-flex align-items-center">
              {getIcon()} 
              <h6 className="ms-2 mb-0" style={{ fontWeight: 'bold', color:getColorComplement()}}>{title}</h6>
            </div>
            <button
              onClick={handleClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              aria-label="Close"
            >
              <KUPIICONS.Close fill={getColorComplement()} />
            </button>
          </div>
          <span style={{ fontSize: "12px", color:getColorComplement()}}>
            {message}
          </span>
        </ToastBody>
      </Toast>
    </div>
  );
};

export default ToastKupi;
