import { WalletError } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { FC, ReactNode, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  BackpackWalletAdapter,
  ParticleAdapter,
  ParticleAdapterConfig,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";

const ReactUIWalletModalProviderDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletModalProvider,
  { ssr: false }
);

require("@solana/wallet-adapter-react-ui/styles.css");

export const ParticleProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const endpoint = process.env.NEXT_PUBLIC_ENDPOINT;

  const wallets = useMemo(() => {
    const particleConfig: ParticleAdapterConfig = {
      config: {
        projectId: "a54076a8-8c47-4055-8090-30ba53356593",
        clientKey: "cYy4WdR9w5DfBsoWvmGsSQFWPADTffgIaCrDtZzk",
        appId: "a49face1-9729-4464-90b1-51cd85c0604f",
        chainName: "solana",
        chainId: 101,
        // authUrl: "https://bouncebackreloaded.r3x.tech/",
      },
    };

    return [new ParticleAdapter(particleConfig)];
  }, []);

  const onError = useCallback((error: WalletError) => {
    console.error("Wallet error: " + error);
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint as string}>
      <WalletProvider wallets={wallets} onError={onError}>
        <ReactUIWalletModalProviderDynamic>
          {children}
        </ReactUIWalletModalProviderDynamic>
      </WalletProvider>
    </ConnectionProvider>
  );
};
