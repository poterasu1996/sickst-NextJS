import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { X } from "react-feather";
import ShipmentForm from "../../components/auth/ShipmentForm";
import CouponeForm from "../../components/global/CouponeForm";
import CreditCardForm from "../../components/SubscriptionPage/CreditCardForm";
import CartContext from "../../store/cart-context";

const SV_URL = "http://localhost:1337";

const PaymentPage = () => {
    const router = useRouter();
    const { cartManager } = useContext(CartContext);
    const [couponValue, setCouponeValue] = useState();
    const [loading, setLoading] = useState(true);

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
                    <div className="subtitle">Will ship by end of month from our facility</div>{console.log('LEFT CART coupone', couponValue)}
                    {(cartManager.cart && cartManager.cart.length > 0) && 
                        cartManager.cart.map((item, i) => (
                            <div className="cart-item" key={i}>
                                <div className="cart-item-image">
                                    <img src={`${SV_URL}` + item.product.attributes.image.data[0].attributes.url}></img>
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
                        <div className="total">{couponValue && console.log('CM - ', cartManager.total(couponValue.discount))}
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
                    <div className="shipment-details">{console.log(cartManager.cartTotal)}
                        <ShipmentForm cartTotal={cartManager.cartTotal}/>
                        {/* <CreditCardForm /> */}
                    </div>
                </div>
            </div>
        </div>
    </>);
}

export default PaymentPage;