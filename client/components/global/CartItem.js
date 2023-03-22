import { useState, useContext } from "react";
import { Button, Spinner } from "react-bootstrap";
import { X } from "react-feather";
import CartService from "../../shared/services/cartService";
import { PaymentEnums } from "../../shared/enums/payment.enums";
import CartContext from "../../store/cart-context";

const CartItem = ({ item, handleLoading }) => {
    const [loading, setLoading] = useState(false);      // for loading spinner effect
    const cartManager = useContext(CartContext);
    const orderMinus = () => {
        if(item.quantity > 1) {
            setLoading(true);
            handleLoading(true);
            CartService.quantityProduct(item, 'remove');
            cartManager.setRefresh(!cartManager.refresh);
        }
    }

    const orderPlus = () => {
        setLoading(true);
        handleLoading(true);
        CartService.quantityProduct(item, 'add');
        cartManager.setRefresh(!cartManager.refresh);
    }

    // get the product details from cart context
    const getProdFromCart = () => {
        return CartService.cart.find((elem) => elem.cartProductId === item.cartProductId);
    }

    setTimeout(() => {
        setLoading(false);
    }, 500);

    return (
        <div className="cart-item">
            <div className="cart-item-image">
                <img src={`${process.env.NEXT_PUBLIC_STRAPI_ROOTURL}` + item.product.attributes.image.data[0].attributes.url}></img>
            </div>
            <div className="cart-item-details">
                {item.payment === PaymentEnums.FULL_PAYMENT && <div className="item-brand">{item.product.attributes.brand}</div>}
                <div className="item-model">
                    {item.payment === PaymentEnums.FULL_PAYMENT
                        ? item.product.attributes.model
                        : 'Monthly subscription'
                    }
                </div>
                <div className="item-type">
                    {item.payment === PaymentEnums.FULL_PAYMENT
                        ? item.product.attributes.type
                        : '8 ml (1 product/month)'
                    }
                </div>
                <div className="item-quantity">
                    {item.payment === PaymentEnums.FULL_PAYMENT && <div className="quantity-buttons">
                        <div className="item-remove" onClick={orderMinus}></div>
                        <div className="item-count">{getProdFromCart().quantity}</div>
                        <div className="item-add" onClick={orderPlus}></div>
                    </div>}
                    {item.payment === PaymentEnums.FULL_PAYMENT
                        ? <div className="quantity-price">
                            {loading 
                                ? <Spinner animation="border" style={{color: "#cc3663"}}/>
                                : <>Ron {item.product.attributes.otb_price * getProdFromCart().quantity}</>
                            }
                          </div>
                        : <div className="quantity-price">
                            {loading 
                                ? <Spinner animation="border" style={{color: "#cc3663"}}/>
                                : <b>{item.product.attributes.subscription_type}</b>
                            }
                        </div>
                    }
                </div>
            </div>
            <Button onClick={() => {
                handleLoading(true);
                CartService.removeProduct(item);
                cartManager.setRefresh(!cartManager.refresh);
            }}>
                <X stroke="#cc3663" width={20} height={20} />
            </Button>
        </div>
    );
}

export default CartItem;