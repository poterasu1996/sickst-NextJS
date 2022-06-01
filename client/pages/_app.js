import "@stripe/stripe-js";
import Layout from '../components/Layout';
import { AuthProvider } from '../store/auth-context';
import { CartProvider } from '../store/cart-context';
import '../styles/index.scss';

function MyApp({ Component, pageProps }) {

  return (
    <AuthProvider>
      <CartProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
      </CartProvider>
    </AuthProvider>
  )
}

export default MyApp
