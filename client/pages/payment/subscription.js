import { useContext, useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { X } from "react-feather";
import CouponeForm from "../../components/global/form/CouponeForm";
import AccountContext from "../../store/account-context";
import CartContext from "../../store/cart-context";
import { loadStripe } from "@stripe/stripe-js";

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
    const [loading, setLoading] = useState(true);
    const [couponValue, setCouponeValue] = useState();
    const [subItem, setSubItem] = useState(null);
    const [shippingList, setShippingList] = useState();
    const [checkoutOptions, setCheckoutOptions] = useState({});

    useEffect(() => {
        if(accountManager.currentUser) {
            accountManager.fetchShippingList()
                .then(resp => {
                    setShippingList(resp[0].attributes.shipping_info_list);
                })
                .catch(error => console.log('Shipping list error: ', error))
        }
    }, [accountManager.currentUser])

    useEffect(() => {
        if (cartManager.subsList && cartManager.subsList.length > 0) {
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
        }
    }, [cartManager.subsList]);

    async function checkout() {
        const stripe = await getStripe();
        const { error } = await stripe.redirectToCheckout(checkoutOptions);
        console.log("Stripe error", error);
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
                
                <div className="shipping-info">
                <div className="title">Shipping information</div>
                <div className="info">All shipping updates MUST be made 1 day prior to your next billing date in order to receive your next product at the new address.</div>
                <div className="address-list">
                    {shippingList && shippingList.map((item, index) => (
                    <div className={`address-card ${item.primary ? "active" : ""}`} key={index}>
                            <div className="card-info">
                                <div className="card-info--name">{item.first_name} {item.last_name}</div>
                                <div className="card-info--address">{item.address}, apt. {item.appartment}, {item.city}, {item.county}</div>
                            </div>
                            {item.primary && <div className="ribbon">Primary</div>}
                        </div>
                    ))}
                    <div className="new-address" onClick={() => setShow(preVal => !preVal)}>
                        <i className="pi pi-plus" style={{'fontSize': '1.8rem'}}/>
                        <span>Add a new address</span>
                    </div>
                </div>
            </div>
            </div>
        </div>
    </>)
}

export default SubscriptionPage