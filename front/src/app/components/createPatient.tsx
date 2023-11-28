import React, { useState } from 'react';
import NewPatient from "./newPatient"
import 'bulma/css/bulma.min.css';

const CreatePatient = ({patients, onSave, newPatient}) => {
    const [isOpen, setIsOpen] = useState(false);
  
    const handleOpenModal = () => {
      setIsOpen(true);
    };
  
    const handleCloseModal = () => {
      setIsOpen(false);
      onSave(patients);
    };

    const handlePatient = (patient) => {
      newPatient(patient)
    }
  
    return (
      <div>
        
        <div className="button is-primary" onClick={handleOpenModal}>
          Create New Patient
        </div>
        <NewPatient isOpen={isOpen} onClose={handleCloseModal} patients={patients} newPatient={handlePatient}/>
      </div>
    );
  };
  
  export default CreatePatient;

  
  
  
  
  
  
  
  