import axios from "axios";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";

const CARD_OPTIONS = {
    iconStyle: 'solid',
    style: {
        base: {
            iconColor: "#c4f0ff",
            color: "#fff",
            fontWeight: 500,
            fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
            fontSize: "16px",
        },
        invalid: {
            iconColor: "#ffc7ee",
            color: "#ffc7ee"
        }
    }
}

const StripePaymentForm = () => {
    const [success, setSuccess] = useState(false);
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (e) => {
        e.preventDefault()
        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement)
        })

        if(!error) {
            try {
                const {id} = paymentMethod
                const response = await axios.post("paymentRoute", {
                    amount: 1000,
                    id
                })
    
                if(response.data.success) {
                    console.log("Successful payment");
                    setSuccess(true);
                }
            } catch (error) {
                console.log("Error", error)
            }
        } else {
            console.log(error.message);
        }
    }


    return (<>
        {!success 
            ? <form onSubmit={handleSubmit}>
                <fieldset className="FormGroup">
                    <CardElement options={CARD_OPTIONS} />    
                </fieldset>
                <button>Pay</button>
            </form>
            : <div>
                <h2>It was that moment when he knew, he FUCKED UP!</h2>
            </div>    
    }
    </>);
}

export default StripePaymentForm;