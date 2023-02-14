import "@/styles/globals.css";
import { Poppins } from "@next/font/google";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "styled-components";
import { theme } from "../styles/theme";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

const poppins = Poppins({ weight: "200", subsets: ["latin"] });
export const queryClient = new QueryClient();

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <main className={poppins.className}>
              <Component {...pageProps} />
              <ToastContainer />
            </main>
          </ThemeProvider>
        </QueryClientProvider>
      </SessionProvider>
    </LocalizationProvider>
  );
}
