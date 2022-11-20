import { useState, useContext } from "react";
import { Button, Spinner } from "react-bootstrap";
import { X } from "react-feather";
import CartContext from "../../store/cart-context";

const CartItem = ({ item, handleLoading }) => {
    const [loading, setLoading] = useState(false);      // for loading spinner effect
    const cartManager = useContext(CartContext);

    const orderMinus = () => {
        if(item.quantity > 1) {
            setLoading(true);
            handleLoading(true);
            cartManager.quantityProduct(item, 'remove');
        }
    }

    const orderPlus = () => {
        setLoading(true);
        handleLoading(true);
        cartManager.quantityProduct(item, 'add');
    }

    // get the product details from cart context
    const getProdFromCart = () => {
        return cartManager.cart.find(elem => elem.cartId === item.cartId);
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
                {item.payment === 'otb' && <div className="item-brand">{item.product.attributes.brand}</div>}
                <div className="item-model">
                    {item.payment === 'otb'
                        ? item.product.attributes.model
                        : 'Monthly subscription'
                    }
                </div>
                <div className="item-type">
                    {item.payment === 'otb'
                        ? item.product.attributes.type
                        : '8 ml (1 product/month)'
                    }
                </div>
                <div className="item-quantity">
                    {item.payment === 'otb' && <div className="quantity-buttons">
                        <div className="item-remove" onClick={orderMinus}></div>
                        <div className="item-count">{getProdFromCart().quantity}</div>
                        <div className="item-add" onClick={orderPlus}></div>
                    </div>}
                    {item.payment === 'otb'
                        ? <div className="quantity-price">
                            {loading 
                                ? <Spinner animation="border" style={{color: "#cc3663"}}/>
                                : <>Ron {item.product.attributes.otb_price * getProdFromCart().quantity}</>
                            }
                          </div>
                        : <div className="quantity-price">
                            {loading 
                                ? <Spinner animation="border" style={{color: "#cc3663"}}/>
                                : <>Ron {item.product.attributes.subscription_price * getProdFromCart().quantity}</>
                            }
                        </div>
                    }
                </div>
            </div>
            <Button onClick={() => {
                handleLoading(true);
                cartManager.removeProduct(item);
                cartManager.setRefresh(preVal => !preVal);
            }}>
                <X stroke="#cc3663" width={20} height={20} />
            </Button>
        </div>
    );
}

export default CartItem;