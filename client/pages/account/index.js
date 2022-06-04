import { DateTime } from "luxon";
import Head from "next/head";
import { useContext, useEffect, useState } from "react";
import axios from "../../api/axios";
import BillingInformation from "../../components/account/BillingInformation";
import ManageSubscription from "../../components/account/ManageSubscriptions";
import OrderHistory from "../../components/account/OrderHistory";
import ShippingInformation from "../../components/account/ShippingInformation";
import UserReviews from "../../components/account/UserReviews";
import RatedProducts from "../../components/account/RatedProducts";
import PersonalInfo from "../../components/account/PersonalInfo";
import ResetPassword from "../../components/account/ResetPassword";
import AuthContext from "../../store/auth-context";
import AccountContext from "../../store/account-context";
import userAvatar from '../../public/img/svg/male_avatar.svg';

const Account = () => {
    const [subscription, setSubscription] = useState(true);
    const [orderHistory, setOrderHistory] = useState(false);
    const [billingInformation, setBillingInformation] = useState(false);
    const [shippingInformation, setShippingInformation] = useState(false);
    const [reviews, setReviews] = useState(false);
    const [ratedProducts, setRatedProducts] = useState(false);
    const [personalInfo, setPersonalInfo] = useState(false);
    const [resetPassword, setResetPassword] = useState(false);
    
    const [userInfo, setUserInfo] = useState();     // fetch user info
    const { auth } = useContext(AuthContext);
    const { accountManager } = useContext(AccountContext);
    const USER_ME = '/users/me';

    // const headerDDOptions = ['membership', 'order_history', 'shipping', 'personal_details']

    useEffect(() => {
        if(auth) {
            axios.get(USER_ME, {
                headers: {
                    'Authorization': 'Bearer ' + auth
                }
            }).then((resp) => {
                // console.log('response',resp)
                setUserInfo(resp.data)
            })
            .catch(error => console.log('axios error', error))
        }
    }, [auth])

    useEffect(() => {
        if(accountManager.headerDDLink !== null) {
            // check if user came via header dropdown navbar
            resetStates();
            if(accountManager.headerDDLink === 'membership') {
                setSubscription(true);
            } else if(accountManager.headerDDLink === 'order_history') {
                setOrderHistory(true);
            } else if(accountManager.headerDDLink === 'shipping') {
                setShippingInformation(true);
            } else if(accountManager.headerDDLink === 'personal_details') {
                setPersonalInfo(true);
            } else {
                console.log('Header link is invalid')
            }
        }
        console.log('orderState', orderHistory)
    }, [accountManager.headerDDLink])

    function resetStates() {
        // reset navbar active class
        setSubscription(false);
        setOrderHistory(false);
        setBillingInformation(false);
        setShippingInformation(false);
        setReviews(false);
        setRatedProducts(false);
        setPersonalInfo(false);
        setResetPassword(false);
    }

    function activeMenuLink(navLink) {
        // set every state to false;
        resetStates();

        // set active the nav-link we need
        navLink(true);
    }

    function getDate() {
        const date = DateTime.fromISO(userInfo.createdAt);
        return date.toFormat('dd LLL yyyy');
    }

    return(<>
        <Head>
            <link rel="stylesheet" type="text/css" charSet="UTF-8" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
            <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
        </Head>
        <div className="main-content">
            <div className="container account-main-body">
                <div className="nav-section">
                    <div className="user-info">
                        <div className="user-avatar"></div>
                        <div className="user-name">Sickst User</div>
                        <div className="joined-date">Joined: <b className="brand-color">{userInfo && getDate()}</b></div>
                    </div>
                    <ul className="nav-menu">
                        <li className={"nav-link " + (subscription ? 'active' : '')}><div className="nav-link-btn" onClick={() => activeMenuLink(setSubscription)}>Manage subscription</div></li>
                        <li className={"nav-link " + (orderHistory ? 'active' : '')}><div className="nav-link-btn" onClick={() => activeMenuLink(setOrderHistory)}>Order history</div></li>
                        <li className={"nav-link " + (billingInformation ? 'active' : '')}><div className="nav-link-btn" onClick={() => activeMenuLink(setBillingInformation)}>Billing information</div></li>
                        <li className={"nav-link " + (shippingInformation ? 'active' : '')}><div className="nav-link-btn" onClick={() => activeMenuLink(setShippingInformation)}>Shipping information</div></li>
                        <li className={"nav-link " + (reviews ? 'active' : '')}><div className="nav-link-btn" onClick={() => activeMenuLink(setReviews)}>My reviews</div></li>
                        <li className={"nav-link " + (ratedProducts ? 'active' : '')}><div className="nav-link-btn" onClick={() => activeMenuLink(setRatedProducts)}>Rated products</div></li>
                        <li className={"nav-link " + (personalInfo ? 'active' : '')}><div className="nav-link-btn" onClick={() => activeMenuLink(setPersonalInfo)}>Personal info</div></li>
                        <li className={"nav-link " + (resetPassword ? 'active' : '')}><div className="nav-link-btn" onClick={() => activeMenuLink(setResetPassword)}>Reset password</div></li>
                    </ul>
                </div>
                <div className="content">
                    <div className="user-info-mobile">
                        <div className="user-avatar">
                            <img src={userAvatar.src}></img>
                        </div>
                        <div className="user-details">
                            <div className="name">Sickst User</div>
                            <div className="joined-date">Joined: <b className="brand-color">{userInfo && getDate()}</b></div>
                            <div className="subscription-status">Subscription: <b className="brand-color">Active</b></div>
                        </div>
                    </div>
                    {subscription && <ManageSubscription subscription={subscription} />}
                    {orderHistory && <OrderHistory />}
                    {billingInformation && <BillingInformation />}
                    {shippingInformation && <ShippingInformation />}
                    {reviews && <UserReviews />}
                    {ratedProducts && <RatedProducts />}
                    {personalInfo && <PersonalInfo />}
                    {resetPassword && <ResetPassword />}
                </div>
            </div>
        </div>
    </>)
}

export default Account;