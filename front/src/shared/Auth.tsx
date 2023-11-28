"use client";

import { useAccount, useConnect, useDisconnect, useNetwork, useSwitchNetwork } from "wagmi";
import { errorsABI, formatError, fundMyAccountOnLocalFork, signMessage } from "@/utils/misc";
import { PropsWithChildren, useEffect, useState } from "react";
import { mumbaiFork } from "@/utils/wagmi";
import { SismoConnectConfig } from "@sismo-core/sismo-connect-react";
import { redirect, usePathname } from 'next/navigation'
import Image from "next/image";

const CHAIN = mumbaiFork;

export const Auth = ({ children }: PropsWithChildren) => {

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { connect, connectors, isLoading, pendingConnector } = useConnect({ onSuccess: () => redirect("/dashboard") });
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const { isConnected, address } = useAccount({
    onConnect: async ({ address }) => address && (await fundMyAccountOnLocalFork(address)),
  });
  const [found, setFound] = useState<boolean>(false);
  const { switchNetworkAsync, switchNetwork } = useSwitchNetwork();

  const pathname = usePathname();

  useEffect(() => {
    if (chain?.id !== CHAIN.id) return setError(`Please switch to ${CHAIN.name} network`);
    setError("");
  }, [chain]);

  if (!isConnected) {

    if (pathname !== "/") {

      redirect("/")

    } else {

      return <>
        {children}
        <div className="top-0 right-0 fixed p-8 px-16">

          {connectors.map((connector) => (
            <button
              className="button is-rounded w-fit font-semibold flex flex-row gap-3 items-center"
              disabled={!connector.ready || isLoading}
              key={connector.id}
              onClick={() => connect({ connector })}
            >
              <span className="pt-0.5"><Image src="/login.svg" alt="img" width={20} height={20} /></span>
              {isLoading && pendingConnector?.id === connector.id
                ? "Connecting..."
                : "Connect your wallet"}
            </button>

            // <button
            //   disabled={!connector.ready || isLoading}
            //   key={connector.id}
            //   onClick={() => connect({ connector })}
            // >
            //   {isLoading && pendingConnector?.id === connector.id
            //     ? "Connecting..."
            //     : "Connect"}
            // </button>
          ))}
        </div>
      </>;



    }
  } else {
    return <>{children}
      <div className="top-0 right-0 fixed p-8 px-16">
        <button
          className="button is-rounded  w-fit font-semibold flex flex-row gap-3 items-center"
          onClick={() => disconnect()}
        >
          <span className="pt-0.5"><Image src="/logout.svg" alt="img" width={20} height={20} /></span>
          Disconnect
        </button>
      </div>
    </>;
  }
}