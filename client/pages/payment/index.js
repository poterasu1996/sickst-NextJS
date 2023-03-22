import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { X } from "react-feather";
import CouponeForm from "../../components/global/form/CouponeForm";
import CartContext from "../../store/cart-context";
import PaymentContext from "../../store/payment-context";
import { loadStripe } from "@stripe/stripe-js";
import ShippingInformation from "../../components/AccountPage/ShippingInformation";
import CartService from "../../shared/services/cartService/index";
import axios from "axios";
import { PaymentEnums } from "../../shared/enums/payment.enums";

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
  const cartManager = useContext(CartContext);
  const { paymentManager } = useContext(PaymentContext);
  const [couponValue, setCouponeValue] = useState();
  const [loading, setLoading] = useState(true);
  const [orderHistory, setOrderHistory] = useState();
  const [lineItems, setLineItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  const orderMinus = (item) => {
    if(item.quantity > 1) {
      // modify product quantity in card + template
      setLoading(true);
      CartService.quantityProduct(item, 'remove');
      cartManager.setRefresh(preVal => !preVal);
    }
  }

  const orderPlus = (item) => {
    setLoading(true);
    CartService.quantityProduct(item, 'add');
    cartManager.setRefresh(preVal => !preVal);
  }

  // console.log('CartService: ', CartService)  // merge service-ul

  useEffect(() => {
    if(CartService.cart) {
      const cartList = CartService.singlePaymentList();   // list from cart
      setCartItems([...cartList]);

      const items = cartList.map(item =>{                 // item list for stripe
        return {
          price: item.product.attributes.stripe_fullpriceLink,
          quantity: item.quantity
        }
      });
      setLineItems([...items]);

      // if(cartList) {
      //   const cleanProductList = createOrderProductList(cartList);
      //   const ol = {
      //     session_id: '-1',
      //     order_type: 'payment',
      //     total: CartService.cartTotal(),
      //     product_list: cleanProductList,
      //     txn_status: false,
      //   }
      //   setOrderList(ol);
      // }
    } 
  }, [loading, CartService.cart]);


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

  if(orderHistory) {
    console.log('orderList: ', orderHistory)
  }

  const redirectToCheckout = async () => {
    // create stripe checkout, pass line items to the body
    const { 
      data: {id}, 
    } = await axios.post('/api/checkout_sessions', {
      items: [...lineItems],
    });


    if(cartItems.length > 0) {
      const cleanProductList = createOrderProductList(cartItems);
      const oh = {
        session_id: id,
        order_type: 'payment',
        total: CartService.cartTotal(),
        product_list: cleanProductList,
        txn_status: false,
      }
      setOrderHistory(oh);
      localStorage.setItem('oh', JSON.stringify(oh));
    }

    debugger
    // redirect to checkout
    // const stripe = await getStripe();
    // await stripe.redirectToCheckout({ sessionId: id });
  }

  // const redirectToCheckout = async () => {
  //   console.log('orderList: ', orderList)
  //   paymentManager.populateOrderHistory(orderList);
  //   const stripe = await getStripe();
  //   const { error } = await stripe.redirectToCheckout(checkoutOptions);

  //   // create stripe checkout
  //   // const { data: {id}, } = await axios.post('/api/checkout_sessions', {
  //   //   items:
  //   // })

  // };

  setTimeout(() => {
    setLoading(false);
  }, 500);

console.log('cartItems: ', cartItems)
  return (
    <>
      <div className="main-content-payment">

        <div className="container">
          <div className="subs-payment-card">
            <div className="title">Your monthly subscription</div>
            <div className="subtitle">
              Will ship by end of month from our facility
            </div>
            {cartItems.length > 0 && (
              cartItems.filter(item => {
                  if(item.payment === PaymentEnums.FULL_PAYMENT) {
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
                      setLoading(true);
                      CartService.removeProduct(item);
                      cartManager.setRefresh(preVal => !preVal);
                    }}
                  >
                    <X stroke="#cc3663" width={20} height={20} />
                  </Button>
                </div>
              ))
            )} 
            {/* // : (
            //   <div className="cart-empty">Your cart is empty</div>
            // )} */}
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
                    RON {CartService.cartTotal(couponValue.discount)}
                  </b>
                ) : (
                  <b className="brand-color ms-4">RON {CartService.cartTotal()}</b>
                )}
              </div>

              <div className="coupone-code">
                <CouponeForm
                  couponeValue={(value) => setCouponeValue(value)}
                  loading={(value) => setLoading(value)}
                />
              </div>
              <Button className="button-second mt-5" onClick={() => redirectToCheckout()} disabled={cartItems.length === 0}>Pay</Button>
            </div>
          </div>
          
          <ShippingInformation />
        </div>
      </div>
    </>
  );
};

export default PaymentPage;
