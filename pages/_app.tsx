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
import { ParticleProvider } from "@/contexts/ParticleProvider";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    // <SolanaProvider>
    <ParticleProvider>
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
          <Analytics />
          <Toaster />
        </QueryClientProvider>
      </ChakraProvider>
    </ParticleProvider>
    // </SolanaProvider>
  );
}

export default withGA("G-9478EJWGHV", Router)(MyApp);
