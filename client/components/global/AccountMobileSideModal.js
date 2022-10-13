import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { Button } from "react-bootstrap";
import Transition from "react-transition-group/Transition";
import AuthContext from "../../store/auth-context";

const AccountMobileSideModal = (props) => {
    const { auth, setAuth } = useContext(AuthContext);
    const router = useRouter();

    function logOut() {
        setTimeout(() => {
            localStorage.removeItem('jwt');
            setAuth(null);
            router.push('/');
        }, 700);
    }

    return (
        <>
            <div 
                className="side-modal-bg"
                style={{
                    display: props.show === true
                    ? "block"
                    : "none",
                }}
                onClick={props.onClick}
            >
            </div>
            <Transition
                in={props.show}
                timeout={10}
            >
                {state => (
                    <div 
                        className={`side-modal ${auth && 'cart'}`}
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
                            <Button variant="close" onClick={props.onClick}/>
                        </div>
                        <div className="side-modal-body">
                            <div className="mobile-mid-menu">
                                <div className="mid-title">Your membership</div>
                                <Link href='/account'>
                                    <a onClick={props.onClick}>Manage your membership</a>
                                </Link>
                                <Link href='/account'>
                                    <a onClick={props.onClick}>Order tracking & history</a>
                                </Link>
                                <Link href='/account'>
                                    <a onClick={props.onClick}>Subscribe to Sickst</a>
                                </Link>
                                <div className="mid-title mt-5">Your account</div>
                                <Link href='/account'>
                                    <a onClick={props.onClick}>Personal details</a>
                                </Link>
                            </div>
                            <Button className="button-second log-out" onClick={() => logOut()}>Log out</Button>
                        </div>
                    </div>
                )}
            </Transition>
        </>
    );
}

export default AccountMobileSideModal;