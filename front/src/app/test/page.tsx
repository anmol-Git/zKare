"use client";
import { useState } from "react";
import { useContractRead, useContractWrite, useNetwork, usePrepareContractWrite } from "wagmi";
import { transactions } from "../../../../broadcast/ZKare.s.sol/420/run-latest.json";
import { abi as ZKareABI } from "../../../../abi/ZKare.json";
import { errorsABI } from "@/utils/misc";

export default function Test() {
    const [studyName, setStudyName] = useState<string>("");
    const { chain } = useNetwork();
    const contractCallInputs =
    studyName && chain
      ? {
          address: transactions[0].contractAddress as `0x${string}}`,
          abi: [...ZKareABI, ...errorsABI],
          functionName: "createStudy",
          args: [studyName],
          chain,
        }
      : {};
    const { config: writeConfig, error: wagmiSimulateError } = usePrepareContractWrite(contractCallInputs);
    
    const { writeAsync } = useContractWrite(writeConfig);

    const { data, error } = useContractRead({
        abi: [...ZKareABI],
        address: transactions[0].contractAddress as `0x${string}}`,
        functionName: 'studyCounter'
    });

    const createStudy = () => {
        writeAsync?.();
    }

    const handleStudyNameChange = (e: any) => {

        setStudyName(e.target.value);
        
    }

    return <div>
        <input onChange={handleStudyNameChange} value={studyName} />
        <button onClick={createStudy}>Create Study</button>
    </div>
}