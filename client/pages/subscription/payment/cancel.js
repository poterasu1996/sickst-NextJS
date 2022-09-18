import { useRouter } from "next/router";
import { useEffect } from "react";
import { Button } from "react-bootstrap";

const CancelPayment = () => {
    const router = useRouter();

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