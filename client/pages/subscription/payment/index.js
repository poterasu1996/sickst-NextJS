import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { X } from "react-feather";
import ShipmentForm from "../../../components/auth/ShipmentForm";
import CouponeForm from "../../../components/global/CouponeForm";
import CreditCardForm from "../../../components/SubscriptionPage/CreditCardForm";
import StripeContainer from "../../../components/SubscriptionPage/StripeContainer";
import CartContext from "../../../store/cart-context";
import { loadStripe } from '@stripe/stripe-js';

let stripePromise;

const getStripe = () => {
    // check if there is any stripe instance
    if (!stripePromise) {
        stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
    }

    return stripePromise;
};

const PaymentPage = () => {
    const router = useRouter();
    const { cartManager } = useContext(CartContext);
    const [couponValue, setCouponeValue] = useState();
    const [loading, setLoading] = useState(true);

    const item = {
        price: "price_1KxyVvIdXAYNRuBxDma0iuCv",
        quantity: 1,
    }

    let checkoutOptions;

    useEffect(() => {
        checkoutOptions = {
            lineItems: [item],
            mode: "payment",
            successUrl: `${window.location.origin}/subscription/payment/success`,
            cancelUrl: `${window.location.origin}/subscription/payment/cancel`
        }
        console.log(window.location.origin)
    })

    const redirectToCheckout = async () => {
        console.log("redirectToCheckout");

        const stripe = await getStripe();
        const {error} = await stripe.redirectToCheckout(checkoutOptions);
        console.log("Stripe error", error);
    }

    // useEffect(() => {
    //     if (cartManager.cart && cartManager.cart.length === 0) {
    //         router.push('/');
    //     }
    // })
    
    setTimeout(() => {
        setLoading(false);
    }, 500);

    return (<>
        <div className="main-content-payment">
            <div className="container">
                <div className="left-side">
                    <div className="title">Your monthly subscription</div>
                    <div className="subtitle">Will ship by end of month from our facility</div>
                    {(cartManager.cart && cartManager.cart.length > 0) && 
                        cartManager.cart.map((item, i) => (
                            <div className="cart-item" key={i}>
                                <div className="cart-item-image">
                                    <img src={`${process.env.NEXT_PUBLIC_STRAPI_ROOTURL}` + item.product.attributes.image.data[0].attributes.url}></img>
                                </div>
                                <div className="cart-item-details">
                                    <div className="item-brand">{item.product.attributes.brand}</div>
                                    <div className="item-model">{item.product.attributes.model}</div>
                                    <div className="item-price">
                                        Monthly subscription
                                        <div className="price">RON: {item.product.attributes.subscription_price}</div>
                                    </div>
                                </div>
                                <Button onClick={() => {
                                    // handleLoading(true);
                                    cartManager.removeProduct(item);
                                }}>
                                    <X stroke="#cc3663" width={20} height={20} />
                                </Button>
                            </div>
                        ))
                    }
                    <div className="additional-details">
                        <div className="details">
                            Subscription shipping
                            <div className="price"><b>Free</b></div>
                        </div>
                        <div className="details">
                            Subscription shipping
                            <div className="price"><b>Free</b></div>
                        </div>
                        <div className="details">
                            Subscription discount
                            <div className="price">{  loading
                                ? <Spinner animation="border" style={{color: "#cc3663"}}/>
                                : (couponValue && couponValue.active)
                                    ? <b className="brand-color">- {couponValue.discount}%</b>
                                    : <b>0</b>}
                            </div>
                        </div>
                        <div className="total">
                            Total: { loading
                                ? <Spinner animation="border" style={{color: "#cc3663"}}/>
                                : (couponValue && couponValue.discount)
                                    ? <b className="brand-color ms-4">RON {cartManager.total(couponValue.discount)}</b>
                                    : <b className="brand-color ms-4">RON {cartManager.total()}</b>
                            } 
                        </div>

                        <div className="coupone-code">
                            <CouponeForm couponeValue={(value) => setCouponeValue(value)} loading={(value) => setLoading(value)} />
                        </div>
                    </div>
                </div>
                <div className="right-side">
                    <div className="shipment-title">Shipment details</div>
                    <div className="shipment-details">
                        <ShipmentForm cartTotal={cartManager.cartTotal}/>
                        {/* <CreditCardForm /> */}
                        {/* <StripeContainer /> */}
                        <Button onClick={redirectToCheckout}> Pay</Button>
                    </div>
                </div>
            </div>
        </div>
    </>);
}

export default PaymentPage;