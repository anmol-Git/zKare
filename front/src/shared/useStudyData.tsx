import { gql, useQuery } from "@apollo/client";
import { useConfig } from "./Config";
import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { orderBy, uniq } from "lodash";

export const useStudyData = (address?: string, studyId?: string) => {
  const {
    eas: {
      schemas: { doctorStudy, patientRecord },
    },
  } = useConfig();

  const schemaEncoder = new SchemaEncoder(doctorStudy.schema);

  const { data: doctorData, refetch } = useQuery(
    gql`
      query MyStudyDoctors($address: String!, $attester: String!) {
        attestations(
          take: 25
          where: { schemaId: { equals: $address }, attester: { equals: $attester } }
        ) {
          id
          attester
          recipient
          data
        }
      }
    `,
    {
      variables: {
        address: doctorStudy.address,
        attester: address,
      },
      skip: !address,
    }
  );

  const doctors = uniq(
    (doctorData?.attestations || []).map((attestation: any) => {
      return attestation.recipient;
    })
  );

  const { data: patientRecordData } = useQuery(
    gql`
      query PatientRecords($address: String!, $attesters: [String!]) {
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
        address: patientRecord.address,
        attesters: doctors,
      },
    }
  );

  const patientRecordSchemaEncoder = new SchemaEncoder(patientRecord.schema);

  let patientRecords = [];

  if (patientRecordData && patientRecordData.attestations) {

    patientRecords = orderBy(
      patientRecordData.attestations.map(
      (attestation: any) => {
        
        const record = patientRecordSchemaEncoder.decodeData(attestation.data);
        const gender = record.find(({ name }) => name === "gender")?.value.value as string | undefined;
        const isSmoker = record.find(({ name }) => name === "isSmoker")?.value.value as
          | boolean
          | undefined;
        const isOverweight = record.find(({ name }) => name === "isOverweight")?.value.value as
          | boolean
          | undefined;
        const bloodType = record.find(({ name }) => name === "bloodType")?.value.value as
          | string
          | undefined;
        const treatment = record.find(({ name }) => name === "treatment")?.value.value as
          | string
          | undefined;
        const heartRate = record.find(({ name }) => name === "heartRate")?.value.value as
          | number |  undefined;
        const timestamp = record.find(({ name }) => name === "timestamp")?.value.value as
          | number | undefined;

        const value = {
          id: attestation.id,
          gender,
          isSmoker,
          isOverweight,
          bloodType,
          treatment,
          heartRate,
          date: timestamp === undefined ? undefined : new Date(timestamp*1000),
        };

        return value;
    }), (val) => val.date, ['desc'])
    
  }

  return { doctors, patientRecords, refetch };
};
