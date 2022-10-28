import { DateTime } from "luxon";
import Head from "next/head";
import { useContext, useEffect, useState } from "react";
import axios from "../../api/axios";
import BillingInformation from "../../components/AccountPage/BillingInformation";
import ManageSubscription from "../../components/AccountPage/ManageSubscription";
import OrderHistory from "../../components/AccountPage/OrderHistory";
import ShippingInformation from "../../components/AccountPage/ShippingInformation";
import UserReviews from "../../components/AccountPage/UserReviews";
import RatedProducts from "../../components/AccountPage/RatedProducts";
import PersonalInfo from "../../components/AccountPage/PersonalInfo";
import ResetPassword from "../../components/AccountPage/ResetPassword";
import AuthContext from "../../store/auth-context";
import AccountContext from "../../store/account-context";
import userAvatar from '../../public/img/svg/male_avatar.svg';

// const accState = [
//     'subscription', 
//     'orderHistory', 
//     'billingInfo', 
//     'shippingInfo', 
//     'reviews', 
//     'ratedProducts', 
//     'personalInfo', 
//     'resetPassword'
// ];
const Account = () => {
    const USER_ME = '/users/me';
    const [userInfo, setUserInfo] = useState();     // fetch user info
    const [accState, setAccState] = useState();
    const { auth } = useContext(AuthContext);
    const { accountManager } = useContext(AccountContext);

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
        setAccState(accountManager.accountState);
    }, [accountManager.accountState]);

    useEffect(() => {
        if(accState === 'orderHistory') {
            document.getElementById('content').classList.add('overflowscroll');
        } else {
            document.getElementById('content').classList.remove('overflowscroll');
        }
    },[accState])

    function activeMenuLink(navLink) {
        accountManager.setAccountPageState(navLink);
    }

    function getDate() {
        const date = DateTime.fromISO(userInfo.createdAt);
        return date.toFormat('dd LLL yyyy');
    }

    userInfo && console.log(userInfo)

    return(<>
        <Head>
            <link rel="stylesheet" type="text/css" charSet="UTF-8" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
            <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
        </Head>
        <div className="main-content account-page">
            <div className="container account-main-body">
                <div className="nav-section">
                    <div className="user-info">
                        <div className="user-avatar"></div>
                        <div className="user-name">Sickst User</div>
                        <div className="joined-date">Joined: <b className="brand-color">{userInfo && getDate()}</b></div>
                        <div className="joined-date">Subscription: <b className="brand-color">{(userInfo && userInfo.subscribed) ? 'activa' : 'neabonat'}</b></div>
                    </div>
                    <ul className="nav-menu">
                        <li className={"nav-link " + (accState === 'subscription' ? 'active' : '')}><div className="nav-link-btn" onClick={() => activeMenuLink('subscription')}>Manage subscription</div></li>
                        <li className={"nav-link " + (accState === 'orderHistory' ? 'active' : '')}><div className="nav-link-btn" onClick={() => activeMenuLink('orderHistory')}>Order history</div></li>
                        {/* <li className={"nav-link " + (accState === 'billingInfo' ? 'active' : '')}><div className="nav-link-btn" onClick={() => activeMenuLink('billingInfo')}>Billing information</div></li> */}
                        <li className={"nav-link " + (accState === 'shippingInfo' ? 'active' : '')}><div className="nav-link-btn" onClick={() => activeMenuLink('shippingInfo')}>Shipping information</div></li>
                        {/* <li className={"nav-link " + (accState === 'reviews' ? 'active' : '')}><div className="nav-link-btn" onClick={() => activeMenuLink('reviews')}>My reviews</div></li> */}
                        {/* <li className={"nav-link " + (accState === 'ratedProducts' ? 'active' : '')}><div className="nav-link-btn" onClick={() => activeMenuLink('ratedProducts')}>Rated products</div></li> */}
                        <li className={"nav-link " + (accState === 'personalInfo' ? 'active' : '')}><div className="nav-link-btn" onClick={() => activeMenuLink('personalInfo')}>Personal info</div></li>
                        {/* <li className={"nav-link " + (accState === 'resetPassword' ? 'active' : '')}><div className="nav-link-btn" onClick={() => activeMenuLink('resetPassword')}>Reset password</div></li> */}
                    </ul>
                </div>
                <div className="content" id="content">
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
                    {accState === 'subscription' && <ManageSubscription subscribed={userInfo && userInfo.subscribed} subscription={!!accState} />}
                    {accState === 'orderHistory' && <OrderHistory />}
                    {/* {accState === 'billingInfo' && <BillingInformation />} */}
                    {accState === 'shippingInfo' && <ShippingInformation />}
                    {/* {accState === 'reviews' && <UserReviews />} */}
                    {/* {accState === 'ratedProducts' && <RatedProducts />} */}
                    {accState === 'personalInfo' && <PersonalInfo />}
                    {/* {accState === 'resetPassword' && <ResetPassword />} */}
                </div>
            </div>
        </div>
    </>)
}

export default Account;