"use client";
import { useState } from "react";
import {
  useAccount
} from "wagmi";
import { useQuery, gql } from "@apollo/client";
import { useEas } from "@/shared/Eas";
import { SchemaEncoder, ZERO_ADDRESS } from "@ethereum-attestation-service/eas-sdk";
import { useConfig } from "@/shared/Config";
import Link from "next/link";
import { useParams } from 'next/navigation'
import { NextPageContext } from "next";
import Banner from "../../components/banner";
import 'bulma/css/bulma.min.css';


export default function Study({  }: NextPageContext) {
  
  const params = useParams();
  const [doctorName, setDoctorName] = useState<string>("");
  const [doctorAddress, setDoctorAddress] = useState<string>("");
  const { eas } = useEas();
  const { address } = useAccount();
  const {
    eas: {
      schemas: { doctorStudy },
    },
  } = useConfig();
  
  const { data: datum, refetch } = useQuery(
    gql`
      query MyStudyDoctors($address: String!, $attester: String!) {
        attestations(take: 25, where: { schemaId: { equals: $address }, attester: { equals: $attester } }) {
          id
          attester
          data
        }
      }
    `,
    {
      variables: {
        address: doctorStudy.address,
        attester: address,
      },
    }
  );

  const schemaEncoder = new SchemaEncoder(doctorStudy.schema);

  const createStudy = async () => {
    const url = 'http://localhost:3000/doctorview'; // Replace with the desired URL
    window.open(url, '_blank');
    if (address) {
      
      const encodedData = schemaEncoder.encodeData([
        { name: "doctorName", value: doctorName, type: 'string' },
        { name: "studyId", value: params.id || '', type: 'bytes32' },
      ]);

      await eas
        .attest({
          schema: doctorStudy.address,
          data: {
            recipient: doctorAddress || ZERO_ADDRESS,
            revocable: true,
            data: encodedData,
          },
        })
        .then((tx) => tx.wait())
        .then(() => {
            setDoctorName('');
            setDoctorAddress('');
            refetch();
        })
        .catch(console.error);
    }
  };

  const handleDoctorNameChange = (e: any) => {
    setDoctorName(e.target.value);
  };
  
  const handleDoctorAddressChange = (e: any) => {
    setDoctorAddress(e.target.value);
  };

  const doctors = (datum?.attestations || []).map((attestation: any) => {
      
    return {
      id: attestation.id,
      name: schemaEncoder.decodeData(attestation.data).find(
        ({ name }) => name === 'doctorName'
    )?.value.value,

      };

  });
  
  return (
    <div>
      <Banner></Banner>
      <div className="box has-text-centered">
        <div className="columns">
        <div className="column"></div>
        <div className="column">
        <div className="field">
            <label className="label">Create Doctor</label>
            <div className="control">
                <input className="input" value = {doctorName} onChange={handleDoctorNameChange} type="text" placeholder="Doctor Name"/>
            </div>
            <div className="control">
                <input className="input" value = {doctorAddress} onChange={handleDoctorAddressChange} type="text" placeholder="Doctor Coin Address"/>
            </div>
        </div>
        <div className="button" onClick={createStudy}>Create</div>
        <ul>
          {doctors.map((doctor: any) => <span style={{color:'white'}}>{doctor.name}</span>)}
        </ul>
        </div>
        <div className="column"></div>

        </div>
      </div>
    </div>
  );
}


{/* <input onChange={handleDoctorNameChange} value={doctorName} />
      <input onChange={handleDoctorAddressChange} value={doctorAddress} />
      <button onClick={createStudy}>Create Doctor</button>
      <ul>
        {doctors.map((doctor: any) => <span style={{color:'white'}}>{doctor.name}</span>)}
      </ul> */}
