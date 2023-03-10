import { UseInkathonProvider, alephzeroTestnet } from "@scio-labs/use-inkathon";
import { getDeployments } from "@/deployments";
import { AppPropsWithLayout } from "@/types/Layout";
import { ChakraProvider } from "@chakra-ui/react";
import { Inconsolata } from "next/font/google";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import { env } from "@/config/enviroment";
import AppServices from "@/AppServices";

const inconsolata = Inconsolata({
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <main className={inconsolata.className}>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        {/* Set Font Variables */}
        <style>{`
        :root {
          --font-inconsolata: ${inconsolata.style.fontFamily}, 'Inconsolata';
        }
      `}</style>
      </Head>
      <UseInkathonProvider
        appName="agritrace"
        connectOnInit={true}
        defaultChain={env.defaultChain || alephzeroTestnet}
        deployments={getDeployments()}
      >
        <ChakraProvider>
          <AppServices>{getLayout(<Component {...pageProps} />)}</AppServices>
        </ChakraProvider>
        <Toaster />
      </UseInkathonProvider>
    </main>
  );
}
