"use client";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useQuery, gql } from "@apollo/client";
import { useEas } from "@/shared/Eas";
import { useConfig } from "@/shared/Config";
import { useParams } from "next/navigation";
import { NextPageContext } from "next";
import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { usePatientProfileData } from "@/shared/usePatientProfileData";
import { useAllPatientRecordsData } from "@/shared/useAllPatientRecordsData";
import Link from "next/link";

export default function Patient({}: NextPageContext) {
  const params = useParams();
  const { eas } = useEas();
  const { address } = useAccount();
  const {
    eas: {
      schemas: { studyPatient, patientProfile },
    },
  } = useConfig();

  const { values: records, refetch: recordsRefetch } = useAllPatientRecordsData(params.patientId);

  const { data: studyPatientData, refetch } = useQuery(
    gql`
      query MyStudyPatient($address: String!, $recipient: String!) {
        attestations(
          take: 1
          where: { schemaId: { equals: $address }, recipient: { equals: $recipient } }
        ) {
          id
          attester
          data
        }
      }
    `,
    {
      variables: {
        address: studyPatient.address,
        recipient: params.patientId,
      },
    }
  );

  const { values: initialValues, schemaEncoder: patientProfileSchemaEncoder } = usePatientProfileData(params.patientId);

  const [gender, setGender] = useState(initialValues.gender);
  const [isSmoker, setIsSmoker] = useState(initialValues.isSmoker);
  const [isOverweight, setIsOverweight] = useState(initialValues.isOverweight);
  const [bloodType, setBloodType] = useState(initialValues.bloodType);
  const [treatment, setTreatment] = useState(initialValues.treatment);

  const saveProfile = async () => {
    if (address) {
      const encodedData = patientProfileSchemaEncoder.encodeData([
        { name: "gender", value: gender, type: "string" },
        { name: "isSmoker", value: isSmoker, type: "bool" },
        { name: "isOverweight", value: isOverweight, type: "bool" },
        { name: "bloodType", value: bloodType, type: "string" },
        { name: "treatment", value: treatment, type: "string" },
      ]);

      await eas
        .attest({
          schema: patientProfile.address,
          data: {
            recipient: address,
            revocable: true,
            data: encodedData,
          },
        })
        .then((tx) => tx.wait())
        .then(() => {
          refetch();
          recordsRefetch();
        })
        .catch(console.error);
    }
  };

  const handleGenderChange = (e: any) => {
    setGender(e.target.value);
  };

  const handleIsSmokerToggle = (e: any) => {
    setIsSmoker(!isSmoker);
  };
  const handleIsOverweightToggle = (e: any) => {
    setIsOverweight(!isOverweight);
  };
  const handleBloodTypeChange = (e: any) => {
    setBloodType(e.target.value);
  };
  const handleTreatmentChange = (e: any) => {
    setTreatment(e.target.value);
  };

  const studyPatientSchemaEncoder = new SchemaEncoder(studyPatient.schema);

  if (studyPatientData && studyPatientData.attestations[0]) {
    const profile = studyPatientSchemaEncoder.decodeData(studyPatientData.attestations[0].data);
    const patientName = profile.find(({ name }) => name === "patientName")?.value.value as string;

    return (
      <div>
        <h1 style={{ color: "black" }}>{patientName} </h1>
        Treatment
        <input onChange={handleTreatmentChange} value={treatment} />
        Blood Type
        <input onChange={handleBloodTypeChange} value={bloodType} />
        Is Smoker
        <input type="checkbox" onChange={handleIsSmokerToggle} checked={isSmoker === true} />
        IsOverweight
        <input
          type="checkbox"
          onChange={handleIsOverweightToggle}
          checked={isOverweight === true}
        />
        Gender
        <select onChange={handleGenderChange} value={gender}>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="not-disclosed">Not Disclosed</option>
        </select>
        <button onClick={saveProfile}>Save Profile</button>
        <h2>Records</h2>
        {records.map((record) => (
          
          <div key={record.id}>
            <p>{record.bloodType}</p>
            <p>{record.date?.toString()}</p>
            <p>{record.gender}</p>
            <p>{record.heartRate}</p>
            <p>{record.isOverweight ? 'overweight' : 'not overweight'}</p>
            <p>{record.isSmoker ? 'smoker' : 'not smoker'}</p>
            <p>{record.treatment}</p>
          </div>
        ))}
        <Link href={`/doctor/study/${params.id}/patient/${params.patientId}/add-record`}>Add New Record</Link>
      </div>
    );
  } else {
    return null;
  }
}
