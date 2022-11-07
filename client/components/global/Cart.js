import Link from "next/link";
import { useContext, useState } from "react";
import { Button, Spinner } from "react-bootstrap";

import CartItem from "./CartItem";
import CartContext from "../../store/cart-context";
import AccountContext from "../../store/account-context";

const Cart = (props) => {
  const [loading, setLoading] = useState(true);
  const { cartManager } = useContext(CartContext);
  const { accountManager } = useContext(AccountContext);

  setTimeout(() => {
    setLoading(false);
  }, 500);

  return (
    <>
      <div className="side-modal-header">
        <span className="text">Cart</span>
        <Button variant="close" onClick={props.onClick} />
      </div>
      <div className="side-modal-body">
        {/* ITEM */}
        {cartManager.cart.length > 0 ? (
          <>
            <div className="mid-menu custom-sb custom-sb-y">
              <div className="cart-list">
                {cartManager.cart.find(
                  (el) => el.payment === "subscription"
                ) && (
                  <>
                    <div className="cart-list-title">Monthly subscription</div>
                    <div className="cart-list-subs">
                      {cartManager.cart
                        .filter((item, i) => { 
                          if(i === 0) {
                            return item.payment === "subscription"
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
                {cartManager.cart.find((el) => el.payment === "otb") && (
                  <>
                    <div className="cart-list-title">Your order</div>
                    <div className="cart-list-otb">
                      {cartManager.cart
                        .filter((item) => item.payment === "otb")
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
            {cartManager.cart.find((el) => el.payment === 'otb') && <div className="cart-total-wrapper">
                <div className="cart-subtotal">
                <span>Subtotal</span>
                <span className="cart-price">
                    {loading ? (
                    <Spinner animation="border" style={{ color: "#cc3663" }} />
                    ) : (
                    <>Ron {cartManager.total()}</>
                    )}
                </span>
                </div>
                <div className="cart-total">
                <span>Total</span>
                <span className="cart-price">
                    {loading ? (
                    <Spinner animation="border" style={{ color: "#cc3663" }} />
                    ) : (
                    <>Ron {cartManager.total()}</>
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
