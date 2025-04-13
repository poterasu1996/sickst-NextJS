import { useContext, useEffect, useState } from "react";
import axios from "axios";

// components / Layout
import AccountLayout from "../../layouts/AccountLayout";
import BillingInformation from "../../components/AccountPage/BillingInformation";
import ManageSubscription from "../../components/AccountPage/ManageSubscription";
import OrderHistory from "../../components/AccountPage/OrderHistory";
import ShippingInformation from "../../components/AccountPage/ShippingInformation";
import UserReviews from "../../components/AccountPage/UserReviews";
import RatedProducts from "../../components/AccountPage/RatedProducts";
import ResetPassword from "../../components/AccountPage/ResetPassword";
import PersonalInfo from "../../components/AccountPage/PersonalInfo";

// assets
import userAvatar from '../../public/img/svg/male_avatar.svg';

// global storage
import AccountContext from "../../store/account-context";

// utilities
import { GetServerSideProps } from "next";
import { IUserModel } from "../../models/User.model";
import { IGETUserDetails } from "../../models/UserDetails.model";
import ILocalUserInfo from "../../types/account/LocalUserInfo.interface";
import { AppUtils } from "../../shared/utils/app.utils";
import { AccountTabViews } from "../../shared/types/account";

const tabs = [
    { key: 'subscription', label: 'Manage subscription'},
    { key: 'orderHistory', label: 'Order history'},
    // { key: 'billingInfo', label: 'Billing information'},
    { key: 'shippingInfo', label: 'Shipping information'},
    // { key: 'reviews', label: 'My reviews'},
    // { key: 'ratedProducts', label: 'Rated products'},
    { key: 'personalInfo', label: 'Personal info'},
    // { key: 'resetPassword', label: 'Reset password'},
];

type Props = {
    userInfo: ILocalUserInfo,
    subscriptionHistory: any
}

const Account = ({ userInfo, subscriptionHistory }: Props) => {
    const [accState, setAccState] = useState<string>('subscription');
    const accountManager = useContext(AccountContext);

    useEffect(() => {
        setAccState(accountManager!.accountState);
    }, [accountManager!.accountState]);

    useEffect(() => {
        if(accState === AccountTabViews.ORDER_HISTORY) {
            document?.getElementById('content')?.classList.add('overflowscroll');
        } else {
            document?.getElementById('content')?.classList.remove('overflowscroll');
        }
    },[accState])

    function handleActiveMenuLink(navLink: string) {
        accountManager!.setAccountPageState(navLink);
    }

    function renderTabContent(activeTab: string) {
        switch (activeTab) {
            case AccountTabViews.SUBSCRIPTION:
                return <ManageSubscription userInfo={userInfo} subscriptionHistory={subscriptionHistory}/>
            case AccountTabViews.ORDER_HISTORY:
                return <OrderHistory />
            case AccountTabViews.BILLING_INFO:
                return <BillingInformation />
            case AccountTabViews.SHIPPING_INFO:
                return <ShippingInformation />
            case AccountTabViews.REVIEWS:
                return <UserReviews />
            case AccountTabViews.RATED_PRODUCTS:
                return <RatedProducts />
            case AccountTabViews.PERSONAL_INFO:
                return <PersonalInfo />
            case AccountTabViews.RESET_PASSWORD:
                return <ResetPassword />
            default:
                return <ManageSubscription userInfo={userInfo} subscriptionHistory={subscriptionHistory}/>
        }
    }

    return(<>
        {/* <div className="main-content account-page">
        </div> */}
        <AccountLayout>
            <div className="container account-main-body">
                <div className="nav-section">
                    <div className="user-info">
                        <div className="user-avatar"></div>
                        <div className="user-name">{userInfo?.full_name ? userInfo.full_name : "Sickst User"}</div>
                        <div className="joined-date">Joined: <b className="brand-color">{userInfo && AppUtils.isoToFormat(userInfo.createdAt)}</b></div>
                        <div className="joined-date">Subscription: <b className="brand-color">{(userInfo && userInfo.subscribed) ? 'activa' : 'neabonat'}</b></div>
                    </div>
                    <ul className="nav-menu">
                        {tabs.map((tab) => <li className={"nav-link " + (accState === tab.key ? 'active' : '')}><div className="nav-link-btn" onClick={() => handleActiveMenuLink(tab.key)}>{tab.label}</div></li>)}
                    </ul>
                </div>
                <div className="content custom-sb custom-sb-x" id="content">
                    <div className="user-info-mobile">
                        <div className="user-avatar">
                            <img src={userAvatar.src}></img>
                        </div>
                        <div className="user-details">
                            <div className="name">{userInfo?.full_name ? userInfo.full_name : "Sickst User"}</div>
                            <div className="joined-date">Joined: <b className="brand-color">{userInfo && AppUtils.isoToFormat(userInfo.createdAt)}</b></div>
                            <div className="subscription-status">Subscription: <b className="brand-color">{(userInfo && userInfo.subscribed) ? 'activa' : 'neabonat'}</b></div>
                        </div>
                    </div>
                    {renderTabContent(accState)}
                </div>
            </div>
        </AccountLayout>
    </>)
}

export default Account;

const USER_ME = `${process.env.NEXT_PUBLIC_STRAPI_APIURL}/users/me`;
const SUBSCRIPTION_HISTORY = `${process.env.NEXT_PUBLIC_STRAPI_APIURL}/subscription-orders`;
const USER_DETAILS = `${process.env.NEXT_PUBLIC_STRAPI_APIURL}/user-profile-details`;

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

        const userData: IUserModel = await axios.get(USER_ME, header)
            .then((res) => res.data )
            .catch(error => console.log('ERES'))

        if(userData?.id) {
            try {
                const userDetailsResponse = await axios.get(`${USER_DETAILS}?filters[user_id][$eq]=${userData.id}`, header);
                const userDetails: IGETUserDetails = userDetailsResponse.data.data[0];

                userInfo = {
                    id: userDetails.attributes.user_id,
                    createdAt: userDetails.attributes.createdAt,
                    full_name: userDetails.attributes.first_name+" "+userDetails.attributes.last_name,
                    new_user: userDetails.attributes.new_user,
                    subscribed: userDetails.attributes.subscribed,
                    subscription_name: userDetails.attributes.subscription_name,
                }

                if(userDetails.attributes.subscribed) {
                    // luam orderul daca userul e subscribed, urmand a crea un serviciu care 
                    // autodezaboneaza in functie de is_cancelled si expire_date
                    try {
                        // ramane de vazut daca luam orderul active/pending sau nu
                        const subHistory = await axios.get(`${SUBSCRIPTION_HISTORY}?filters[user_id][$eq]=${userDetails.attributes.user_id}`, header)
                            .then(res => { return res.data})
                            .catch(error => console.log(error))
            
                        subscriptionHistory = subHistory?.data;
                    } catch (error) {
                        console.log(error);
                    }
                }
                
            } catch (error) {
                console.log(error)
            }
        }
    }

    return {
        props: {
            userInfo,
            subscriptionHistory,
        }
    }
}