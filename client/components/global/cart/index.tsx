import Link from "next/link";
import { useContext, useState } from "react";

// Components
import CartItem from "./CartItem";
import CloseIcon from "@mui/icons-material/Close";
import { CircularProgress, IconButton } from "@mui/material";

// Storage & services
import AccountContext from "../../../store/account-context";
import CartService from "../../../services/cartService/index";
import { PaymentEnums } from "../../../shared/enums/payment.enums";

// Hooks
import { useCart } from "../../../features/cart/hooks/useCart";

type Props = {
  onClick: () => void
}

const Cart = ({ onClick }: Props) => {
  const [loading, setLoading] = useState(true);
  const accountManager = useContext(AccountContext);

  useCart();

  setTimeout(() => {
    setLoading(false);
  }, 500);

  return (
    <>
      <div className="side-modal-header">
        <span className="text">Cart</span>
        <IconButton onClick={onClick} size="medium"><CloseIcon /></IconButton>
      </div>
      <div className="side-modal-body">
        {/* ITEM */}
        {CartService.cart ? (
          <>
            <div className="mid-menu custom-sb custom-sb-y">
              <div className="cart-list">
                {CartService.cart.find(
                  (el) => el.payment === PaymentEnums.SUBSCRIPTION
                ) && (
                  <>
                    <div className="cart-list-title">Monthly subscription</div>
                    <div className="cart-list-subs">
                      {CartService.cart
                        .filter((item, i) => { 
                          if(i === 0) {
                            return item.payment === PaymentEnums.SUBSCRIPTION
                          } 
                          return
                        })
                        .map((item, i) => (
                          <CartItem
                            key={i}
                            item={item}
                            handleLoading={setLoading}
                          />
                        ))}
                      
                      <Link href="/account">
                        <a 
                          className="button-second" 
                          onClick={() => {
                            onClick();
                            accountManager!.setAccountPageState('subscription');
                          }}
                        >My subscriptions</a>
                      </Link>

                    </div>
                  </>
                )}
                {CartService.cart.find((el) => el.payment === PaymentEnums.FULL_PAYMENT) && (
                  <>
                    <div className="cart-list-title">Your order</div>
                    <div className="cart-list-otb">
                      {CartService.cart
                        .filter((item) => item.payment === PaymentEnums.FULL_PAYMENT)
                        .map((item, i) => (
                          <CartItem
                            key={i}
                            item={item}
                            handleLoading={setLoading}
                          />
                        ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            {CartService.cart.find((el) => el.payment === PaymentEnums.FULL_PAYMENT) 
            && <div className="cart-total-wrapper">
                <div className="cart-subtotal">
                <span>Subtotal</span>
                <span className="cart-price">
                    {loading 
                      ? <CircularProgress size={'1.8rem'} color="primary" thickness={7} />
                      : <>Ron {CartService.cartTotal()}</>
                    }
                </span>
                </div>
                <div className="cart-total">
                <span>Total</span>
                <span className="cart-price">
                    {loading 
                      ? <CircularProgress size={'1.8rem'} color="primary" thickness={7} /> 
                      : <>Ron {CartService.cartTotal()}</>
                    }
                </span>
                </div>
                <Link href="/payment">
                  <a className="button-second" onClick={onClick}>Checkout</a>
                </Link>
            </div>}
            
          </>
        ) : (
          <div className="cart-empty">Your cart is empty</div>
        )}
      </div>
    </>
  );
};

export default Cart;
