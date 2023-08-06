import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { X } from "react-feather";
import CouponeForm from "../../components/global/form/CouponeForm";
import CartContext from "../../store/cart-context";
// import PaymentContext from "../../store/payment-context";
import PaymentContextTS from "../../store/payment-context";
import { loadStripe } from "@stripe/stripe-js";
import ShippingInformation from "../../components/AccountPage/ShippingInformation";
import CartService from "../../shared/services/cartService/index";
import axios from "axios";
import CookiesServer from 'cookies';
import Cookies from 'js-cookie';
import { PaymentEnums } from "../../shared/enums/payment.enums";
import ICartProduct from "../../types/CartProduct.interface";
import { IUserModel } from "../../models/User.model";
import { IOrderHistoryModel, OrderTypeEnum } from "../../models/OrderHistory.model";
import { TxnStatusEnum } from "../../shared/enums/txn.enum";
import { useRecoilValue } from "recoil";
import { shippingListR } from "../../shared/recoil-states";
import { IShippingInfo } from "../../models/ShippingInformation.model";
import { IGETUserDetails } from "../../models/UserDetails.model";

let stripePromise: any;

const USER_ME = 'http://localhost:1337/api/users/me';
const USER_DETAILS = 'http://localhost:1337/api/user-profile-details';

const getStripe = () => {
  // check if there is any stripe instance
  if (!stripePromise) {
    process.env.NEXT_PUBLIC_STRIPE_KEY && (stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY));
  }

  return stripePromise;
};

type Props = {
  user: {
    id: number,
    email: string,
    subscribed: boolean
  },
}

const PaymentPage = ({ user }: Props) => {
  const router = useRouter();
  const cartManager = useContext(CartContext);
  const paymentManager = useContext(PaymentContextTS);
  const [couponValue, setCouponeValue] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [lineItems, setLineItems] = useState<any>([]);
  const [cartItems, setCartItems] = useState<ICartProduct[]>([]);
  const [header, setHeader] = useState<any>();
  const shippingListRecoil = useRecoilValue(shippingListR);

  let activeShippingDetails: IShippingInfo | undefined = undefined;
  if(shippingListRecoil) {
    activeShippingDetails = shippingListRecoil.find((si: IShippingInfo) => si.primary)
  }

  // disable the pay button if there is no product / no primary address set
  const disablePayButton = (cartItems.length === 0 || activeShippingDetails === undefined);
  console.log('RECOILDSL', shippingListRecoil)
  console.log('cartItems', cartItems)

  const orderMinus = (item: any) => {
    if(item.quantity > 1) {
      // modify product quantity in card + template
      setLoading(true);
      CartService.quantityProduct(item, 'remove');
      cartManager.setRefresh(preVal => !preVal);
    }
  }

  const orderPlus = (item: any) => {
    setLoading(true);
    CartService.quantityProduct(item, 'add');
    cartManager.setRefresh(preVal => !preVal);
  }

  useEffect(() => {
    if(CartService.cart) {
      const cartList = CartService.singlePaymentList();   // list from cart
      cartList && setCartItems([...cartList]);

      const items = cartList?.map((item: ICartProduct) =>{                 // item list for stripe
        return {
          price: item.product.attributes.stripe_fullpriceLink,
          quantity: item.quantity
        }
      });
      // prepare product list for stripe
      items && setLineItems([...items]);
    } 
  }, [loading, CartService.cart]);


  function createOrderProductList(data: any) {
    const orderList = data.map((item: any) => {
      const newData = {
        product_id: item.product.id,
        brand: item.product.attributes.brand,
        model: item.product.attributes.model,
        quantity: item.quantity,
        price: item.product.attributes.otb_price,          
      }
      return newData;
    });
    return orderList;
  }

  const redirectToCheckout = async () => {
    // create stripe checkout, pass line items to the body
    const { 
      data: {id}, 
    } = await axios.post('/api/v1/checkout_sessions', {
      items: [...lineItems],
      mode: 'payment',
      customer_email: user.email,
    });


    if(cartItems.length > 0) {
      const cleanProductList = createOrderProductList(cartItems);
      const oh: IOrderHistoryModel = {
        cancelled_order: null,
        is_cancelled: false,
        is_delivered: false,
        order_type: OrderTypeEnum.PAYMENT,
        product_list: cleanProductList,
        session_id: id,
        shipping_details: shippingListRecoil,
        total: CartService.cartTotal(),
        txn_status: TxnStatusEnum.PENDING,
        user_id: user.id,
      }

      // prepare our OrderHistory (default, txn_status is set to false ) 
      localStorage.setItem('oh', JSON.stringify(oh));

    }

    // redirect to checkout
    const stripe = await getStripe();
    await stripe.redirectToCheckout({ sessionId: id });
  }

  setTimeout(() => {
    setLoading(false);
  }, 500);

  useEffect(() => {
    const jwt = Cookies.get('jwt');
    if(jwt) {
        const head = {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${jwt}`,
            }
        }
        setHeader(head);
    }
  }, [])

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

              {/* <div className="coupone-code">
                <CouponeForm
                  couponeValue={(value: any) => setCouponeValue(value)}
                  loading={(value: any) => setLoading(value)}
                />
              </div> */}
              <Button className="button-second mt-5" onClick={redirectToCheckout} disabled={disablePayButton}>Pay</Button>
            </div>
          </div>
          
          <ShippingInformation />
        </div>
      </div>
    </>
  );
};

export default PaymentPage;

export async function getServerSideProps({req, res}: any) {
  const cookies = new CookiesServer(req, res);
  const jwt = cookies.get('jwt');

  let user: any;

  if(jwt) {
    const header = {
      headers: {
        'Authorization': 'Bearer ' + jwt
      }
    }

    const userData: IUserModel = await axios.get(USER_ME, header)
      .then(res => { return res.data})
      .catch(error => console.log(error))
    
    if(userData.id) {
      const userDetails: IGETUserDetails = await axios.get(`${USER_DETAILS}?filters[user_id][$eq]=${userData.id}`, header) 
        .then(resp => resp.data.data[0]);

      user = {
        id: userData.id,
        email: userData.email,
        subscribed: userDetails.attributes.subscribed
      };
    }
  }

  return {
    props: {
      user: user ?? null,
    }
  }
}
