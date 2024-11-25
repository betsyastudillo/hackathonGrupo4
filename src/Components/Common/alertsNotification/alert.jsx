import React, { useState, useEffect } from 'react';
import { Alert } from 'reactstrap';
import KUPIICONS from '../../../common/icons/icons';

const AlertKupi = ({ title = "Notificación", message = " ", isVisible, onClose, autoCloseTime = 3000  }) => {
  const [isOpen, setIsOpen] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setIsOpen(true); 
      const timer = setTimeout(() => {
        setIsOpen(false); 
        if (onClose) onClose();
      }, autoCloseTime);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, autoCloseTime]);

  const handleClose = () => {
    setIsOpen(false); 
    if (onClose) onClose();
  };


  return (
    <Alert
      color="primary"
      className="d-flex justify-content-between align-items-center"
      isOpen={isOpen}
      style={{ borderRadius: '12px', padding: '10px 15px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}
    >
      <div className='d-flex justify-content-between align-items-start'>
        <div className='mt-1 mx-2'>
          <KUPIICONS.KLogoIcon height='30' width='30' />
        </div>
        <span className="d-block text-start mx-2" style={{ color: '#333' }}>
          <h5 style={{ margin: 0, color: '#333' }}>{title}</h5>
          <span style={{ color: '#555' }}>{message}</span>
        </span>
      </div>

      <button
        onClick={handleClose}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#690BC8' }}
        aria-label="Cerrar"
      >
        <KUPIICONS.Close />
      </button>
    </Alert>
  );
};

export default AlertKupi;
