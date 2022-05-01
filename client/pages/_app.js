import { useState } from 'react';
import Layout from '../components/Layout';
import { AuthProvider } from '../store/auth-context';
import '../styles/index.scss';

function MyApp({ Component, pageProps }) {

  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  )
}

export default MyApp
