import { useState, Dispatch, SetStateAction } from "react";

// Components
import { CircularProgress, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// Store & services
import CartService from "../../../shared/services/cartService";
import ICartProduct from "../../../shared/types/cart/cart-product.interface";
import { PaymentEnums } from "../../../shared/enums/payment.enums";

// Hooks
import { updateCart } from "../../../features/cart/hooks/useCart";

type Props = {
    item: ICartProduct,
    handleLoading: Dispatch<SetStateAction<boolean>>
}

const CartItem = ({ item, handleLoading }: Props) => {
    const [loading, setLoading] = useState(false);      // for loading spinner effect

    const orderMinus = () => {
        if(item.quantity > 1) {
            setLoading(true);
            handleLoading(true);
            CartService.quantityProduct(item, 'remove');
            updateCart();
        }
    }

    const orderPlus = () => {
        setLoading(true);
        handleLoading(true);
        CartService.quantityProduct(item, 'add');
        updateCart();
    }

    const handleDeleteCartProduct = () => {
        handleLoading(true);
        CartService.removeProduct(item);
        updateCart();
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
                        <div className="item-count">{item.quantity}</div>
                        <div className="item-add" onClick={orderPlus}></div>
                    </div>}
                    {item.payment === PaymentEnums.FULL_PAYMENT
                        ? <div className="quantity-price">
                            {loading 
                                ? <CircularProgress size={'2rem'} color="primary" thickness={7} />
                                : <>Ron {item.product.attributes.otb_price * item.quantity}</>
                            }
                          </div>
                        : <div className="quantity-price">
                            {loading 
                                ? <CircularProgress size={'2rem'} color="primary" thickness={7} />
                                : <b>{item.product.attributes.subscription_type}</b>
                            }
                        </div>
                    }
                </div>
            </div>
            <IconButton 
                sx={{
                    color: '#cc3663',
                    width: '24px',
                    height: '24px',
                    [`& svg`]: {
                        width: '20px',
                        height: '20px'
                    }
                }}
                onClick={handleDeleteCartProduct} 
                size="medium"
            ><CloseIcon /></IconButton>
        </div>
    );
}

export default CartItem;