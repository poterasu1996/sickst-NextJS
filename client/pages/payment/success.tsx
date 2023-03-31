import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import PaymentContextTS from "../../store/payment-contextTS";
import CartService from "../../shared/services/cartService";
import Cookies from 'cookies';
import axios from "axios";
import { IUserInfo } from "../../types/UserInfo.interface";
// import CookiesReact from 'js-cookie';

const USERS = 'http://localhost:1337/api/users'


type Props = {
    populateSH: boolean,
}

const SuccessPayment = ({ populateSH }: Props) => { 
    const router = useRouter();
    const paymentManager = useContext(PaymentContextTS);

    useEffect(() => {
        // populate subscription table
        if (populateSH) {
            // based on this flag, we populate subsHistory table
            const storage = localStorage.getItem('sh'); 
            let sh: any = null;
            if(storage) {
                sh = JSON.parse(storage);
            }
            if(sh) {
                paymentManager?.populateSubscriptionHistory(sh)
            }
        }
    }, [])

    useEffect(() => {
        // populate order-history table
        if(!populateSH) {
            let oh: any = null;
    
            const storage = localStorage.getItem('oh');
            if(storage) {
                oh = JSON.parse(storage);
            }
            if(oh) {
                oh.txn_status = true
                paymentManager?.populateOrderHistory(oh);
                localStorage.removeItem('oh')
            }
        }
    }, [])

    useEffect(() => {
        CartService.clearCart();

        setTimeout(() => {
            router.push('/');
        }, 5000);
    }, [])

    return(
        <>
            <div className="success-payment">
                <div className="title">Multumim ca ai ales Sickst!</div>
                <div className="text">Produsul va fi livrat in cel mai scurt timp.</div>
                <div className="btn-wrapper">
                    <Button className="button-second" onClick={() => router.push('/')}>
                        Pagina principala
                    </Button>
                </div>
            </div>
        </>
    )
}

// server side:
// verificam cookie 'si'
// daca da, setam subscription status -> true
// facem POST cu subscription_history in tabela
// daca nu, doar stergem cookie pe pagina de cancel
export default SuccessPayment;

const USER_ME = 'http://localhost:1337/api/users/me'
export async function getServerSideProps({ req, res}: any) {
    const cookies = new Cookies(req, res);
    const sh = cookies.get('sh');
    const jwt = cookies.get('jwt');

    let populateSH = false;
    let user: any;
    let headerT: any;
    if(sh) {
        // send a populate prop, to populate strapi DB, then delete cookie 
        populateSH = true;
        cookies.set('sh');

        // also, set the user flag as subscribed
        if(jwt) {
            const header = {
                headers: {
                  'Authorization': 'Bearer ' + jwt
                }
            }
            headerT = {...header};
            const userData: IUserInfo = await axios.get(USER_ME, header)
                .then(res => { return res.data})
                .catch(error => console.log(error))
            user = userData.id;

            axios.put(`${USERS}/${userData.id}`, {subscribed: true}, header)
                .then(() => console.log('Successed activating user subscription!'))
                .catch(error => console.log(error))
        }
    }
    return {
        props: {
            populateSH: populateSH,
        }
    }
}