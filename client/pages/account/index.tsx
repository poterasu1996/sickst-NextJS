import { DateTime } from "luxon";
import Cookies from 'cookies';
import { useContext, useEffect, useState } from "react";
import axios from "../../api/axios";
import axiosServer from "axios";
import BillingInformation from "../../components/AccountPage/BillingInformation";
import ManageSubscription from "../../components/AccountPage/ManageSubscription";
import OrderHistory from "../../components/AccountPage/OrderHistory";
import ShippingInformation from "../../components/AccountPage/ShippingInformation";
import UserReviews from "../../components/AccountPage/UserReviews";
import RatedProducts from "../../components/AccountPage/RatedProducts";
import PersonalInfo from "../../components/AccountPage/PersonalInfo";
import ResetPassword from "../../components/AccountPage/ResetPassword";
import userAvatar from '../../public/img/svg/male_avatar.svg';
import AccountContext from "../../store/account-context";
import { IUserInfo } from "../../types/UserInfo.interface";
import { GetServerSideProps } from "next";
import ILocalUserInfo from "../../types/account/LocalUserInfo.interface";

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


type Props = {
    userInfo: ILocalUserInfo,
    subscriptionHistory: any
}

const Account = ({ userInfo, subscriptionHistory }: Props) => {
    const [accState, setAccState] = useState<string>('subscription');
    const accountManager = useContext(AccountContext);

    // console.log('user: ', userInfo)
    // console.log('subsHist: ', subscriptionHistory)

    useEffect(() => {
        setAccState(accountManager!.accountState);
    }, [accountManager!.accountState]);

    useEffect(() => {
        if(accState === 'orderHistory') {
            document?.getElementById('content')?.classList.add('overflowscroll');
        } else {
            document?.getElementById('content')?.classList.remove('overflowscroll');
        }
    },[accState])

    function activeMenuLink(navLink: string) {
        accountManager!.setAccountPageState(navLink);
    }

    function getDate() {
        const date = DateTime.fromISO(userInfo?.createdAt);
        return date.toFormat('dd LLL yyyy');
    }

    return(<>
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
                <div className="content custom-sb custom-sb-x" id="content">
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
                    {accState === 'subscription' && <ManageSubscription userInfo={userInfo} subscriptionHistory={subscriptionHistory}/>}
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

const USER_ME = '/users/me';
const SUBSCRIPTION_HISTORY = '/subscription-orders';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const cookies = context.req.cookies; 
    const jwt = cookies.jwt;

    let userInfo = null;
    let subscriptionHistory = null;
    if(jwt) {
        const header = {
            headers: {
              'Authorization': `Bearer ${jwt}`
            }
        }

        const userData: IUserInfo = await axios.get(USER_ME, header)
            .then((res) => { return res.data })
            .catch(error => console.log('ERES'))

        if(userData?.subscribed) {
            // ramane de vazut daca luam orderul active/pending sau nu
            const subHistory = await axios.get(`${SUBSCRIPTION_HISTORY}?filters[user_id][$eq]=${userData.id}`, header)
                .then(res => { return res.data})
                .catch(error => console.log(error))

            subscriptionHistory = subHistory?.data;
        }

        userInfo = {
            id: userData.id,
            createdAt: userData.createdAt,
            new_user: userData.new_user,
            subscribed: userData.subscribed
        }

        // pentru ca nu avem cookie in request, suntem blocati de middleware
        const customHeader = {
            headers: {
                'Authorization': `Bearer ${jwt}`,
                Cookie: `jwt=${jwt}`
            }
        }
        // test my api
        // const MY_DATA = 'http://localhost:3000/api/subscriptions_queue'
        // const myData = await axiosServer.get(MY_DATA, customHeader)
        // console.log('myData: ', myData)
    }

        // .then(resp => {return resp.data})
    // const res = await fetch(MY_DATA)
    // const myData = await res.json();

    return {
        props: {
            userInfo,
            subscriptionHistory,
        }
    }
}