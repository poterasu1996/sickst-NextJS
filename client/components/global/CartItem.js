import { useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { X } from "react-feather";

const CartItem = ({ item, listTotal, onOrderPrice }) => {
    const [count, setCount] = useState(1);
    const [loading, setLoading] = useState(false);

    const orderMinus = () => {
        if(count > 1) {
            setCount(count - 1);
            setLoading(true);
            onOrderPrice(listTotal - parseInt(item.price));
        }
    }
    
    const orderPlus = () => {
        setCount(count + 1);
        setLoading(true);
        onOrderPrice(listTotal + parseInt(item.price));
    }

    setTimeout(() => {
        setLoading(false);
    }, 500);

    return (
        <div className="cart-item">
            <div className="cart-item-image">
                <img src={item.image.src}></img>
            </div>
            <div className="cart-item-details">
                <div className="item-brand">{item.brand}</div>{listTotal}
                <div className="item-model">{item.model}</div>
                <div className="item-type">{item.type}</div>
                <div className="item-quantity">
                    <div className="quantity-buttons">
                        <div className="item-remove" onClick={orderMinus}></div>
                        <div className="item-count">{count}</div>
                        <div className="item-add" onClick={orderPlus}></div>
                    </div>
                    <div className="quantity-price">
                        {loading 
                            ? <Spinner animation="border" style={{color: "#cc3663"}}/>
                            : <>Ron {item.price * count}</>
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