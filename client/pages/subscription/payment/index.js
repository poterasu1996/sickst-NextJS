import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { X } from "react-feather";
import ShipmentForm from "../../../components/auth/ShipmentForm";
import CouponeForm from "../../../components/global/CouponeForm";
import CartContext from "../../../store/cart-context";
import { loadStripe } from "@stripe/stripe-js";

let stripePromise;

const getStripe = () => {
  // check if there is any stripe instance
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
  }

  return stripePromise;
};

const PaymentPage = () => {
  const router = useRouter();
  const { cartManager } = useContext(CartContext);
  const [couponValue, setCouponeValue] = useState();
  const [loading, setLoading] = useState(true);
  const [disablePayment, setDisablePayment] = useState(true);

  const orderMinus = (item) => {
    if(item.quantity > 1) {
      // modify product quantity in card + template
      cartManager.quantityProduct(item, 'remove');
    }
  }

  const orderPlus = (item) => {
    cartManager.quantityProduct(item, 'add');
  }

  let checkoutOptions;

  useEffect(() => {
    if(cartManager.cart.length > 0) {
      // enable payment button
      setDisablePayment(false);
      const items = cartManager.singlePaymentList().map(item =>{
        return {
          price: item.product.attributes.stripe_fullpriceLink,
          quantity: item.quantity
        }
      });
      checkoutOptions = {
        lineItems: [...items],
        mode: "payment",
        successUrl: `${window.location.origin}/subscription/payment/success`,
        cancelUrl: `${window.location.origin}/subscription/payment/cancel`,
      };
    }
    
  }, [loading, cartManager.cart]);

  const redirectToCheckout = async () => {
    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout(checkoutOptions);
  };

  setTimeout(() => {
    setLoading(false);
  }, 500);


  return (
    <>
      <div className="main-content-payment">
        <div className="container">
          <div className="left-side">
            <div className="title">Your monthly subscription</div>
            <div className="subtitle">
              Will ship by end of month from our facility
            </div>
            {cartManager.cart && cartManager.cart.length > 0 ? (
              cartManager.cart.filter(item => {
                  if(item.payment === 'otb') {
                    return item;
                  }
                })
                .map((item, i) => (
                <div className="cart-item" key={i}>
                  <div className="cart-item-image">
                    <img
                      src={
                        `${process.env.NEXT_PUBLIC_STRAPI_ROOTURL}` +
                        item.product.attributes.image.data[0].attributes.url
                      }
                    ></img>
                  </div>
                  <div className="cart-item-details">
                    <div className="item-brand">
                      {item.product.attributes.brand}
                    </div>
                    <div className="item-model">
                      {item.product.attributes.model}
                      <div className="item-quantity">
                        <div className="item-remove" onClick={() => orderMinus(item)}></div>
                        <div className="item-count">{item.quantity}</div>
                        <div className="item-add" onClick={() => orderPlus(item)}></div>
                      </div>
                    </div>
                    <div className="item-price">
                      Pret
                      <div className="price">
                        RON: {item.product.attributes.otb_price}
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      // handleLoading(true);
                      setLoading(true);
                      cartManager.removeProduct(item);
                    }}
                  >
                    <X stroke="#cc3663" width={20} height={20} />
                  </Button>
                </div>
              ))
            ) : (
              <div className="cart-empty">Your cart is empty</div>
            )}
            <div className="additional-details">
              <div className="details">
                Pret Transport
                <div className="price">
                  <b>Free</b>
                </div>
              </div>
              <div className="details">
                Discount
                <div className="price">
                  {loading ? (
                    <Spinner animation="border" style={{ color: "#cc3663" }} />
                  ) : couponValue && couponValue.active ? (
                    <b className="brand-color">- {couponValue.discount}%</b>
                  ) : (
                    <b>0</b>
                  )}
                </div>
              </div>
              <div className="total">
                Total:{" "}
                {loading ? (
                  <Spinner animation="border" style={{ color: "#cc3663" }} />
                ) : couponValue && couponValue.discount ? (
                  <b className="brand-color ms-4">
                    RON {cartManager.total(couponValue.discount)}
                  </b>
                ) : (
                  <b className="brand-color ms-4">RON {cartManager.total()}</b>
                )}
              </div>

              <div className="coupone-code">
                <CouponeForm
                  couponeValue={(value) => setCouponeValue(value)}
                  loading={(value) => setLoading(value)}
                />
              </div>
            </div>
          </div>
          <div className="right-side">
            <div className="shipment-title">Shipment details</div>
            <div className="shipment-details">
              <ShipmentForm cartTotal={cartManager.cartTotal} />
              <Button onClick={redirectToCheckout} disabled={disablePayment}> Pay</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;
