import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { Button } from "react-bootstrap";
import PaymentContextTS from "../../store/payment-context";
import Cookies from 'cookies';
import { IOrderHistoryModel } from "../../models/OrderHistory.model";
import { TxnStatusEnum } from "../../shared/enums/txn.enum";
import { ISubscriptionOrderModel, SubscriptionStatusEnum } from "../../models/SubscriptionOrder.model";
import cartService from "../../shared/services/cartService";

interface Props {
    populateSH: boolean,
}

const CancelPayment = ({ populateSH }: Props) => {
    const router = useRouter();
    const paymentManager = useContext(PaymentContextTS);

    useEffect(() => {
        // populate subscription table
        if(populateSH) {
            const storage = localStorage.getItem('sh'); 
            let sh: ISubscriptionOrderModel | null = null;
            if(storage) {
                sh = JSON.parse(storage);
            } 
            if(sh) {
                sh.txn_status = TxnStatusEnum.FAILED;
                sh.subscription_status = SubscriptionStatusEnum.CANCELLED;
                sh.last_payment_date = null;
                paymentManager?.populateSubscriptionHistory(sh);
                localStorage.removeItem('sh');
            }
        }
    }, [])

    useEffect(() => {
        if(!populateSH) {
            let oh: IOrderHistoryModel | null = null;

            const storage = localStorage.getItem('oh');
            if(storage) {
                oh = JSON.parse(storage);
            }
            if(oh) {
                oh.txn_status = TxnStatusEnum.FAILED;
                paymentManager?.populateOrderHistory(oh);
                localStorage.removeItem('oh');
            }
        }
    }, []);

    useEffect(() => {
        // cartService.clearCart();

        setTimeout(() => {
            router.push('/');
        }, 5000);
    }, [])

    return(
        <>
            <div className="success-payment">
                <div className="title">Oops! A intervenit o problema.</div>
                <div className="text">Plata nu a fost efectuata! <br></br>In curand vei fi trimis catre pagina principala.</div>
                <div className="btn-wrapper">
                    <Button className="button-second" onClick={() => router.push('/')}>
                        Pagina principala
                    </Button>
                </div>
            </div>
        </>
    )
}

export default CancelPayment;

export async function getServerSideProps({req, res}: any) {
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