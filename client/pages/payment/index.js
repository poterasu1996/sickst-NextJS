import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { X } from "react-feather";
import CouponeForm from "../../components/global/form/CouponeForm";
import CartContext from "../../store/cart-context";
import PaymentContext from "../../store/payment-context";
import { loadStripe } from "@stripe/stripe-js";
import ShippingInformation from "../../components/AccountPage/ShippingInformation";

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
  const { paymentManager } = useContext(PaymentContext);
  const [couponValue, setCouponeValue] = useState();
  const [loading, setLoading] = useState(true);
  const [orderList, setOrderList] = useState();
  const [checkoutOptions, setCheckoutOptions] = useState();

  const orderMinus = (item) => {
    if(item.quantity > 1) {
      // modify product quantity in card + template
      cartManager.quantityProduct(item, 'remove');
    }
  }

  const orderPlus = (item) => {
    cartManager.quantityProduct(item, 'add');
  }

  //test payment context
  // paymentManager.test();

  useEffect(() => {
    if(cartManager.cart.length > 0) {
      const cartList = cartManager.singlePaymentList();   // list from cart
      const items = cartList.map(item =>{                 // item list for stripe
        return {
          price: item.product.attributes.stripe_fullpriceLink,
          quantity: item.quantity
        }
      });

      if(cartList) {
        const cleanProductList = createOrderProductList(cartList);
        const ol = {
          order_type: 'payment',
          product_list: cleanProductList,
          txn_status: false,
        }
        setOrderList(ol);
      }

      const stripeCheckoutOptions = {
        lineItems: [...items],
        mode: "payment",
        successUrl: `${window.location.origin}/payment/success`,
        cancelUrl: `${window.location.origin}/payment/cancel`,
      };

      setCheckoutOptions(stripeCheckoutOptions);
    }
    
  }, [loading, cartManager.cart]);


  function createOrderProductList(data) {
    const orderList = data.map(item => {
      const newData = {
        data: {
          productId: item.product.id,
          brand: item.product.attributes.brand,
          model: item.product.attributes.model,
          quantity: item.quantity,
          price: item.product.attributes.otb_price,          
        }
      }
      return newData;
    });
    return orderList;
  }

  if(orderList) {
    // console.log('orderList: ', orderList)
  }
  const redirectToCheckout = async () => {
    paymentManager.populateOrderHistory(orderList);
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
          <div className="subs-payment-card">
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
          
          <ShippingInformation />
        </div>
      </div>
    </>
  );
};

export default PaymentPage;
