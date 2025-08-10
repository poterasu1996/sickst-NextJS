import { useContext, useState } from "react";
import Link from "next/link";

// Components
import AccountMobileSideModal from "./global/AccountMobileSideModal";
import { Menu } from "react-feather";

// Storage
import AuthContext from "../store/auth-context";
import Image from "next/image";

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
                
                <Image src={'/logo-black.svg'} width={250} height={28} alt="Logo" priority />
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