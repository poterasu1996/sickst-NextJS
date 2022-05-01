import Link from "next/link";
import { useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { X } from "react-feather";

import img1 from "../../public/img/creed-aventus.jpg";
import img2 from "../../public/img/dolce-gabbana-the-one-for-men.jpg";
import CartItem from "./CartItem";

const Cart = (props) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const itemList = [
        {
            "brand": "Pink Sugar",
            "model": "Pink Sugar by Aquolina",
            "image": img1,
            "type": "Eau de Toilette",
            "price": "60",
        },
        {
            "brand": "Dior",
            "model": "Sauvage",
            "image": img2,
            "type": "Eau de Parfumme",
            "price": "80",
        },
    ]

    const listPrice = () => {
        let total = 0;
        itemList.forEach(element => {
            total = total + parseInt(element.price);
        });
        return total;
    }

    const [orderPrice, setOrderPrice] = useState(listPrice);

    function listTotal(item) {
        setOrderPrice(item);
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
            <div className="mid-menu">
                <div className="cart-list">
                    {/* ITEM */}
                    {(itemList.length > 0) 
                        ? itemList.map((item, i) => (
                            <CartItem key={i} item={item} listTotal={orderPrice} onOrderPrice={(itemPrice) => listTotal(itemPrice)}/>
                        ))
                        : <div>Your cart is empty</div>
                    }
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
            <Link href="/account/register">
                <a className="button-second">Checkout</a>
            </Link>
            
        </div>
    </>);
}

export default Cart;