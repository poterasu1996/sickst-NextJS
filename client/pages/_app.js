import "@stripe/stripe-js";
import Layout from '../components/Layout';
import { AuthProvider } from '../store/auth-context';
import { CartProvider } from '../store/cart-context';
import { AccountProvider } from "../store/account-context";
import { PaymentProvider } from "../store/payment-context";
import '../styles/index.scss';

function MyApp({ Component, pageProps }) {

  return (
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
  )
}

export default MyApp
