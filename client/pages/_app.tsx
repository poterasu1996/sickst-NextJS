import "@stripe/stripe-js";
import Layout from "../components/Layout";
import { AuthProvider } from "../store/auth-context";
import { CartProvider } from "../store/cart-context";
import { AccountProvider } from "../store/account-context";
import "../styles/index.scss";
import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createTheme, ThemeProvider } from "@mui/material";

const queryClient = new QueryClient();

const customTheme = createTheme({
  palette: {
    primary: {
      main: '#cc3633'
    }
  }
})


function MyApp({ Component, pageProps }: any) {
  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <AuthProvider>
          <CartProvider>
            <AccountProvider>
                <>
                  <Layout>
                    <ThemeProvider theme={customTheme}>
                      <Component {...pageProps} />
                    </ThemeProvider>
                  </Layout>
                  <ReactQueryDevtools initialIsOpen={false} />
                </>
            </AccountProvider>
          </CartProvider>
        </AuthProvider>
      </RecoilRoot>
    </QueryClientProvider>
  );
}

export default MyApp;
