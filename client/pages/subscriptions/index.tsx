import React, { useContext } from "react";
import cardImg1 from "../../public/img/mystery.jpg";
import shield from "../../public/img/svg/shield.svg";
import stripeLogo1 from "../../public/img/svg/Stripe-Badge-Logo.svg";
import stripeLogo2 from "../../public/img/svg/Stripe-Outline-Logo.svg";
import axios from "axios";
import {
  GETSubscription,
} from "../../types/OrderHystory.interface";
import { TxnStatusEnum } from "../../shared/enums/txn.enum";
import { IUserModel } from "../../models/User.model";
import {
  ISubscriptionOrderModel,
  SubscriptionStatusEnum,
} from "../../models/SubscriptionOrder.model";
import { SubscriptionEnums } from "../../models/Subscription.model";
import { IGETUserDetails } from "../../models/UserDetails.model";
import getStripe from "../../lib/get-stripe";

// @ts-ignore
import Cookies from "cookies";
// @ts-ignore
import CookiesReact from "js-cookie";
import AuthContext from "../../store/auth-context";
import { Check, Lock } from "react-feather";

const BASE_URL = process.env.NEXT_PUBLIC_STRAPI_APIURL;
const SUBS_HISTORY = `${BASE_URL}/subscription-orders`;
const USER_ME = `${BASE_URL}/users/me`;
const USER_DETAILS = `${BASE_URL}/user-profile-details`;

type Props = {
  subscriptionsStripe: GETSubscription[];
  user: {
    id: number;
    email: string;
    subscribed: boolean;
  };
  subscriptionHistory: any;
};

