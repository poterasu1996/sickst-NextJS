import "@stripe/stripe-js";
import Layout from '../components/Layout';
import { AuthProvider } from '../store/auth-context';
import { CartProvider } from '../store/cart-context';
import { AccountProvider } from "../store/account-context";
import '../styles/index.scss';

function MyApp({ Component, pageProps }) {

  return (
    <AuthProvider>
      <CartProvider>
        <AccountProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AccountProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default MyApp
