import { gql, useQuery } from "@apollo/client";
import { useConfig } from "./Config";
import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";

export const usePatientProfileData = (patientId: string) => {
  const {
    eas: {
      schemas: { patientProfile },
    },
  } = useConfig();

  const { data: patientProfileData } = useQuery(
    gql`
      query PatientProfile($address: String!, $recipient: String!) {
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
        address: patientProfile.address,
        recipient: patientId,
      },
    }
  );

  let initialValues = {
    gender: "female",
    isSmoker: false,
    isOverweight: false,
    bloodType: "A+",
    treatment: "",
  };

  const schemaEncoder = new SchemaEncoder(patientProfile.schema);

  if (patientProfileData && patientProfileData.attestations[0]) {
    const profile = schemaEncoder.decodeData(patientProfileData.attestations[0].data);

    const gender = profile.find(({ name }) => name === "gender")?.value.value as string | undefined;
    const isSmoker = profile.find(({ name }) => name === "isSmoker")?.value.value as
      | boolean
      | undefined;
    const isOverweight = profile.find(({ name }) => name === "isOverweight")?.value.value as
      | boolean
      | undefined;
    const bloodType = profile.find(({ name }) => name === "bloodType")?.value.value as
      | string
      | undefined;
    const treatment = profile.find(({ name }) => name === "treatment")?.value.value as
      | string
      | undefined;

    return {
      schemaEncoder,
      values: {
        gender: gender === undefined ? initialValues.gender : gender,
        isSmoker: isSmoker === undefined ? initialValues.isSmoker : isSmoker,
        isOverweight: isOverweight === undefined ? initialValues.isOverweight : isOverweight,
        bloodType: bloodType === undefined ? initialValues.bloodType : bloodType,
        treatment: treatment === undefined ? initialValues.treatment : treatment,
      },
    };
  }

  return { schemaEncoder, values: initialValues };
};
