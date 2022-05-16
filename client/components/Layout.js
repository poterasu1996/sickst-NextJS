import Head from 'next/head'
import Footer from './Footer';
import Header from './Header';
import { useRouter } from 'next/router'
import SimpleHeader from './SimpleHeader';
import SimpleFooter from './SimpleFooter';

const Layout = ({ children }) => {
    const router = useRouter();

    return (
        <>
            <Head>
                <meta name="keywords" content='Parfumme E-commerce'/>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossOrigin="anonymous"></link>
            </Head>

            {(router.pathname === '/account/login' || router.pathname === '/account/register') ? <SimpleHeader /> : <Header />}
            {children}

            {(router.pathname !== '/account/login' && router.pathname !== '/account/register') ? <Footer /> : <SimpleFooter />}
        </>
    );
}

export default Layout;