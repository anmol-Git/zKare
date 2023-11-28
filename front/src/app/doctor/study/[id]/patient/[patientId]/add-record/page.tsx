"use client";
import { ChangeEventHandler, useState } from "react";
import { useAccount } from "wagmi";
import { useEas } from "@/shared/Eas";
import { useConfig } from "@/shared/Config";
import { useParams, useRouter } from "next/navigation";
import { NextPageContext } from "next";
import { usePatientProfileData } from "@/shared/usePatientProfileData";
import DatetimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import { usePatientRecordsData } from "@/shared/usePatientRecordsData";
export default function AddRecord({}: NextPageContext) {
  const params = useParams();
  const router = useRouter();
  
  const { values: initialValues, schemaEncoder } = usePatientRecordsData(params.patientId);
  const [date, setDate] = useState(new Date());
  const [heartRate, setHeartRate] = useState('');
  
  const { eas } = useEas();
  const { address } = useAccount();
  const {
    eas: {
      schemas: { patientRecord  },
    },
  } = useConfig();

  const handleChange = (_date: any) => {
    setDate(_date);
  }

  const handleHeartRateChanged: ChangeEventHandler<HTMLInputElement> = (e) => {
    setHeartRate(e.target.value);
  }

  const handleSubmit = async () => {
    
    if (address) {
      const encodedData = schemaEncoder.encodeData([
        { name: "gender", value: initialValues.gender, type: "string" },
        { name: "isSmoker", value: initialValues.isSmoker, type: "bool" },
        { name: "isOverweight", value: initialValues.isOverweight, type: "bool" },
        { name: "bloodType", value: initialValues.bloodType, type: "string" },
        { name: "treatment", value: initialValues.treatment, type: "string" },
        { name: "timestamp", value: Math.round(date.getTime() / 1000), type: "uint32" },
        { name: "heartRate", value: parseInt(heartRate), type: "uint16" },
      ]);

      await eas
        .attest({
          schema: patientRecord.address,
          data: {
            recipient: params.patientId,
            revocable: true,
            data: encodedData,
          },
        })
        .then((tx) => tx.wait())
        .then(() => router.push(`/doctor/study/${params.id}/patient/${params.patientId}`))
        .catch(console.error);
    }
  }

  return (
    <div>
      <DatetimePicker onChange={handleChange} value={date} /> 
      <input type="number" placeholder="Heart Rate" onChange={handleHeartRateChanged} value={heartRate} />
      <button type="submit" onClick={handleSubmit}>Submit</button>
    </div>
  );
}
