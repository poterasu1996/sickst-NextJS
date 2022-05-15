import { useEffect, useState } from "react";
import axios from "../../api/axios";

const USER_URL = '/users/me?populate=*';

const Account = () => {
    const [personalInfo, setPersonalInfo] = useState(true);
    const [userDetails, setUserDetails] = useState();

    function setNavbarActive(state) {

    }

    useEffect(async () => {
        // request personal info
        const token = {
            headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
        }
        const response = await axios.get(USER_URL, token);
        console.log('resp',response)
        setUserDetails(response.data);
    }, [])

    if (userDetails) {
        console.log(userDetails)
    }

    return(<>
        <div className="main-content">
            <div className="container account-main-body">
                <div className="nav-section">
                    <div className="user-info">
                        <div className="user-avatar"></div>
                        <div className="user-name">Sickst User</div>
                        <div className="joined-date">Joined: <b className="brand-color">21 sept 2021</b></div>
                    </div>
                    <ul className="nav-menu">
                        <li className={`nav-link ${personalInfo && 'active'}`} onClick={() => setNavbarActive(setPersonalInfo)}><a href="#">Personal info</a></li>
                        <li className="nav-link"><a href="#">Order history</a></li>
                        <li className="nav-link"><a href="#">Manage subscription</a></li>
                        <li className="nav-link"><a href="#">Billing information</a></li>
                        <li className="nav-link"><a href="#">Shipping information</a></li>
                        <li className="nav-link"><a href="#">My reviews</a></li>
                        <li className="nav-link"><a href="#">Rated products</a></li>
                        <li className="nav-link"><a href="#">Reset password</a></li>
                    </ul>
                </div>
                <div className="content">content</div>
            </div>
        </div>
    </>)
}

export default Account;