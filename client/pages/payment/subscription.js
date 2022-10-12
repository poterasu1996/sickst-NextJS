import { useContext, useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { X } from "react-feather";
import CouponeForm from "../../components/global/form/CouponeForm";
import CartContext from "../../store/cart-context";

const SubscriptionPage = () => {
    const { cartManager } = useContext(CartContext);
    const [loading, setLoading] = useState(true);
    const [couponValue, setCouponeValue] = useState();
    const [subItem, setSubItem] = useState(null);

    useEffect(() => {
        if (cartManager.cart && cartManager.cart.length > 0) {
            cartManager.cart
                .filter((item) => {
                    if (item.payment === "subscription") {
                        setSubItem(item);
                    }
                })
        }
    }, [cartManager.cart]);
    
    setTimeout(() => {
        setLoading(false);
        console.log('item: ', subItem)
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
                                // handleLoading(true);
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
                                    RON {cartManager.total(couponValue.discount)}
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
                    </div>
                </div>
                
            </div>
        </div>
    </>)
}

export default SubscriptionPage