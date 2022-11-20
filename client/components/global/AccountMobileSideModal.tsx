import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import { Button } from "react-bootstrap";
import Cookies from 'js-cookie';
import Transition from "react-transition-group/Transition";
import AccountContext from "../../store/account-context";
import AuthContext from "../../store/auth-context";

type Props = {
    show: boolean,
    onClick: () => void
}

const AccountMobileSideModal = ({show, onClick}: Props) => {
    const authManager = useContext(AuthContext);
    const accountManager = useContext(AccountContext);
    const router = useRouter();

    function logOut() {
        setTimeout(() => {
            Cookies.remove("jwt");
            authManager!.setAuth(null);
            router.push('/');
        }, 700);
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
                        className={`side-modal ${authManager!.auth && 'cart'}`}
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

                                {authManager!.auth && <>
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
                            {authManager!.auth && <Button className="button-second log-out" onClick={() => logOut()}>Log out</Button>}
                        </div>
                    </div>
                )}
            </Transition>
        </>
    );
}

export default AccountMobileSideModal;