const Subscriptions = ({
  subscriptionsStripe,
  user,
  subscriptionHistory,
}: Props) => {
  const authManager = useContext(AuthContext);

  async function getSubscriptionPrice(subsType: SubscriptionEnums) {
    const subscriptionPrice: GETSubscription | undefined =
      subscriptionsStripe.find((sub) => sub.attributes.name === subsType);
    if (subscriptionPrice) {
      // set stripe items
      const lineItems = {
        price: subscriptionPrice.attributes.stripe_sub_link,
        quantity: 1,
      };

      const {
        data: { id },
      } = await axios.post("/api/v1/checkout_sessions", {
        items: [lineItems],
        mode: "subscription",
        customer_email: user.email,
      });

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
        user_id: user.id,
      };

      // prepare the SubscriptionHistory
      localStorage.setItem("sh", JSON.stringify(sh));
      CookiesReact.set("sh", "sh");

      const stripe = await getStripe();
      await stripe.redirectToCheckout({ sessionId: id });
    }
  }

  return (
    <div className="subscription-page">
      <div className="container subscription-cards">
        <div className="col-4 card">
          <div className="card-title">Mystery</div>
          <div className="card-price">
            <div className="price">55 lei</div>
            <p className="unit">lunar</p>
          </div>
          <div className="card-image">
            <img src={cardImg1.src} />
          </div>
          <div className="card-content">
            <div className="description">
              <div className="description-title">Ce include:</div>
              <ul>
                <li>
                  <Check strokeWidth={2.7} stroke={"#cc3633"} /> lunar vrei
                  primi un model nou de parfum
                </li>
              </ul>
            </div>
            <button
              className="button-second my-5"
              onClick={() => getSubscriptionPrice(SubscriptionEnums.MYSTERY)}
            >
              Select
            </button>
          </div>
        </div>

        <div className="col-4 card popular">
          <div className="card-tag">Popular</div>
          <div className="card-title">Basic</div>
          <div className="card-price">
            <div className="price">65 lei</div>
            <p className="unit">lunar</p>
          </div>
          <div className="card-image">
            <img src={cardImg1.src} />
          </div>
          <div className="card-content">
            <div className="description">
              <div className="description-title">Ce include:</div>
              <ul>
                <li>
                  <Check strokeWidth={2.7} stroke={"#cc3633"} /> poti alege
                  dintr-o lista larga de produse
                </li>
                <li>
                  <Check strokeWidth={2.7} stroke={"#cc3633"} /> poti alege pana
                  la maxim 6 produse, planificand in prealabil pentru lunile
                  viitoare
                </li>
              </ul>
            </div>
            <button
              className="button-second my-5"
              onClick={() => getSubscriptionPrice(SubscriptionEnums.BASIC)}
            >
              Select
            </button>
          </div>
        </div>
        <div className="col-4 card">
          <div className="card-title">Premium</div>
          <div className="card-price">
            <div className="price">100 lei</div>
            <p className="unit">lunar</p>
          </div>
          <div className="card-image">
            <img src={cardImg1.src} />
          </div>
          <div className="card-content">
            <div className="description">
              <div className="description-title">Ce include:</div>
              <ul>
                <li>
                  <Check strokeWidth={2.7} stroke={"#cc3633"} /> planul BASIC +
                </li>
                <li>
                  <Check strokeWidth={2.7} stroke={"#cc3633"} /> livrare
                  gratuita
                </li>
                <li>
                  <Check strokeWidth={2.7} stroke={"#cc3633"} /> ai acces la
                  intreg catalogul de produse
                </li>
              </ul>
            </div>
            <button
              className="button-second my-5"
              onClick={() => getSubscriptionPrice(SubscriptionEnums.PREMIUM)}
            >
              Select
            </button>
          </div>
        </div>
      </div>

      <div className="container subscription-page--content">
        <div className="description">
          <div className="title">Ce vei primi...</div>
          <div className="info">
            In functie de abonamentul ales, vei primi un produs din brandul
            Sickst. Produsul consta intr-un flacon de 8ml din sticla, cu
            continut de parfum.
          </div>
          <div className="info">
            Pentru abonamentul Mystery, vei primi un produs in mod aleatoriu, in
            functie de quizul completat, urmand a primi mai multe detalii cu 2-3
            zile inainte de livrarea acestuia.
          </div>
          <div className="info">
            Se plateste lunar, se reinoieste automat, iar produsele se livreaza
            bilunar, la mijlocul si la sfarsitul fiecarei luni.
          </div>
          <div className="info">
            <b>* Toti clientii care se aboneaza pentru prima data, vor primi gratuit
            o carcasa de aluminiu marca Sickst.</b>
          </div>
        </div>

        <div className="payment-info">
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
            one month charge of $8.47, your subscription will automatically
            renew every month at $16.95. The amount of each subsequent charge
            may change. Before any such charge is changed, you will be provided
            notice. If you want to cancel your subscription, you may do so by
            sending an e-mail to <b>office@sickst.com</b>. Before each renewal,
            we will send a reminder with the term and rate then in effect. If
            you do nothing, we will charge the payment method you selected.
          </div>
          <div className="payment-security">
            <div className="title">
              <Lock
                stroke={"#c7a17f"}
                height={16}
                width={16}
                strokeWidth={2.4}
              />{" "}
              Plata securizata cu cardul
            </div>
            <p>
              Toate datele sunt criptate. Datele cardului tau nu sunt salvate
              niciodata pe serverele Sickst.
            </p>
            <p>
              The first fragrance order will be processed within 12 hours of
              subscribing. Recurring fragrances leave our warehouse based off
              Bill Date, and usually arrive 7-10 business days after they ship.
              Bill Date can be found on the Manage Subscription Page. You’ll
              always receive a tracking email so you can follow your fragrance’s
              progress.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;

const SUBSCRIPTION_URL = `${BASE_URL}/subscriptions`;

export async function getServerSideProps({ req, res }: any) {
  const cookies = new Cookies(req, res);
  const jwt = cookies.get("jwt");

  let subscriptions: any;
  let user: any;
  let subsHistory: any;

  if (jwt) {
    const header = {
      headers: {
        Authorization: "Bearer " + jwt,
      },
    };
    const data = await axios
      .get(SUBSCRIPTION_URL, header)
      .then((res) => res.data?.data)
      .catch((error) => console.log(error));

    const userData: IUserModel = await axios
      .get(USER_ME, header)
      .then((res) => {
        return res.data;
      })
      .catch((error) => console.log(error));

    if (userData.id) {
      const userDetails: IGETUserDetails = await axios
        .get(`${USER_DETAILS}?filters[user_id][$eq]=${userData.id}`, header)
        .then((resp) => resp.data.data[0]);

      const subsHist = await axios
        .get(SUBS_HISTORY, header)
        .then((res) => res.data?.data)
        .catch((error) => console.log(error));

      subscriptions = [...data];
      user = {
        id: userData.id,
        email: userData.email,
        subscribed: userDetails.attributes.subscribed,
      };
      subsHistory = { ...subsHist };
    }
  }

  return {
    props: {
      user: user ?? null,
      subscriptionsStripe: subscriptions ?? null,
      subscriptionHistory: subsHistory ?? null,
    },
  };
}
