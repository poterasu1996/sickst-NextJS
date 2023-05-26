import "@stripe/stripe-js";
import Layout from '../components/Layout';
import { AuthProvider } from '../store/auth-context';
import { CartProvider } from "../store/cart-context";
import { AccountProvider } from "../store/account-context";
// import { PaymentProvider } from "../store/payment-context";
import { PaymentProvider } from "../store/payment-contextTS";
import '../styles/index.scss';
import { RecoilRoot } from "recoil";

function MyApp({ Component, pageProps }: any) {

  return (
    <RecoilRoot>
      <AuthProvider>
        <CartProvider>
          <AccountProvider>
            <PaymentProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </PaymentProvider>
          </AccountProvider>
        </CartProvider>
      </AuthProvider>
    </RecoilRoot>
  )
}

export default MyApp
