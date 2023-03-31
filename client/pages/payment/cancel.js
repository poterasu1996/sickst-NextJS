import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { Button } from "react-bootstrap";
import PaymentContext from "../../store/payment-context";
import AuthContext from "../../store/auth-context";

const CancelPayment = () => {
    const router = useRouter();
    const { paymentManager } = useContext(PaymentContext);
    const authManager = useContext(AuthContext);

    useEffect(() => {
        if(authManager.auth) {
            const oh = JSON.parse(localStorage.getItem('oh'));
            if(oh) {
                paymentManager.populateOrderHistory(oh);
            }
        }
    }, [authManager.auth])

    useEffect(() => {
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