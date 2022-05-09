import { useState, useContext } from "react";
import { Button, Spinner } from "react-bootstrap";
import { X } from "react-feather";
import CartContext from "../../store/cart-context";

const SV_URL = "http://localhost:1337";

const CartItem = ({ item, listTotal, onOrderPrice }) => {
    const [count, setCount] = useState(1);
    const [loading, setLoading] = useState(false);
    const { cartManager } = useContext(CartContext);

    const orderMinus = () => {
        if(count > 1) {
            setCount(count - 1);
            setLoading(true);
            onOrderPrice(listTotal - parseInt(item.product.attributes.subscription_price));
        }
    }
    
    const orderPlus = () => {
        setCount(count + 1);
        setLoading(true);
        onOrderPrice(listTotal + parseInt(item.product.attributes.subscription_price));
    }

    setTimeout(() => {
        setLoading(false);
    }, 500);

    return (
        <div className="cart-item">
            <div className="cart-item-image">
                <img src={`${SV_URL}` + item.product.attributes.image.data[0].attributes.url}></img>
            </div>
            <div className="cart-item-details">
                <div className="item-brand">{item.product.attributes.brand}</div>
                <div className="item-model">{item.product.attributes.model}</div>
                <div className="item-type">{item.product.attributes.type}</div>
                <div className="item-quantity">
                    <div className="quantity-buttons">
                        <div className="item-remove" onClick={orderMinus}></div>
                        <div className="item-count">{count}</div>
                        <div className="item-add" onClick={orderPlus}></div>
                    </div>
                    <div className="quantity-price">
                        {loading 
                            ? <Spinner animation="border" style={{color: "#cc3663"}}/>
                            : <>Ron {item.product.attributes.subscription_price * count}</>
                        }
                    </div>
                </div>
            </div>
            <Button onClick={() => {
                const removePrice = parseInt(item.product.attributes.subscription_price) * count;
                console.log('remove price: ', removePrice);
                console.log('list price: ', listTotal - removePrice);
                onOrderPrice(listTotal - removePrice);
                cartManager.removeProduct(item);
            }}>
                <X stroke="#cc3663" width={20} height={20} />
            </Button>
        </div>
    );
}

export default CartItem;