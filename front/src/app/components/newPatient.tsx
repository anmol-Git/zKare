import React, { useState } from 'react';
import 'bulma/css/bulma.min.css';

const NewPatient = ({ isOpen, onClose, patients, newPatient }) => {

  const date = new Date().toLocaleDateString()

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');

  const [heartRate, setHeartRate] = useState('');
  const [isChecked, setIsChecked] = useState(false)

  const checkHandler = () => {
    setIsChecked(!isChecked)
  }

  const resetFields = () => {
    setName("");
    setAddress("");
    setGender("");
    setDob("");
    setHeartRate("");
    setIsChecked(false);
  }

  const onCreate = () => {
    newPatient(patient);
    //patients.push(patient)
    resetFields();
    onClose();
  }

  const patient = {
    name: name,
    updated: date,
    dob: dob,
    gender: gender,
    smoker: isChecked,
    address: address,
    records: [
        {
            updated: date,
            heartRate: heartRate
        }
    ]
  }
  
  return (
    <div className={`modal ${isOpen ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        <div className="box">
                <header className="modal-card-head">
                    <p className="modal-card-title">New Patient</p>
                </header>
                <section className="modal-card-body">
                    <div className="columns">
                        <div className="column">
                            <div className="field">
                                <label className="label">Full Name</label>
                                <div className="control">
                                    <input className="input" value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="ex John Doe"/>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Coin Address</label>
                                <div className="control">
                                    <input className="input" value={address} onChange={(e) => setAddress(e.target.value)} type="text" placeholder="0as9ad0asd09129j9dasd"/>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Gender</label>
                                <div className="control">
                                    <input className="input" value={gender} onChange={(e) => setGender(e.target.value)} type="text" placeholder="Male"/>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Date of Birth</label>
                                <div className="control">
                                    <input className="input" value={dob} onChange={(e) => setDob(e.target.value)} type="text" placeholder={date}/>
                                </div>
                            </div>
                            <div className="field">
                                <div className="control">
                                    <label className="checkbox is-normal">
                                    <input type="checkbox" 
                                    checked={isChecked}
                                    onChange={checkHandler}
                                    />
                                        &nbsp;Patient is a smoker
                                    </label>
                                    <label className="checkbox is-normal">
                                    <input type="checkbox" 
                                    
                                    />
                                        &nbsp;Patient is overweight
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="column">
                            <h3 className="has-text-centered">First Record</h3>
                            <div className="field">
                                <label className="label">Heart Rate</label>
                                <div className="control">
                                    <input className="input" value={heartRate} onChange={(e) => setHeartRate(e.target.value)} type="text" placeholder="ex 74"/>
                                </div>
                            </div>
                            <fieldset disabled>
                            <div className="field">
                                <label className="label">Date of creation</label>
                                <div className="control">
                                    <input className="input" type="text" placeholder={date}/>
                                </div>
                            </div>
                            </fieldset>
                        </div>
                    </div>
                </section>
            <footer className="modal-card-foot">
                <button className="button" onClick={onClose}>Cancel</button>
                <button className="button is-primary" onClick={onCreate}>Create Patient</button>
            </footer>
        </div>
      </div>
      <button
        className="modal-close is-medium"
        aria-label="close"
        onClick={onClose}
      ></button>
    </div>
  );
};

export default NewPatient;