import "@stripe/stripe-js";
import Layout from "../components/Layout";
import { AuthProvider } from "../store/auth-context";
import { CartProvider } from "../store/cart-context";
import { AccountProvider } from "../store/account-context";
import { PaymentProvider } from "../store/payment-context";
import "../styles/index.scss";
import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: any) {
  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <AuthProvider>
          <CartProvider>
            <AccountProvider>
              <PaymentProvider>
                <>
                  <Layout>
                    <Component {...pageProps} />
                  </Layout>
                  <ReactQueryDevtools initialIsOpen={false} />
                </>
              </PaymentProvider>
            </AccountProvider>
          </CartProvider>
        </AuthProvider>
      </RecoilRoot>
    </QueryClientProvider>
  );
}

export default MyApp;
