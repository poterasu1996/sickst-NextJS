import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";

import CartItem from "./CartItem";
import CartContext from "../../store/cart-context";

const Cart = (props) => {
    const [loading, setLoading] = useState(true);
    const [orderPrice, setOrderPrice] = useState();
    const { cartManager } = useContext(CartContext);

    useEffect(() => {
        const listPrice = () => {
            let total = 0;
            cartManager.cart && cartManager.cart.forEach(element => {
                total = total + parseInt(element.attributes.subscription_price);
            });
            return total;
        }
        setOrderPrice(listPrice);
    }, [cartManager.cart])

    const listTotal = (item) => {
        setOrderPrice();
        setLoading(true);
    }

    setTimeout(() => {
        setLoading(false);
    }, 500);

    return (<>
        <div className="side-modal-header">
            <span className="text">Cart</span>
            <Button variant="close" onClick={props.onClick} />
        </div>
        <div className="side-modal-body">
            {/* ITEM */}
            {(cartManager.cart && cartManager.cart.length > 0) 
                ? <>
                    <div className="mid-menu">
                        <div className="cart-list">
                                {cartManager.cart.map((item, i) => (
                                    <CartItem key={i} item={item} listTotal={orderPrice} onOrderPrice={(item) => listTotal(item)}/>
                                ))}
                                
                            <div className="cart-subtotal">
                                <span>Subtotal</span>
                                <span className="cart-price">
                                {loading 
                                    ? <Spinner animation="border" style={{color: "#cc3663"}}/>
                                    : <>Ron {orderPrice}</>
                                }
                                </span>
                            </div>
                            <div className="cart-total">
                                <span>Total</span>
                                <span className="cart-price">
                                {loading 
                                    ? <Spinner animation="border" style={{color: "#cc3663"}}/>
                                    : <>Ron {orderPrice}</>
                                }
                                </span>
                            </div>
                        </div>
                    </div>
                    <Link href="/subscription/payment">
                        <a className="button-second">Checkout</a>
                    </Link>
                </> 
                : <div className="cart-empty">Your cart is empty</div>
            }
        </div>
    </>);
}

export default Cart;