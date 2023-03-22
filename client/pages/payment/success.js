import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import PaymentContext from "../../store/payment-context";
import useSWR from 'swr';
import fetcher from '../../lib/utils';
import CartService from "../../shared/services/cartService";

const SuccessPayment = () => { 
    const [cart, setCart] = useState();
    const router = useRouter();
    const { paymentManager } = useContext(PaymentContext);

    const {
        query: { session_id },
    } = useRouter();

    const { data, error } = useSWR(() => `/api/checkout_sessions/${session_id}`,
        fetcher
    )

    // useEffect(() => {
    //     if (data) {
    //         console.log('Payment successfully!')
    //         CartService.clearCart();
    //     }
    // }, [data])

    useEffect(() => {
        CartService.clearCart();

        setTimeout(() => {
            router.push('/');
        }, 5000);
    }, [cart])

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

export default SuccessPayment;