"use client";
import { useState } from "react";
import { useAccount } from "wagmi";
import { useQuery, gql } from "@apollo/client";
import { useEas } from "@/shared/Eas";
import { SchemaEncoder, ZERO_ADDRESS } from "@ethereum-attestation-service/eas-sdk";
import { useConfig } from "@/shared/Config";
import Link from "next/link";
import { useEffect } from "react";
export default function Doctor() {
  const { address } = useAccount();
  const {
    eas: {
      schemas: { doctorStudy, study },
    },
  } = useConfig();
  const [studyAttesters, setStudyAttesters] = useState<string[]>([]);
  const { data: datum } = useQuery(
    gql`
      query MyStudies($address: String!, $recipient: String!) {
        attestations(
          take: 25
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
        address: doctorStudy.address,
        recipient: address,
      },
    }
  );

  useEffect(() => {
    const schemaEncoder = new SchemaEncoder(doctorStudy.schema);

    const studies: any[] = (datum?.attestations || []).map((attestation: any) => {
      const decodedData = schemaEncoder.decodeData(attestation.data);
      return {
        id: attestation.id,
        value: decodedData.find(({ name }) => name === "studyId")?.value.value,
        attester: attestation.attester,
      };
    });

    const studyAttesters = studies.map((_study) => _study.attester);

    setStudyAttesters(studyAttesters);
  }, [datum]);
  
  const { data: datum2 } = useQuery(
    gql`
      query Studies($address: String!, $attesters: [String!]) {
        attestations(
          take: 25
          where: { schemaId: { equals: $address }, attester: { in: $attesters } }
        ) {
          id
          attester
          data
        }
      }
    `,
    {
      variables: {
        address: doctorStudy.address,
        attesters: studyAttesters,
      },
    }
  );

  const schemaEncoder = new SchemaEncoder(study.schema);

  const studies = (datum2?.attestations || []).map((attestation: any) => {
    const decodedData = schemaEncoder.decodeData(attestation.data);
    
    return {
      id: attestation.id,
      value: decodedData.find(
        ({ name }) => name === 'study'
    )?.value.value
      };

  });

  return (
    <div>
      My Studies
      <ul>
        {studies.map((study: any) => (
          <Link key={study.id} href={`/doctor/study/${study.id}`}>
            <span style={{ color: "white" }}>{study.value}</span>
          </Link>
        ))}
      </ul>
    </div>
  );
}
