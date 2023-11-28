"use client";

import Image from "next/image";
import "./globals.css";
import 'bulma/css/bulma.min.css';
import { SismoConnectButton } from "@sismo-core/sismo-connect-react";
import { useAccount } from "wagmi";
import { fundMyAccountOnLocalFork } from "@/utils/misc";
import Banner from "./components/banner";

export default function App() {

  const { isConnected, address } = useAccount({
    onConnect: async ({ address }) => address && (await fundMyAccountOnLocalFork(address)),
  });

  return (

    <div className="flex flex-col w-screen h-screen p-8 px-16">

      <nav className="flex flex-row items-center justify-start w-full">
        <Banner></Banner>
      </nav>

      <main className="flex flex-row justify-between h-full items-center">

        <div className="flex flex-col gap-10">
          <span className="text-5xl text-left">
            Zero Knowledge based healthcare data <br /> distribution.
          </span>


          {isConnected && (
            <a href="/dashboard">
              <button className="button is-rounded is-medium w-fit font-semibold flex flex-row gap-3 items-center">
                <span className="pt-0.5"><Image src="/login.svg" alt="img" width={20} height={20} /></span>
                Go to your dashboard
              </button>
            </a>
          )}

          {/* <div className="w-fit">
            <SismoConnectButton config={config}
              claim={{ groupId: "0x42c768bb8ae79e4c5c05d3b51a4ec74a" }}
            />
          </div> */}

        </div>

        <Image src="/undraw_medical_care_movn.svg" alt="img" width={600} height={600} />
      </main>

    </div>

  )
}