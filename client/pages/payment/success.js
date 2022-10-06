import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import PaymentContext from "../../store/payment-context";

const SuccessPayment = () => { 
    const [cart, setCart] = useState();
    const router = useRouter();
    const { paymentManager } = useContext(PaymentContext);

    useEffect(() => {
        const cartStorage = localStorage.getItem('cart');
        if(cartStorage) {
            setCart(cartStorage);
            paymentManager.removePaymentProducts();
        }

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