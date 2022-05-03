import { useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { X } from "react-feather";

const SV_URL = "http://localhost:1337";

const CartItem = ({ item, listTotal, onOrderPrice }) => {
    const [count, setCount] = useState(1);
    const [loading, setLoading] = useState(false);

    const orderMinus = () => {
        if(count > 1) {
            setCount(count - 1);
            setLoading(true);
            onOrderPrice(listTotal - parseInt(item.attributes.price));
        }
    }
    
    const orderPlus = () => {
        setCount(count + 1);
        setLoading(true);
        onOrderPrice(listTotal + parseInt(item.attributes.price));
    }

    setTimeout(() => {
        setLoading(false);
    }, 500);

    return (
        <div className="cart-item">
            <div className="cart-item-image">
                <img src={`${SV_URL}` + item.attributes.image.data[0].attributes.url}></img>
            </div>
            <div className="cart-item-details">
                <div className="item-brand">{item.attributes.brand}</div>
                <div className="item-model">{item.attributes.model}</div>
                <div className="item-type">{item.attributes.type}</div>
                <div className="item-quantity">
                    <div className="quantity-buttons">
                        <div className="item-remove" onClick={orderMinus}></div>
                        <div className="item-count">{count}</div>
                        <div className="item-add" onClick={orderPlus}></div>
                    </div>
                    <div className="quantity-price">
                        {loading 
                            ? <Spinner animation="border" style={{color: "#cc3663"}}/>
                            : <>Ron {item.attributes.price * count}</>
                        }
                    </div>
                </div>
            </div>
            <Button>
                <X stroke="#cc3663" width={20} height={20} />
            </Button>
        </div>
    );
}

export default CartItem;