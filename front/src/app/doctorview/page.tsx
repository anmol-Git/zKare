"use client";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useQuery, gql } from "@apollo/client";
import { useEas } from "@/shared/Eas";
import { SchemaEncoder, ZERO_ADDRESS } from "@ethereum-attestation-service/eas-sdk";
import { useConfig } from "@/shared/Config";
import Link from "next/link";
import 'bulma/css/bulma.min.css';
import Banner from "../components/banner"
import ModalButton from "../components/modalButton"
import CreatePatient from "../components/createPatient"
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
    console.log(decodedData);
    return {
      id: attestation.id,
      value: decodedData.find(
        ({ name }) => name === 'study'
    )?.value.value
      };

  });
  
  const patientsDefault = [
    {
        name: "John Doe",
        updated: "12-03-2018",
        dob: "06-10-2002",
        gender: "Male",
        smoker: "True",
        address: "0asdi0asdk0asdaskd0as0dassdlasldas",
        records: [
            {
                updated: "12-03-2018",
                heartRate: "56"
            },
            {
                updated: "01-03-2019",
                heartRate: "60"
            }
        ]
    },
    {
        name: "Jane Doe",
        updated: "12-03-2018",
        dob: "06-10-2002",
        gender: "Female",
        smoker: "False",
        address: "0asdi0asdk0asdaskd0as0dassdlasldas",
        records: [
            {
                updated: "12-03-2018",
                heartRate: "56"
            },
            {
                updated: "01-03-2019",
                heartRate: "60"
            }
        ]
    }
]
  const [patients, setPatients] = useState([])
  // const [patients, setPatients] = useState(patientsDefault)

  

const [filter, setFilter] = useState('');
const [data, setData] = useState(patients);

const filteredData = data.filter((item) =>
  item.name.toLowerCase().includes(filter.toLowerCase())
);

  const handleSave = () => {

    // setData(patients);
  };

  const handleDelete = (patient) => {
    const newData = data.filter(x => x.name !== patient.name);
    setData(newData);
  }

  const [patient, setPatient] = useState('')
  const handlePatient = (patient) => {
    setPatient(patient)
    data.push(patient)
    setData(data)
  }

  const back = {
    backgroundColor: "#ffffff",
    fontColor: "#000000",
    height: "100%",
    padding: "20px",
  };

  const block = {
    padding: "40px",
    marginLeft: "120px",
    backgroundColor: "#ffffff",
  }

  const frame = {
    height: "100%",
    backgroundColor: "#ffffff",
  }

  return (

    <div style={frame}>
        <div style={back}>
            <Banner></Banner>
        
        <div style={block}>
        <div className="columns">
            <div className="column">
            <h1 className="title has-text-centered">Patients</h1>
            {filteredData.length < 1 ?<h3>Create your first patient.</h3> : <></>}
            {filteredData.map((patient: any) => (
                    <div className="card">
                    <div className="card-content">
                        <div className="content">
                            <div className="columns">
                                <div className="column">
                                    <h2>{patient.name}</h2>
                                    <h3>Last updated: {patient.updated}</h3>
                                </div>
                                <div className="column">
                                    <div className="buttons is-right">
                                        <ModalButton patient={patient}></ModalButton>
                                        <div className="button is-danger" onClick={() => handleDelete(patient)}>
                                            Delete
                                        </div>
                                    </div>
                                </div>

                            </div>
                            
                        </div>
                    </div>
                </div>
            ))}
            </div>
            <div className="column">
            <h1 className="title has-text-centered"></h1>
                <div className="field">
                    <div className="control">
                        <input className="input" value={filter} onChange={(e) => setFilter(e.target.value)} type="text" placeholder="Search Patients"/>
                    </div>
                </div>
                <div className="buttons is-centered">
                    <CreatePatient onSave={() => handleSave(patients)} patients={patients} newPatient={handlePatient}></CreatePatient>
                </div>
            </div>
        </div>
        <ul>
            {studies.map((study: any) => (
            <Link key={study.id} href={`/doctor/study/${study.id}`}>
                <span style={{ color: "white" }}>{study.value}</span>
            </Link>
            ))}
        </ul>
        </div>  
        </div>
    </div>
  );
}
