import React from "react"; // Add this line
import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import theme from "@/styles/theme";
import "../styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { SolanaProvider } from "@/contexts/SolanaProvider";
import { Toaster } from "react-hot-toast";
import Router from "next/router";
import withGA from "next-ga";
import { Analytics } from "@vercel/analytics/react";
// import { ParticleProvider } from "@/contexts/ParticleProvider";
import {
  AuthCoreContextProvider,
  PromptSettingType,
} from "@particle-network/auth-core-modal";
import { Solana } from "@particle-network/chains";
import { AuthType } from "@particle-network/auth-core";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    // <SolanaProvider>
    <AuthCoreContextProvider
      options={{
        projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
        clientKey: process.env.NEXT_PUBLIC_CLIENT_KEY!,
        appId: process.env.NEXT_PUBLIC_APP_ID!,
        authTypes: [AuthType.phone],
        themeType: "dark",
        fiatCoin: "USD",
        language: "en",
        promptSettingConfig: {
          promptPaymentPasswordSettingWhenSign: PromptSettingType.first,
          promptMasterPasswordSettingWhenLogin: PromptSettingType.first,
        },
        wallet: {
          visible: false,
          customStyle: {
            supportChains: [Solana],
          },
        },
      }}
    >
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
          <Analytics />
          <Toaster />
        </QueryClientProvider>
      </ChakraProvider>
    </AuthCoreContextProvider>
    // </SolanaProvider>
  );
}

export default withGA("G-9478EJWGHV", Router)(MyApp);
