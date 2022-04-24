import Head from 'next/head'
import Footer from './Footer';
import Header from './Header';
import { useRouter } from 'next/router'
import SimpleHeader from './SimpleHeader';

const Layout = ({ children }) => {
    const router = useRouter();

    return (
        <>
            <Head>
                <meta name="keywords" content='Parfumme E-commerce'/>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous"></link>
            </Head>

            {router.pathname !== '/' ? <SimpleHeader /> : <Header />}
            {children}
            <Footer />
        </>
    );
}

export default Layout;