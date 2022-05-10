import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripePaymentForm from "../global/StripePaymentForm";

const PUBLIC_KEY = "pk_test_51KxbtMIdXAYNRuBxfZ7rtAja4wetgA73RkMB8GF9ZEZP4HLPyztZqYpzsN62jJVtbZXTAgP01E3NTMGmlEBVCJwP00QNspUWQm";

const stripeTestPromise = loadStripe(PUBLIC_KEY);

const StripeContainer = () => {
    return (<>  
        <Elements stripe={stripeTestPromise}>
            <StripePaymentForm />
        </Elements>
    </>);
}

export default StripeContainer;