import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import theme from "@/styles/theme";
import "../styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SolanaProvider } from "@/contexts/SolanaProvider";
import { Toaster } from "react-hot-toast";
import Router from "next/router";
import withGA from "next-ga";
import { Analytics } from "@vercel/analytics/react";
import { AuthType } from "@particle-network/auth-core";
import { Solana } from "@particle-network/chains";
import {
  AuthCoreContextProvider,
  PromptSettingType,
} from "@particle-network/auth-core-modal";
import dynamic from "next/dynamic";

const queryClient = new QueryClient();

// Dynamically import to avoid SSR issues
const NoSSRAuthCoreContextProvider = dynamic(
  () => Promise.resolve(AuthCoreContextProvider),
  { ssr: false }
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NoSSRAuthCoreContextProvider
      options={{
        projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
        clientKey: process.env.NEXT_PUBLIC_CLIENT_KEY!,
        appId: process.env.NEXT_PUBLIC_APP_ID!,
        authTypes: [AuthType.email, AuthType.google, AuthType.twitter],
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
      <SolanaProvider>
        <ChakraProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <Component {...pageProps} />
            <Analytics />
            <Toaster />
          </QueryClientProvider>
        </ChakraProvider>
      </SolanaProvider>
    </NoSSRAuthCoreContextProvider>
  );
}

export default withGA("G-9478EJWGHV", Router)(MyApp);
