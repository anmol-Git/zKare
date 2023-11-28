"use client";
import {
	useAccount
  } from "wagmi";
  import { useQuery, gql } from "@apollo/client";
  import { useEas } from "@/shared/Eas";
  import { SchemaEncoder, ZERO_ADDRESS } from "@ethereum-attestation-service/eas-sdk";
  import { useConfig } from "@/shared/Config";
import { useState } from "react"
import DoctorDashboard from "../components/dashboards/doctorDashboard";
import ResearcherDashboard from "../components/dashboards/researcherDashboard";
import Image from "next/image";
import CanvasJSReact from '@canvasjs/react-charts';
import Banner from "../components/banner";


import { Collapse, Text, Grid, Button } from "@nextui-org/react";

export default function Dashboard() {
	var CanvasJS = CanvasJSReact.CanvasJS;
	var CanvasJSChart = CanvasJSReact.CanvasJSChart;

	const overweightSmoker = [
		{ x: new Date(2017, 0), y: 90 },
		{ x: new Date(2017, 1), y: 94 },
		{ x: new Date(2017, 2), y: 95 },
		{ x: new Date(2017, 3), y: 95 },
		{ x: new Date(2017, 4), y: 96 },
		{ x: new Date(2017, 5), y: 101 },
	];
	const smoker = [
		{ x: new Date(2017, 0), y: 82 },
		{ x: new Date(2017, 1), y: 86 },
		{ x: new Date(2017, 2), y: 91 },
		{ x: new Date(2017, 3), y: 91 },
		{ x: new Date(2017, 4), y: 93 },
		{ x: new Date(2017, 5), y: 94 },
	];
	const overweight = [
		{ x: new Date(2017, 0), y: 90 },
		{ x: new Date(2017, 1), y: 91 },
		{ x: new Date(2017, 2), y: 92 },
		{ x: new Date(2017, 3), y: 91 },
		{ x: new Date(2017, 4), y: 92 },
		{ x: new Date(2017, 5), y: 94 },
	];
	const healthy = [
		{ x: new Date(2017, 0), y: 72 },
		{ x: new Date(2017, 1), y: 72 },
		{ x: new Date(2017, 2), y: 73 },
		{ x: new Date(2017, 3), y: 69 },
		{ x: new Date(2017, 4), y: 70 },
		{ x: new Date(2017, 5), y: 70 },
	]
	const [graphData, setGraphData] = useState(healthy);

	const options = {
		animationEnabled: true,
		title:{
			text: "Resting Heart Rate Over Time"
		},
		axisX: {
			valueFormatString: "MMM"
		},
		axisY: {
			title: "Resting Heart Rate (BPM)",
			prefix: ""
		},
		data: [{
			yValueFormatString: "### bpm",
			xValueFormatString: "MMMM",
			type: "spline",
			dataPoints: graphData
		}]
	}

	type userType = "doctor" | "researcher"
// 	const [studyName, setStudyName] = useState<string>("");
//   const { eas } = useEas();
//   const { address } = useAccount();
//   const {
//     eas: {
//       schemas: { study },
//     },
//   } = useConfig();

//   const { data: datum, refetch } = useQuery(
//     gql`
//       query MyStudies($address: String!, $attester: String!) {
//         attestations(take: 25, where: { schemaId: { equals: $address }, attester: { equals: $attester } }) {
//           id
//           attester
//           data
//         }
//       }
//     `,
//     {
//       variables: {
//         address: study.address,
//         attester: address,
//       },
//     }
//   );

//   const schemaEncoder = new SchemaEncoder(study.schema);

//   const createStudy = async () => {
    
//     if (address) {
      
//       const encodedData = schemaEncoder.encodeData([
//         { name: "study", value: studyName, type: 'string' },
//       ]);
      
//       await eas
//         .attest({
//           schema: study.address,
//           data: {
//             recipient: ZERO_ADDRESS,
//             revocable: true,
//             data: encodedData,
//           },
//         })
//         .then((tx) => tx.wait())
//         .then(() => {
//             setStudyName('');
//             refetch();
//         })
//         .catch(console.error);
//     }
//   };

//   const handleStudyNameChange = (e: any) => {
//     setStudyName(e.target.value);
//   };

//   const studiez = (datum?.attestations || []).map((attestation: any) => {
//     const decodedData = schemaEncoder.decodeData(attestation.data);
//     return {
//       id: attestation.id,
//       value: decodedData.find(
//         ({ name }) => name === 'study'
//     )?.value.value
//       };

//   });

  	const mockData = [
		{
			name: "Cardiovascular Health",
			description: "A study comparing resting heart rate with common metrics.",
			patients: [
				{
					isSmoker: 'True',
					isOverweight: 'True',
					bloodType: "O-",
					records: [
						{
							date: "1",
							heartRate: "60",
						},
						{
							date: "2",
							heartRate: "67",
						},
						{
							date: "3",
							heartRate: "68",
						},
						{
							date: "4",
							heartRate: "70",
						},
						{
							date: "5",
							heartRate: "71",
						},
						{
							date: "6",
							heartRate: "71",
						}
					]
				},
				{
					isSmoker: 'False',
					isOverweight: 'True',
					bloodType: "A",
					records: [
						{
							date: "1",
							heartRate: "65",
						},
						{
							date: "2",
							heartRate: "66",
						},
						{
							date: "3",
							heartRate: "67",
						},
						{
							date: "4",
							heartRate: "67",
						},
						{
							date: "5",
							heartRate: "68",
						},
						{
							date: "6",
							heartRate: "69",
						}
					]
				},
				{
					isSmoker: 'True',
					isOverweight: 'False',
					bloodType: "O-",
					records: [
						{
							date: "1",
							heartRate: "70",
						},
						{
							date: "2",
							heartRate: "71",
						},
						{
							date: "3",
							heartRate: "72",
						},
						{
							date: "4",
							heartRate: "72",
						},
						{
							date: "5",
							heartRate: "76",
						},
						{
							date: "6",
							heartRate: "77",
						}
					]
				},
				{
					isSmoker: 'False',
					isOverweight: 'False',
					bloodType: "O-",
					records: [
						{
							date: "1",
							heartRate: "55",
						},
						{
							date: "2",
							heartRate: "56",
						},
						{
							date: "3",
							heartRate: "55",
						},
						{
							date: "4",
							heartRate: "54",
						},
						{
							date: "5",
							heartRate: "55",
						},
						{
							date: "6",
							heartRate: "55",
						}
					]
				}
			]
		}
	]

	const [typeOfUser, setTypeOfUser] = useState<userType>("doctor");
	// const [studies, setStudies] = useState([]);
	const [studies, setStudies] = useState(mockData);

	const [showGraph, setShowGraph] = useState(false);
	const handleGraph = () => {
		setShowGraph(!showGraph);
	}
	// const [studies, setStudies] = useState<{
	// 	name: string,
	// 	description: string,
	// 	options: {
	// 		gender: string,
	// 		isSmoker: boolean,
	// 		isOverweight: boolean,
	// 		bloodType: string,
	// 		treatment: string,
	// 		timestamp: string,
	// 		heartRate: number,
	// 	}
	// }[]>([]);
	const handleCSV = () => {
		const csvData = mockData.toString(); // Replace with your CSV data
		const blob = new Blob([csvData], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = 'data.csv'; // Replace with your desired file name
		link.click();
	}

	const graphHandler = () => {
		if (isOverweight && isSmoker){
			setGraphData(overweightSmoker);
		} else if (isOverweight && !isSmoker){
			setGraphData(overweight);
		} else if (!isOverweight && isSmoker){
			setGraphData(smoker);
		} else {
			setGraphData(healthy);
		}
	}
	let [isSmoker, setIsSmoker] = useState(false);
	const smokerHandler = () => {
		isSmoker = !isSmoker;
		setIsSmoker(isSmoker);
		graphHandler()
	}
	let [isOverweight, setIsOverweight] = useState(false);
	const overweightHandler = () => {
		isOverweight = !isOverweight;
		setIsOverweight(isOverweight)
		graphHandler();
	}

	return (
		<div className="flex flex-col items-center min-h-screen p-8 px-16">
			<nav className="flex flex-row items-center justify-start w-full">
				<Banner></Banner>
			</nav>

			{/* {typeOfUser === "doctor" ?
				(<DoctorDashboard></DoctorDashboard>) :
				(<ResearcherDashboard></ResearcherDashboard>)
			} */}

			<div className="flex flex-row gap-20 justify-between w-full h-full pt-12">

				<div className="flex flex-col w-full justify-start">
					<Grid.Container gap={2} className="w-full">
						<Grid className="w-full">
							<Text h3>My Studies</Text>

							<Collapse.Group splitted className="w-full">
								{studies.length ? studies.map((study, index) => {
									return (
										<Collapse title={study.name} index={index}>
											<Text>{study.description}</Text>
											<Button onClick={handleGraph}>Toggle Graph</Button>
										</Collapse>
									)
								}) : (
									<div className="flex flex-col gap-4">
										<Text >You don't have any studies yet. Create one using the button below</Text>
										<a href="/studies" className="w-fit">
											<Button size={"sm"} css={{ background: "Black" }}>Create study</Button>
										</a>
									</div>
								)}
							</Collapse.Group>
						</Grid>
					</Grid.Container>
				</div>
				{!showGraph ? <Image src="/undraw_doctors_p6aq 2.svg" alt="img" width={500} height={500} /> : (
				<>
				<CanvasJSChart options = {options}></CanvasJSChart>
				<div className="box is-large">

				<h3>Classifications</h3>
				<div className="field">
					<div className="control">
						<label className="checkbox is-normal">
						<input type="checkbox" 
						onChange={smokerHandler}
						/>
							&nbsp;Smoker
						</label>
					</div>
				</div>
				<div className="field">
					<div className="control">
						<label className="checkbox is-normal">
						<input type="checkbox" 
						onChange={overweightHandler}
						/>
							&nbsp;Overweight
						</label>
					</div>
				</div>
				<div onClick={handleCSV} className="button is-info">Download CSV</div>
				</div>
				

				</>
				
				)}
				
				
			</div>
		</div >
	)
}
