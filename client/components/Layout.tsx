import Footer from './Footer';
import Header from './Header';
import { useRouter } from 'next/router'
import SimpleHeader from './SimpleHeader';
import SimpleFooter from './SimpleFooter';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react';

type Props = {
    children: JSX.Element
}

const Layout: React.FC<Props> = ({ children }) => {
    const router = useRouter();
    const isLoginOrRegister = router.pathname === '/auth/login' || router.pathname === '/auth/register';

    return (
        <>  
            {
                (router.pathname === '/') 
                    ? <></>
                    : isLoginOrRegister
                        ? <SimpleHeader /> 
                        : <Header />}
            {children}
            <ToastContainer limit={3}/>
            {   (router.pathname === '/')
                ? <></>
                : !isLoginOrRegister
                    ? <Footer /> 
                    : <SimpleFooter />}
        </>
    );
}

export default Layout;