import Link from "next/link";
import { useContext, useState, useEffect } from "react";
import { Button, Spinner } from "react-bootstrap";

import CartItem from "./CartItem";
import CartContext from "../../store/cart-context";
import AccountContext from "../../store/account-context";
import CartService from "../../shared/services/cartService/index";
import { PaymentEnums } from "../../shared/enums/payment.enums";
import("../../types/CartProduct.interface");

const Cart = (props) => {
  const [loading, setLoading] = useState(true);
  const cartManager = useContext(CartContext);
  const accountManager = useContext(AccountContext);
  const [cart, setCart] = useState(null)
  const [cartTotal, setCartTotal] = useState(0);

  setTimeout(() => {
    setLoading(false);
  }, 500);

  useEffect(() => {
    setCartTotal(CartService.cartTotal());
  }, [CartService.cart])

  return (
    <>
      <div className="side-modal-header">
        <span className="text">Cart</span>
        <Button variant="close" onClick={props.onClick} />
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
                            props.onClick();
                            accountManager.setAccountPageState('subscription');
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
                    {loading ? (
                    <Spinner animation="border" style={{ color: "#cc3663" }} />
                    ) : (
                    <>Ron {cartTotal}</>
                    )}
                </span>
                </div>
                <div className="cart-total">
                <span>Total</span>
                <span className="cart-price">
                    {loading ? (
                    <Spinner animation="border" style={{ color: "#cc3663" }} />
                    ) : (
                    <>Ron {cartTotal}</>
                    )}
                </span>
                </div>
                <Link href="/payment">
                  <a className="button-second" onClick={props.onClick}>Checkout</a>
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
