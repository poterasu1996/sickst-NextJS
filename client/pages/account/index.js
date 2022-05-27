import { DateTime } from "luxon";
import Head from "next/head";
import { useContext, useEffect, useState } from "react";
import axios from "../../api/axios";
import ManageSubscription from "../../components/account/ManageSubscriptions";
import AuthContext from "../../store/auth-context";


const Account = () => {
    const [subscription, setSubscription] = useState(true);
    const [orderHistory, setOrderHistory] = useState(false);
    const { auth } = useContext(AuthContext);
    const [userInfo, setUserInfo] = useState();
    const USER_ME = '/users/me';

    useEffect(() => {
        if(auth) {
            axios.get(USER_ME, {
                headers: {
                    'Authorization': 'Bearer ' + auth
                }
            }).then((resp) => {
                console.log('response',resp)
                setUserInfo(resp.data)
            })
            .catch(error => console.log('axios error', error))
        }
    }, [auth])

    function activeMenuLink(button) {
        setSubscription(false);
        setOrderHistory(false);

        button(true);
    }

    function getDate() {
        const date = DateTime.fromISO(userInfo.createdAt);
        return date.toFormat('dd LLL yyyy');
    }
    // console.log('auth', auth)
    console.log('userInfo', userInfo)

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
                        <li className={"nav-link" + (subscription ? ' active' : '')}><div className="nav-link-btn" onClick={() => activeMenuLink(setSubscription)}>Manage subscription</div></li>
                        <li className={"nav-link" + (orderHistory ? ' active' : '')}><div className="nav-link-btn" onClick={() => activeMenuLink(setOrderHistory)}>Order history</div></li>
                        <li className="nav-link"><div className="nav-link-btn">Billing information</div></li>
                        <li className="nav-link"><div className="nav-link-btn">Shipping information</div></li>
                        <li className="nav-link"><div className="nav-link-btn">My reviews</div></li>
                        <li className="nav-link"><div className="nav-link-btn">Rated products</div></li>
                        <li className="nav-link"><div className="nav-link-btn">Personal info</div></li>
                        <li className="nav-link"><div className="nav-link-btn">Reset password</div></li>
                    </ul>
                </div>
                <div className="content">
                    {subscription && <ManageSubscription />}
                </div>
            </div>
        </div>
    </>)
}

export default Account;