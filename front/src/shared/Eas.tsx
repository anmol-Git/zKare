"use client";
import { EAS, Offchain } from "@ethereum-attestation-service/eas-sdk";
import { useConfig } from "./Config";
import { PublicClient, WalletClient, usePublicClient, useWalletClient } from "wagmi";
import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from "react";
import { ethers, providers } from 'ethers'
import { HttpTransport } from "viem";
 
export function publicClientToProvider(publicClient: PublicClient) {
    const { chain, transport } = publicClient
    const network = {
      chainId: chain.id,
      name: chain.name
      
    }
    if (transport.type === 'fallback')
      return new providers.FallbackProvider(
        (transport.transports as ReturnType<HttpTransport>[]).map(
          ({ value }) => new providers.JsonRpcProvider(value?.url, network),
        ),
      )
    return new providers.JsonRpcProvider(transport.url, network)
  }
   
  /** Hook to convert a viem Public Client to an ethers.js Provider. */
  export function useEthersProvider({ chainId }: { chainId?: number } = {}) {
    const publicClient = usePublicClient({ chainId })

    return useMemo(() => publicClientToProvider(publicClient), [publicClient])
  }
  
export function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient
  const network = {
    chainId: chain.id,
    name: chain.name,
  }
  const provider = new providers.Web3Provider(transport as any, network)
  const signer = provider.getSigner(account.address)
  return signer
}


 
/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: walletClient } = useWalletClient({ chainId })
  
  return useMemo(
    () => (walletClient ? walletClientToSigner(walletClient) : undefined),
    [walletClient],
  )
}

const EasContext = createContext<{ eas: EAS, offchain: Offchain, signer: ethers.providers.JsonRpcSigner }>({
    eas: null as any,
    offchain: null as any,
    signer: null as any
});

export const Eas = ({ children }: PropsWithChildren) => {
    const { eas: { contractAddress } } = useConfig();
    const [instance, setInstance] = useState<EAS | null>(null);
    const [offchain, setOffchain] = useState<Offchain | null>(null);
    const provider = useEthersProvider({ chainId: 420 });
    const signer = useEthersSigner();
    
    
    useEffect(() => {
        if (signer && provider) {
            const eas = new EAS(contractAddress, { signerOrProvider: signer });
            const offchain = new Offchain({
                address: contractAddress,
                chainId: 420,
                version: "0.27",
            }, 1);
            setInstance(eas.connect(signer));
            setOffchain(offchain);
        }
    }, [signer, provider]);

    if (!instance || !offchain || !signer) {
        return null;
    }

    return (<EasContext.Provider value={{eas: instance, offchain, signer }}>
        {children}
    </EasContext.Provider>);

}

export const useEas = () => useContext(EasContext);

