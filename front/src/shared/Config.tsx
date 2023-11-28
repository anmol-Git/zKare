"use client";
import { PropsWithChildren, createContext, useContext } from "react";

const ConfigContext = createContext({
    eas: {
        contractAddress: "",
        schemas: {
            doctorStudy: {
                address: "",
                schema: ""
            },
            study: {
                address: "",
                schema: ""
            },
            studyPatient: {
                address: "",
                schema: ""
            },
            patientProfile: {
                address: "",
                schema: ""
            },
            patientRecord: {
                address: "",
                schema: ""
            }
        }
    }
});

export const Config = ({ children }: PropsWithChildren) => {
    return <ConfigContext.Provider value={{
        eas: {
            contractAddress: "0x1a5650d0ecbca349dd84bafa85790e3e6955eb84",
            schemas: {
                doctorStudy: {
                    address: "0x41eebd08fbd134e2cdffeac92795b28d1c591275e8baef8b5a9fcd9b8fa2c0ca",
                    schema: "string doctorName,bytes32 studyId"
                },
                study: {
                    address: "0x4e56f643c8049d7f66206f1b6c2f1d5f4ad7927d527bbca09866ad90311c4e79",
                    schema: "string study"
                },
                studyPatient: {
                    address: "0x3d3fe43f73b6b2e287ca51542a4ebbdc37cfc27e232f87a589a35021726730e6",
                    schema: "string patientName,bytes32 studyId"
                },
                patientProfile: {
                    address: "0x9230ad22a493dddf2d41ecb7336f544bec49b1e04e591d9f9916f3c1646bb1d7",
                    schema: "string gender,bool isSmoker,bool isOverweight,string bloodType,string treatment"
                },
                patientRecord: {
                    address: "0xd7ca28ca34ee0a6c54b9f0581fa629dff9d1329d55f6e1d7bc5e620fcc4e6dd1",
                    schema: "string gender,bool isSmoker,bool isOverweight,string bloodType,string treatment,uint32 timestamp,uint16 heartRate"
                }
            }
        }}}>
        {children}
    </ConfigContext.Provider>
}

export const useConfig = () => useContext(ConfigContext);