import React, { useState } from 'react';
import 'bulma/css/bulma.min.css';

const Modal = ({ isOpen, onClose, patient }) => {
  const date = new Date().toLocaleDateString()

  const [name, setName] = useState(patient.name);
  const [address, setAddress] = useState(patient.address);
  const [gender, setGender] = useState(patient.gender);
  const [dob, setDob] = useState(patient.dob);

  const [heartRate, setHeartRate] = useState('');
  const [isChecked, setIsChecked] = useState(patient.smoker)

  const [tab, setTab] = useState('Profile');

  const [records, setRecords] = useState(patient.records)

  const checkHandler = () => {
    setIsChecked(!isChecked)
  }

  const onSave = () => {
    patient.name = name;
    patient.update = date;
    patient.dob = dob;
    patient.gender = gender;
    patient.smoker = isChecked;
    setTab('Profile');
    onClose();
  }

  const createRecord = () => {
    const record = {
      updated: date,
      heartRate: heartRate
    }
    records.push(record)
    setRecords(records)
    setHeartRate('');
  }

  const handleDelete = (record) => {
    console.log("deleted")
    setRecords(records.filter(x => x.updated !== record.updated))
  }

  const newData = {
    name: name,
    updated: date,
    dob: dob,
    gender: gender,
    smoker: isChecked,
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
                    <p className="modal-card-title">{patient.name}</p>
                <div className="tabs is-centered">
                <ul>
                  <li onClick={() => setTab('Profile')} className={tab == 'Profile' ? "is-active" : ""}><a>Profile</a></li>
                  <li  onClick={() => setTab('Records')} className={tab == 'Records' ? "is-active" : ""}><a>Records</a></li>
                </ul>
              </div>
                <section className="modal-card-body">
                    {tab == 'Profile' && (
                      <div className="columns">
                          <div className="column">
                              <div className="field">
                                  <label className="label">Full Name</label>
                                  <div className="control">
                                      <input className="input" value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder={patient.name}/>
                                  </div>
                              </div>
                              <div className="field">
                                  <label className="label">Coin Address</label>
                                  <div className="control">
                                      <input className="input" value={address} onChange={(e) => setAddress(e.target.value)} type="text" placeholder={patient.address}/>
                                  </div>
                              </div>
                              <div className="field">
                                  <label className="label">Gender</label>
                                  <div className="control">
                                      <input className="input" value={gender} onChange={(e) => setGender(e.target.value)} type="text" placeholder={patient.gender}/>
                                  </div>
                              </div>
                              <div className="field">
                                  <label className="label">Date of Birth</label>
                                  <div className="control">
                                      <input className="input" value={dob} onChange={(e) => setDob(e.target.value)} type="text" placeholder={patient.dob}/>
                                  </div>
                              </div>
                              <div className="field">
                                  <div className="control">
                                      <label className="checkbox is-normal">
                                      <input type="checkbox" 
                                      checked={isChecked}
                                      onChange={checkHandler}
                                      />
                                          &nbsp;Patient is a Smoker&nbsp;
                                      </label>
                                      <label className="checkbox is-normal">
                                    <input type="checkbox" 
                                    />
                                        &nbsp;Patient is overweight
                                    </label>
                                  </div>
                              </div>
                          </div>
                      </div>)}

                      {tab == 'Records' && ( <div>

                      <div className="columns">
                        <div className="column has-text-centered">
                        <div className="field">
                                  <label className="label">Create Record</label>
                                  <div className="control">
                                      <input className="input" value={heartRate} onChange={(e) => setHeartRate(e.target.value)} type="text" placeholder="ex 75"/>
                                  </div>
                         </div>
                        </div>
                        <div className="column has-text-centered-left">
                        <div onClick={createRecord} className="button is-info">Create</div>
                        </div>
                      </div>
                      
                      
                      {records.map((record: any) => (
                    <div className="card">
                    <div className="card-content">
                        <div className="content">
                            <div className="columns">
                                <div className="column">
                                    <p>Record from: {record.updated}</p>
                                    <p>Heart Rate: {record.heartRate}</p>
                                </div>
                                <div className="column">
                                    <div className="buttons is-right">
                                        <div className="button is-danger" onClick={() => handleDelete(record)}>
                                            Delete
                                        </div>
                                    </div>
                                </div>

                            </div>
                            
                        </div>
                    </div>
                </div>
            ))}
            </div>)}

                </section>
            <footer className="modal-card-foot">
                <button className="button" onClick={onClose}>Cancel</button>
                <button className="button is-primary" onClick={onSave}>Save</button>
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

export default Modal;





