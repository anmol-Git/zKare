import { gql, useQuery } from "@apollo/client";
import { useConfig } from "./Config";
import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { usePatientProfileData } from "./usePatientProfileData";

export const usePatientRecordsData = (patientId: string) => {

  const { values: profileValues } = usePatientProfileData(patientId);
  
  const {
    eas: {
      schemas: { patientRecord },
    },
  } = useConfig();

  const { data: patientRecordData } = useQuery(
    gql`
      query PatientRecords($address: String!, $recipient: String!) {
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
        address: patientRecord.address,
        recipient: patientId,
      },
    }
  );

  let initialValues = {
    ...profileValues,
    heartRate: 0,
    date: new Date()
  };

  const schemaEncoder = new SchemaEncoder(patientRecord.schema);

  if (patientRecordData && patientRecordData.attestations[0]) {
    const record = schemaEncoder.decodeData(patientRecordData.attestations[0].data);
    const heartRate = record.find(({ name }) => name === "heartRate")?.value.value as
      | number;
    const timestamp = record.find(({ name }) => name === "timestamp")?.value.value as
      | number;

    return {
      schemaEncoder,
      values: {
        ...profileValues,
        heartRate: heartRate === undefined ? initialValues.heartRate : heartRate,
        date: timestamp === undefined ? initialValues.date : new Date(timestamp),
      },
    };
  }

  return { schemaEncoder, values: initialValues };
};
