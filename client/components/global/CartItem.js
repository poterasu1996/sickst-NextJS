import { useState, useContext } from "react";
import { Button, Spinner } from "react-bootstrap";
import { X } from "react-feather";
import CartContext from "../../store/cart-context";

const SV_URL = "http://localhost:1337";

const CartItem = ({ item, handleLoading }) => {
    const [loading, setLoading] = useState(false);
    const { cartManager } = useContext(CartContext);

    const thisItemQT = () => {
        const cItem = cartManager.cart.find(elem => elem.product.id === item.product.id);
        return cItem.quantity;
    }

    const orderMinus = () => {
        const remove = 'remove';

        if(thisItemQT() > 1) {
            cartManager.quantityProduct(item, remove);
            setLoading(true);
            handleLoading(true);
        }
    }
    
    const orderPlus = () => {
        const add = 'add';

        setLoading(true);
        handleLoading(true);
        cartManager.quantityProduct(item, add);
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
                        <div className="item-count">{thisItemQT()}</div>
                        <div className="item-add" onClick={orderPlus}></div>
                    </div>
                    <div className="quantity-price">
                        {loading 
                            ? <Spinner animation="border" style={{color: "#cc3663"}}/>
                            : <>Ron {cartManager.productTotal(item)}</>
                        }
                    </div>
                </div>
            </div>
            <Button onClick={() => {
                handleLoading(true);
                cartManager.removeProduct(item);
            }}>
                <X stroke="#cc3663" width={20} height={20} />
            </Button>
        </div>
    );
}

export default CartItem;