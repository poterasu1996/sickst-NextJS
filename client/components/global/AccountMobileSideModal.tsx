import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import { Button } from "react-bootstrap";
import Transition from "react-transition-group/Transition";
import AccountContext from "../../store/account-context";
import AuthContext from "../../store/auth-context";

import axios from "axios";

type Props = {
    show: boolean,
    onClick: () => void
}

const LOGOUT_URL = 'http://localhost:3000/api/v1/logout';

const AccountMobileSideModal = ({show, onClick}: Props) => {
    const { isAuth, setIsAuth } = useContext(AuthContext);
    const accountManager = useContext(AccountContext);
    const router = useRouter();

    async function handleLogOut() {
        const response = await axios.post(LOGOUT_URL);

        if(response.status === 200) {
            setIsAuth(false);
            router.push('/');
            onClick();
        }
    }

    return (
        <>
            <div 
                className="side-modal-bg"
                style={{
                    display: show === true
                    ? "block"
                    : "none",
                }}
                onClick={onClick}
            >
            </div>
            <Transition
                in={show}
                timeout={10}
            >
                {state => (
                    <div 
                        className={`side-modal ${isAuth && 'cart'}`}
                        id="mobile-nav"
                        style={{
                            transform: state === 'entered'
                            ? "translateX(0px)"
                            : "translateX(-100%)",
                            transition: "all .5s ease"
                        }}
                    >   
                        <div className="side-modal-header-mobile">
                            {/* <span>Account</span> */}
                            <Button variant="close" onClick={onClick}/>
                        </div>
                        <div className="side-modal-body">
                            <div className="mobile-mid-menu">
                                <div className="mid-title">Shop</div>
                                <Link href='/shop/shop-for-him'>
                                    <a onClick={onClick}>Pentru el</a>
                                </Link>
                                <Link href='/shop/shop-for-her'>
                                    <a onClick={onClick}>Pentru ea</a>
                                </Link>

                                {isAuth && <>
                                    <div className="mid-title mt-5">Your membership</div>
                                    <Link href='/account'>
                                        <a onClick={() => {
                                            onClick();
                                            accountManager!.setAccountPageState('subscription');
                                        }}>Manage your membership</a>
                                    </Link>
                                    <Link href='/account'>
                                        <a onClick={() => {
                                            onClick();
                                            accountManager!.setAccountPageState("orderHistory");
                                        }}>Order tracking & history</a>
                                    </Link>
                                    <Link href='/account'>
                                        <a onClick={() => {
                                            onClick();
                                            accountManager!.setAccountPageState("shippingInfo");
                                        }}>Shipping information</a>
                                    </Link>
                                    <div className="mid-title mt-5">Your account</div>
                                    <Link href='/account'>
                                        <a onClick={() => {
                                            onClick();
                                            accountManager!.setAccountPageState("personalInfo");
                                        }}>Personal info</a>
                                    </Link>
                                </>}

                            </div>
                            {isAuth && <Button className="button-second log-out" onClick={() => handleLogOut()}>Log out</Button>}
                        </div>
                    </div>
                )}
            </Transition>
        </>
    );
}

export default AccountMobileSideModal;