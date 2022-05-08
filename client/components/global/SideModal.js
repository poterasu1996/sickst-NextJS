import Link from "next/link";
import { useContext } from "react";
import { Button } from "react-bootstrap";
import Transition from "react-transition-group/Transition";
import AuthContext from "../../store/auth-context";
import Cart from "./Cart";

const SideModal = (props) => {
    const { auth } = useContext(AuthContext);

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
                        id="side-modal"
                        style={{
                            transform: state === 'entered'
                            ? "translateX(0px)"
                            : "translateX(100%)",
                            transition: "all .5s ease"
                        }}
                    >   
                        {auth 
                            ? <Cart onClick={props.onClick}/>
                            : <>
                                <div className="side-modal-header">
                                    <span className="text">Menu</span>
                                    <Button variant="close" onClick={props.onClick} />
                                </div>
                                <div className="side-modal-body">
                                    <div className="mid-menu">
                                        <Link href="#">
                                            <a>Cum functioneaza</a>
                                        </Link>
                                        <Link href="#">
                                            <a>Gifts</a>
                                        </Link>
                                        <Link href="#">
                                            <a>Despre noi</a>
                                        </Link>
                                    </div>
                                    
                                    <Link href="/account/login">
                                        <a className="button-second d-block d-sm-none">Log in</a>
                                    </Link>
                                    <Link href="/account/register">
                                        <a className="button-second">Autentificare</a>
                                    </Link>
                                </div>
                            </> 
                        }
                    </div>
                )}
            </Transition>
        </>
    );
}

export default SideModal;