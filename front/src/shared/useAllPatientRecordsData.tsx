import { ApolloQueryResult, gql, useQuery } from "@apollo/client";
import { useConfig } from "./Config";
import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { orderBy } from 'lodash';
interface Record {
  id: string;
  gender?: string;
  heartRate?: number;
  date?: Date;
  isOverweight?: boolean;
  isSmoker?: boolean;
  bloodType?: string;
  treatment?: string;

}
export const useAllPatientRecordsData = (patientId: string): { values: Record[], schemaEncoder: SchemaEncoder, refetch: (variables?: Partial<{
  address: string;
  recipient: string;
}> | undefined) => Promise<ApolloQueryResult<any>>} => {
  
  const {
    eas: {
      schemas: { patientRecord },
    },
  } = useConfig();

  const { data: patientRecordData, refetch } = useQuery(
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

  const schemaEncoder = new SchemaEncoder(patientRecord.schema);

  if (patientRecordData && patientRecordData.attestations) {

    return {
      schemaEncoder,
      values: orderBy(
        patientRecordData.attestations.map(
        (attestation: any) => {
          
          const record = schemaEncoder.decodeData(attestation.data);
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

          const value: Record = {
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
      }), (val) => val.date, ['desc']),
      refetch
    };
  }

  return { schemaEncoder, values: [] as Record[], refetch };
};
