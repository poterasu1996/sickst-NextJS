import { useContext, useState } from "react";
import Link from "next/link";
import logo from '../../client/public/logo-black.svg';

// Components
import AccountMobileSideModal from "./global/AccountMobileSideModal";
import { Menu } from "react-feather";

// Storage
import AuthContext from "../store/auth-context";

const HeaderLandingPage = () => {
    const [accountMobileModal, setAccountMobileModal] = useState(false);
    const { isAuth } = useContext(AuthContext);

    return(<>
        <header className="lp-header">
            <ul className="nav-menu">
                <button
                    className="account-mobile-btn"
                    onClick={() => {
                        setAccountMobileModal(true);
                    }}
                >
                    <Menu />
                </button>
                <li className="nav-link">
                    <Link href="/shop/shop-for-her">
                        Women
                    </Link>
                </li>
                <li className="nav-link">
                    <Link href="/shop/shop-for-him">
                        Men
                    </Link>
                </li>
                <li className="nav-link logo">
                <img src={logo.src} />
                </li>
                <li className="nav-link">
                    <Link href="/about-us">
                        About us
                    </Link>
                </li>
                <li className="nav-link">
                    <Link href={isAuth ? "/account" : '/auth/login'}>
                        Account
                    </Link>
                </li>
            </ul>
            {/* mobile side modal */}
            <AccountMobileSideModal
                show={accountMobileModal}
                onClick={() => {
                    setAccountMobileModal(false);
                }}
            />
        </header>
    </>)
}

export default HeaderLandingPage;