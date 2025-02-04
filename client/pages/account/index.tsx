// @ts-ignore
import { DateTime } from "luxon";
import { useContext, useEffect, useState } from "react";
// import axios from "../../api/axios";
import BillingInformation from "../../components/AccountPage/BillingInformation";
import ManageSubscription from "../../components/AccountPage/ManageSubscription";
import OrderHistory from "../../components/AccountPage/OrderHistory";
import ShippingInformation from "../../components/AccountPage/ShippingInformation";
import UserReviews from "../../components/AccountPage/UserReviews";
import RatedProducts from "../../components/AccountPage/RatedProducts";
import ResetPassword from "../../components/AccountPage/ResetPassword";
import userAvatar from '../../public/img/svg/male_avatar.svg';
import AccountContext from "../../store/account-context";
import { GetServerSideProps } from "next";
import ILocalUserInfo from "../../types/account/LocalUserInfo.interface";
import { IUserModel } from "../../models/User.model";
import { IGETUserDetails } from "../../models/UserDetails.model";
import PersonalInfo from "../../components/AccountPage/PersonalInfo";
import axios from "axios";

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

function getDate(dateString: string) {
    const date = DateTime.fromISO(dateString);
    return date.toFormat('dd LLL yyyy');
}

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
        if(accState === 'orderHistory') {
            document?.getElementById('content')?.classList.add('overflowscroll');
        } else {
            document?.getElementById('content')?.classList.remove('overflowscroll');
        }
    },[accState])

    function activeMenuLink(navLink: string) {
        accountManager!.setAccountPageState(navLink);
    }

    return(<>
        <div className="main-content account-page">
            <div className="container account-main-body">
                <div className="nav-section">
                    <div className="user-info">
                        <div className="user-avatar"></div>
                        <div className="user-name">{userInfo?.full_name ? userInfo.full_name : "Sickst User"}</div>
                        <div className="joined-date">Joined: <b className="brand-color">{userInfo && getDate(userInfo.createdAt)}</b></div>
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
                            <div className="name">{userInfo?.full_name ? userInfo.full_name : "Sickst User"}</div>
                            <div className="joined-date">Joined: <b className="brand-color">{userInfo && getDate(userInfo.createdAt)}</b></div>
                            <div className="subscription-status">Subscription: <b className="brand-color">{(userInfo && userInfo.subscribed) ? 'activa' : 'neabonat'}</b></div>
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