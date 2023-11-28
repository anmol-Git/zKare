"use client";
import { useState } from "react";
import {
  useAccount
} from "wagmi";
import { useQuery, gql } from "@apollo/client";
import { useEas } from "@/shared/Eas";
import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { useConfig } from "@/shared/Config";
import Link from "next/link";
import { useParams } from 'next/navigation'
import { NextPageContext } from "next";

export default function Study({  }: NextPageContext) {
  
  const params = useParams();
  const [patientName, setPatientName] = useState('');
  const [patientAddress, setPatientAddress] = useState('');
  const { eas } = useEas();
  const { address } = useAccount();
  const {
    eas: {
      schemas: { studyPatient },
    },
  } = useConfig();

  const { data: datum, refetch } = useQuery(
    gql`
      query MyStudyPatients($address: String!, $attester: String!) {
        attestations(take: 25, where: { schemaId: { equals: $address }, attester: { equals: $attester } }) {
          id
          attester
          recipient
          data
        }
      }
    `,
    {
      variables: {
        address: studyPatient.address,
        attester: address,
      },
    }
  );

  const schemaEncoder = new SchemaEncoder(studyPatient.schema);

  const createPatient = async () => {
    if (address) {
      
      const encodedData = schemaEncoder.encodeData([
        { name: "patientName", value: patientName, type: 'string' },
        { name: "studyId", value: params.id || '', type: 'bytes32' },
      ]);

      await eas
        .attest({
          schema: studyPatient.address,
          data: {
            recipient: patientAddress,
            revocable: true,
            data: encodedData,
          },
        })
        .then((tx) => tx.wait())
        .then(() => {
            setPatientName('');
            setPatientAddress('');
            refetch();
        })
        .catch(console.error);
    }
  };

  const handlePatientNameChange = (e: any) => {
    setPatientName(e.target.value);
  };
  
  const handlePatientAddressChange = (e: any) => {
    setPatientAddress(e.target.value);
  };

  const patients = (datum?.attestations || []).map((attestation: any) => {
    return {
      id: attestation.recipient,
      value: schemaEncoder.decodeData(attestation.data).find(
        ({ name }) => name === 'patientName'
    )?.value.value
      };

  });
  return (
    <div>
      <input onChange={handlePatientNameChange} value={patientName} />
      <input onChange={handlePatientAddressChange} value={patientAddress} />
      <button onClick={createPatient}>Create Patient</button>
      <ul>
        {patients.map((patient: any, index: number) => <Link key={`${patient.id}-${index}`} href={`/doctor/study/${params.id}/patient/${patient.id}`}><span style={{color:'white'}}>{patient.value}</span></Link>)}
      </ul>
    </div>
  );
}
