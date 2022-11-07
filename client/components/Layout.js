import Footer from './Footer';
import Header from './Header';
import { useRouter } from 'next/router'
import SimpleHeader from './SimpleHeader';
import SimpleFooter from './SimpleFooter';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = ({ children }) => {
    const router = useRouter();

    return (
        <>
            {(router.pathname === '/account/login' || router.pathname === '/account/register') ? <SimpleHeader /> : <Header />}
            {children}
            <ToastContainer limit={3}/>
            {(router.pathname !== '/account/login' && router.pathname !== '/account/register') ? <Footer /> : <SimpleFooter />}
        </>
    );
}

export default Layout;