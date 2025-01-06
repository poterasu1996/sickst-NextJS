import { useRouter } from "next/router";
import { useEffect } from "react";
import { Button } from "react-bootstrap";
import CartService from "../../shared/services/cartService";
import { TxnStatusEnum } from "../../shared/enums/txn.enum";
import { IOrderHistoryModel } from "../../models/OrderHistory.model";
import { ISubscriptionOrderModel, SubscriptionStatusEnum } from "../../models/SubscriptionOrder.model";

// @ts-ignore
import Cookies from 'cookies';
import userService from "../../shared/services/userService";
import stripeService from "../../shared/services/stripeService";
import useGetJWT from "../../shared/hooks/auth/useGetJWT";
import orderService from "../../shared/services/orderService";
import { AppUtils } from "../../shared/utils/app.utils";
import subscriptionService from "../../shared/services/subscriptionService";


interface Props {
    populateSH: boolean,
}

const SuccessPayment = ({ populateSH }: Props) => { 
    const router = useRouter();
    const { token } = useGetJWT(); 

    async function updateUserSubscriptionInfo(subName: string) {
        const uDetailsID = await userService.getUserDetailsID();
        await userService.updateUserSubscription(uDetailsID, subName);
    }

    useEffect(() => {
        // populate subscription table
        if (populateSH && token) {
            // based on this flag, we populate subsHistory table
            const storage = localStorage.getItem('sh'); 
            let sh: ISubscriptionOrderModel | null = null;
            if(storage) {
                sh = JSON.parse(storage);
            }
            if(sh && token) {
                (async () => {
                    const sesId = await stripeService.getSessionDetails(sh.session_id);
                    sh.txn_status = TxnStatusEnum.SUCCESS;
                    sh.subscription_status = SubscriptionStatusEnum.ACTIVE;
                    sh.last_payment_date = new Date().toISOString();
                    sh.expire_date = AppUtils.getNextBillingDate(new Date().toISOString());
                    sh.strapi_subscription_id = sesId.subscription;
                    subscriptionService.populateSubscriptionHistory(sh)
                        .then(() => AppUtils.toastNotification('Te-ai abonat cu succes!', true))
                    updateUserSubscriptionInfo(sh.subscription_name);
                    localStorage.removeItem('sh');
                })()
            }
        }
    }, [token])

    useEffect(() => {
        // populate order-history table
        if(!populateSH && token) {
            let oh: IOrderHistoryModel | null = null;
    
            const storage = localStorage.getItem('oh');
            if(storage) {
                oh = JSON.parse(storage);
            }
            if(oh) {
                oh.txn_status = TxnStatusEnum.SUCCESS;
                orderService.populateOrderHistory(oh)
                    .then(() => AppUtils.toastNotification('Comanda a fost plasata cu succes!', true))
                localStorage.removeItem('oh')
            }
        }
    }, [token])

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
// verificam cookie 'sh'
// daca da, setam subscription status -> success
// facem POST cu subscription_history in tabela
// daca nu, doar stergem cookie pe pagina de cancel
export default SuccessPayment;

export async function getServerSideProps({ req, res}: any) {
    const cookies = new Cookies(req, res);
    const sh = cookies.get('sh');
    
    let populateSH = false;
    if(sh) {
        // send a populate prop, to populate strapi DB, then delete cookie 
        populateSH = true;
        cookies.set('sh');
    }
    return {
        props: {
            populateSH: populateSH,
        }
    }
}