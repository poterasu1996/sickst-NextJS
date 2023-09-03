import { loadStripe } from "@stripe/stripe-js";


let stripePromise = null;

const getStripe = () => {
    if(!stripePromise) {
        process.env.NEXT_PUBLIC_STRIPE_KEY && (stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY));
    }

    return stripePromise;
}

export default getStripe;