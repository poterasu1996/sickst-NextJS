import { useContext, useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { X } from "react-feather";
import CouponeForm from "../../components/global/form/CouponeForm";
import AccountContext from "../../store/account-context";
import CartContext from "../../store/cart-context";
import { loadStripe } from "@stripe/stripe-js";
import ShippingInformation from "../../components/AccountPage/ShippingInformation";
import AuthContext from "../../store/auth-context";

let stripePromise;

const getStripe = () => {
  // check if there is any stripe instance
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
  }
  return stripePromise;
};

const SubscriptionPage = () => {
    const { cartManager } = useContext(CartContext);
    const { accountManager } = useContext(AccountContext);
    const { auth } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [couponValue, setCouponeValue] = useState();
    const [subItem, setSubItem] = useState(null);
    const [shippingList, setShippingList] = useState();
    const [checkoutOptions, setCheckoutOptions] = useState({});

    useEffect(() => {
        if (auth && cartManager.subsList && cartManager.subsList.length > 0) {
            setSubItem(cartManager.subsList[0]);
            const item = {
                price: cartManager.subsList[0].product.attributes.stripe_subsLink,
                quantity: 1, 
            };
            setCheckoutOptions({
                lineItems: [item],
                mode: "subscription",
                successUrl: `${window.location.origin}/payment/success`,
                cancelUrl: `${window.location.origin}/payment/cancel`,
            })
            console.log('auth: ', auth)
        }
    }, [cartManager.subsList]);


    useEffect(() => {
        if(accountManager.currentUser) {
            setCheckoutOptions({
                ...checkoutOptions,
                customerEmail: accountManager.currentUser.email
            })
        }
    }, [accountManager.currentUser])

    const options = {
        // passing the client secret obtained from the server
        clientSecret: `${process.env.NEXT_PUBLIC_STRIPE_KEY}`
    };


    async function checkout() {
        const stripe = await getStripe();
        const { error, resp } = await stripe.redirectToCheckout(checkoutOptions);
        // console.log("Stripe resp", resp);
        // console.log("Stripe error", error);
    }

    setTimeout(() => {
        setLoading(false);
    }, 500);

    return (<>
        <div className="main-content-payment">
            <div className="container">
                <div className="subs-payment-card">
                    <div className="title">Your monthly subscription</div>
                    <div className="subtitle">
                        Will ship by end of month from our facility
                    </div>
                    {subItem ? (
                    <div className="cart-item" key={subItem.cartId}>
                        <div className="cart-item-image">
                            <img
                                src={
                                    `${process.env.NEXT_PUBLIC_STRAPI_ROOTURL}` +
                                    subItem.product.attributes.image.data[0].attributes.url
                                }
                            ></img>
                        </div>
                        <div className="cart-item-details">
                            <div className="item-brand">
                                {subItem.product.attributes.brand}
                            </div>
                            <div className="item-model">
                                {subItem.product.attributes.model}
                            </div>
                            <div className="item-price">
                                Pret
                                <div className="price">
                                    RON: {subItem.product.attributes.subscription_price}
                                </div>
                            </div>
                        </div>
                        <Button
                            onClick={() => {
                                setLoading(true);
                                cartManager.removeProduct(subItem);
                            }}
                        >
                            <X stroke="#cc3663" width={20} height={20} />
                        </Button>
                    </div> ) : (
                        <div className="cart-empty">Your cart is empty</div>
                    )}
                    <div className="additional-details">
                        <div className="details">
                            Pret Transport
                            <div className="price">
                                <b>Free</b>
                            </div>
                        </div>
                        <div className="details">
                            Discount
                            <div className="price">
                            {loading ? (
                                <Spinner animation="border" style={{ color: "#cc3663" }} />
                            ) : couponValue && couponValue.active ? (
                                <b className="brand-color">- {couponValue.discount}%</b>
                            ) : (
                                <b>0</b>
                            )}
                            </div>
                        </div>
                        <div className="total">
                            Total:{" "}
                            {loading ? (
                                <Spinner animation="border" style={{ color: "#cc3663" }} />
                            ) : couponValue && couponValue.discount ? (
                                <b className="brand-color ms-4">
                                    RON {cartManager.subscriptionTotal(subItem, couponValue.discount)}
                                </b>
                            ) : (
                                <b className="brand-color ms-4">RON {cartManager.productTotal(subItem)}</b>
                            )}
                        </div>

                        <div className="coupone-code">
                            <CouponeForm
                                couponeValue={(value) => setCouponeValue(value)}
                                loading={(value) => setLoading(value)}
                            />
                        </div>
                        <button className="button-second mt-5" onClick={() => checkout()}>Pay</button>
                    </div>
                </div>
                
                <ShippingInformation />

            </div>
        </div>
    </>)
}

export default SubscriptionPage