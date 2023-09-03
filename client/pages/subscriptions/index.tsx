import React from "react";
import cardImg1 from "../../public/img/mystery.jpg";
import shield from "../../public/img/svg/shield.svg";
import stripeLogo1 from "../../public/img/svg/Stripe-Badge-Logo.svg";
import stripeLogo2 from "../../public/img/svg/Stripe-Outline-Logo.svg";
import axios from "axios";
import Cookies from 'cookies';
import CookiesReact from 'js-cookie';
import { GETSubscription, IPOSTSubscriptionHistory } from "../../types/OrderHystory.interface";
import { TxnStatusEnum } from "../../shared/enums/txn.enum";
import { IUserModel } from "../../models/User.model";
import { ISubscriptionOrderModel, SubscriptionStatusEnum } from "../../models/SubscriptionOrder.model";
import { SubscriptionEnums } from "../../models/Subscription.model";
import { IGETUserDetails } from "../../models/UserDetails.model";
import getStripe from "../../lib/get-stripe";


const SUBSCRIPTION_URL = 'http://localhost:1337/api/subscriptions';
const SUBS_HISTORY = 'http://localhost:1337/api/subscription-orders';
const USER_ME = 'http://localhost:1337/api/users/me'
const USER_DETAILS = 'http://localhost:1337/api/user-profile-details';

type Props = {
  subscriptionsStripe: GETSubscription[],
  user: {
    id: number,
    email: string,
    subscribed: boolean
  },
  subscriptionHistory: any
}

export const Subscriptions = ({ subscriptionsStripe, user, subscriptionHistory }: Props) => {
  async function getSubscriptionPrice(subsType: SubscriptionEnums) {
    const subscriptionPrice: GETSubscription | undefined = subscriptionsStripe.find(sub => sub.attributes.name === subsType)
    if(subscriptionPrice) {
      // set stripe items
      const lineItems = {
        price: subscriptionPrice.attributes.stripe_sub_link,
        quantity: 1
      }

      const {
        data: {id}
      } = await axios.post('/api/v1/checkout_sessions', {
        items: [lineItems],
        mode: 'subscription', 
        customer_email: user.email
      })

      // va trebui sa populam OH cu tipul subscrierii, { subscription_name: basic, starting_date: dataCrearii, txn_status: success/pending/canceled}
      // + va trebui creata o lista cu subscrieri (cele 6 iteme) de tipul: 
      // { id_listei, tip_subscriere, id_produs, nume_produs, luna_livrarii }
      const sh: ISubscriptionOrderModel = {
        expire_date: null,
        is_cancelled: false,
        last_payment_date: null,
        session_id: id,
        subscription_list: null,
        subscription_name: subsType,
        subscription_price: subscriptionPrice.attributes.price,
        subscription_status: SubscriptionStatusEnum.PAUSED,
        txn_status: TxnStatusEnum.PENDING,
        user_id: user.id ,
      }

      // prepare the SubscriptionHistory
      localStorage.setItem('sh', JSON.stringify(sh));
      CookiesReact.set('sh', 'sh')

      const stripe = await getStripe();
      await stripe.redirectToCheckout({ sessionId: id })
    }
  }

  return (
    <div className="subscription-page">
      <div className="container subscription-page--description">
        <div className="title">Ce vei primi...</div>
        <div className="info">
          Un abonament catre Sickst. Se plateste lunar, se reinoieste automat,
          iar produsele se livreaza bilunar, la mijlocul si la sfarsitul
          fiecarei luni.
        </div>
      </div>
      <div className="container black-cards">
        <div className="col-4 card">
          <div className="card-image">
            <img src={cardImg1.src} />
          </div>
          <div className="card-content">
            <div className="title">Mystery</div>
            <div className="description">
              <ul>
                <li>lunar vrei primi un model nou de parfum</li>
              </ul>
            </div>
            <button 
              className="button-second my-5"
              onClick={() => getSubscriptionPrice(SubscriptionEnums.MYSTERY)}
            >Subscribe for 55 RON</button>
          </div>
        </div>
        <div className="col-4 card">
          <div className="card-image">
            <img src={cardImg1.src} />
          </div>
          <div className="card-content">
            <div className="title">Basic</div>
            <div className="description">
              <ul>
                <li>poti alege dintr-o lista larga de produse</li>
                <li>
                  poti alege pana la maxim 6 produse, planificand in prealabil
                  pentru lunile viitoare
                </li>
              </ul>
            </div>
            <button 
              className="button-second my-5"
              onClick={() => getSubscriptionPrice(SubscriptionEnums.BASIC)}
            >Subscribe for 65 RON</button>
          </div>
        </div>
        <div className="col-4 card">
          <div className="card-image">
            <img src={cardImg1.src} />
          </div>
          <div className="card-content">
            <div className="title">Premium</div>
            <div className="description">
              <ul>
                <li>BASIC +</li>
                <li>livrare gratuita</li>
                <li>ai acces la intreg catalogul de produse</li>
              </ul>
            </div>
            <button 
              className="button-second my-5"
              onClick={() => getSubscriptionPrice(SubscriptionEnums.PREMIUM)}
            >Subscribe for 100 RON</button>
          </div>
        </div>
      </div>
      <div className="container security-info">
        <div className="safe-checkout">
          <div className="title">Guaranteed Safe Checkout</div>
          <div className="d-inline-flex justify-content-center">
            <img
              style={{ width: "150px", height: "10rem" }}
              src={stripeLogo1.src}
            />
            <img style={{ margin: "0 1rem" }} src={shield.src} />
            <img
              style={{ width: "150px", height: "10rem" }}
              src={stripeLogo2.src}
            />
          </div>
        </div>
        <div className="disclaimer">
          *By clicking “Pay”, you agree that your subscription will
          automatically renew every month until you cancel. After your initial
          one month charge of $8.47, your subscription will automatically renew
          every month at $16.95. The amount of each subsequent charge may
          change. Before any such charge is changed, you will be provided
          notice. If you want to cancel your subscription, you may do so by
          sending an e-mail to <b>office@sickst.com</b>. Before each renewal, we
          will send a reminder with the term and rate then in effect. If you do
          nothing, we will charge the payment method you selected.
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;


export async function getServerSideProps({ req, res }: any) {
  const cookies = new Cookies(req, res);
  const jwt = cookies.get('jwt');

  let subscriptions: any;
  let user: any;
  let subsHistory: any;

  if(jwt) {
    const header = {
      headers: {
        'Authorization': 'Bearer ' + jwt
      }
    }
    const data = await axios.get(SUBSCRIPTION_URL, header)
      .then(res => {
        return res.data?.data
      })
      .catch(error => console.log(error))

    const userData: IUserModel = await axios.get(USER_ME, header)
      .then(res => { return res.data})
      .catch(error => console.log(error))

    if(userData.id) {
      const userDetails: IGETUserDetails = await axios.get(`${USER_DETAILS}?filters[user_id][$eq]=${userData.id}`, header)
        .then(resp => resp.data.data[0]);

        const subsHist = await axios.get(SUBS_HISTORY, header)
          .then(res => { return res.data?.data })
          .catch(error => console.log(error))
    
        subscriptions = [...data];
        user = {
          id: userData.id,
          email: userData.email,
          subscribed: userDetails.attributes.subscribed,
        };
        subsHistory = {...subsHist};
    }
  }

  return {
    props: {
      subscriptionsStripe: subscriptions ?? null,
      user: user ?? null,
      subscriptionHistory: subsHistory
    }
  }
}
