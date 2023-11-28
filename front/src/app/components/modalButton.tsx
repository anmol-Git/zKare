import React, { useState } from 'react';
import Modal from "./modal"
import 'bulma/css/bulma.min.css';

const ModalButton = ({patient}) => {
    const [isOpen, setIsOpen] = useState(false);
  
    const handleOpenModal = () => {
      setIsOpen(true);
    };
  
    const handleCloseModal = () => {
      setIsOpen(false);
    };
  
    return (
      <div>
        
        <div className="button is-info" onClick={handleOpenModal}>
          View
        </div>
        <Modal isOpen={isOpen} onClose={handleCloseModal} patient={patient}/>
      </div>
    );
  };
  
  export default ModalButton;

  
  
  
  
  
  
  
  