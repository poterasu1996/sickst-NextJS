import Link from "next/link";
import logo from '../../client/public/logo-black.svg';
import { useState } from "react";
import AccountMobileSideModal from "./global/AccountMobileSideModal";
import { Button } from "react-bootstrap";
import { Menu } from "react-feather";

const HeaderLandingPage = () => {
    const [accountMobileModal, setAccountMobileModal] = useState(false);

    return(<>
        <header className="lp-header">
            <ul className="nav-menu">
                <Button
                    className="account-mobile-btn"
                    onClick={() => {
                        setAccountMobileModal(true);
                    }}
                >
                    <Menu />
                </Button>
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
                    <Link href="/contact-us">
                        Contact
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