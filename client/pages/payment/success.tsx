import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import PaymentContextTS from "../../store/payment-context";
import CartService from "../../shared/services/cartService";
import Cookies from 'cookies';
import { IUserModel } from "../../models/User.model";
import { TxnStatusEnum } from "../../shared/enums/txn.enum";
import { IOrderHistoryModel } from "../../models/OrderHistory.model";
import { ISubscriptionOrderModel, SubscriptionStatusEnum } from "../../models/SubscriptionOrder.model";
import axios from "../../api/axios";
import { IGETUserDetails } from "../../models/UserDetails.model";


interface Props {
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
            let sh: ISubscriptionOrderModel | null = null;
            if(storage) {
                sh = JSON.parse(storage);
            }
            if(sh) {
                sh.txn_status = TxnStatusEnum.SUCCESS;
                sh.subscription_status = SubscriptionStatusEnum.ACTIVE;
                sh.last_payment_date = new Date().toISOString();
                paymentManager?.populateSubscriptionHistory(sh);
                localStorage.removeItem('sh');
            }
        }
    }, [])

    useEffect(() => {
        // populate order-history table
        if(!populateSH) {
            let oh: IOrderHistoryModel | null = null;
    
            const storage = localStorage.getItem('oh');
            if(storage) {
                oh = JSON.parse(storage);
            }
            if(oh) {
                oh.txn_status = TxnStatusEnum.SUCCESS;
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
// daca da, setam subscription status -> success
// facem POST cu subscription_history in tabela
// daca nu, doar stergem cookie pe pagina de cancel
export default SuccessPayment;

const USER_ME = '/users/me';
const USER_DETAILS = '/user-profile-details';

export async function getServerSideProps({ req, res}: any) {
    const cookies = new Cookies(req, res);
    const sh = cookies.get('sh');
    const jwt = cookies.get('jwt');

    let populateSH = false;
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
            const userData: IUserModel = await axios.get(USER_ME, header)
                .then(res => { return res.data})
                .catch(error => console.log(error))

            const userDetails: IGETUserDetails = await axios.get(`${USER_DETAILS}?filters[user_id][$eq]=${userData.id}`, header)
                .then(resp => resp.data.data[0])

            axios.put(`${USER_DETAILS}/${userDetails.id}`, {data: {subscribed: true}}, header)
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