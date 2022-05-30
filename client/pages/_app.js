import "@stripe/stripe-js";
import Layout from '../components/Layout';
import { AuthProvider } from '../store/auth-context';
import { CartProvider } from '../store/cart-context';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import '../styles/index.scss';
import GoogleAuthCallback from "./api/auth/GoogleAuthCallback";

function MyApp({ Component, pageProps }) {

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Route path="/auth/callback/google">
            <GoogleAuthCallback />
          </Route>
          <Route exact path="/">
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </Route>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default MyApp
