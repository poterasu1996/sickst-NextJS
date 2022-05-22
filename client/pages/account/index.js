import Head from "next/head";
import { useState } from "react";
import ManageSubscription from "../../components/account/ManageSubscriptions";


const Account = () => {
    const [subscription, setSubscription] = useState(true);
    const [orderHistory, setOrderHistory] = useState(false);

    function activeMenuLink(button) {
        setSubscription(false);
        setOrderHistory(false);

        button(true);
    }

    console.log('subscription',subscription)
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
                        <div className="joined-date">Joined: <b className="brand-color">21 sept 2021</b></div>
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