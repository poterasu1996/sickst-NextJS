import { useContext, useState } from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import Link from 'next/link';
import SideModal from './global/SideModal';
import AuthContext from '../store/auth-context';
import { Menu, ShoppingCart, User } from 'react-feather';
import { Badge } from 'primereact/badge'; 
import CartContext from '../store/cart-context';
import { useRouter } from 'next/router';

const Header = () => {
    const [showModal, setShowModal] = useState(false);
    const { auth, setAuth } = useContext(AuthContext);
    const { cartManager } = useContext(CartContext);
    const router = useRouter();

    function logOut() {
        setTimeout(() => {
            localStorage.removeItem('jwt');
            setAuth(null);
            router.push('/');
        }, 700);
    }

    return (
        <header>
            <div className="container header sticky-header">

                <div className='logo'>
                    <Link href={"/"} >
                        {/* <a className='logo-link'>
                            <h1 className='big-s'>S</h1>
                            <div className='sickst'>
                                <h3 className='pt-1'>ickst</h3>
                                <h4 className='pt-2'>&bull;Bucharest&bull;</h4>
                            </div>
                        </a> */}
                        <a className='logo-link2'>
                            <div className='t1'>Sickst</div>
                            <div className='t2'>Bucharest</div>
                        </a>
                    </Link>
                </div>
                
                <ul className='nav-menu'>
                    <li className='nav-link'>
                        <Link href="/subscription/subscriptions-women">Women</Link>
                    </li>
                    <li className='nav-link'>
                        <Link href="/subscription/subscriptions-men">Men</Link>
                    </li>
                </ul>

                <div className="right-side">
                    {/* { auth && 
                        <Dropdown className='header-dropdown'>
                            <Dropdown.Toggle id="user-account-dd">
                                <User />
                            </Dropdown.Toggle>

                            <Dropdown.Menu className='header-dropdown-menu'>
                                <Dropdown.Item as="button">Item1</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    } */}

                    { auth 
                        ? 
                        // <Link href="/account">
                        //     <a className='account'><User /></a>
                        // </Link>
                        <Dropdown className='header-dropdown'>
                            <Dropdown.Toggle id="user-account-dd">
                                <User stroke='#cecece'/>
                            </Dropdown.Toggle>

                            <Dropdown.Menu className='header-dropdown-menu'>
                                <Dropdown.Header>Your membership</Dropdown.Header>
                                <Dropdown.Item href='/account'>Manage your membership</Dropdown.Item>
                                <Dropdown.Item href='/account'>Order tracking & history</Dropdown.Item>
                                <Dropdown.Item href='/account'>Subscribe to Sickst</Dropdown.Item>
                                <Dropdown.Header>Your account</Dropdown.Header>
                                <Dropdown.Item href='/account'>Personal details</Dropdown.Item>
                                <Dropdown.Item as="button" onClick={() => logOut()}>Log out</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        : <Link href="/account/login">
                            <a>Log in</a>
                        </Link>
                    }

                    <Button 
                        variant='menu'
                        onClick={() => setShowModal(true)}
                    >
                        {auth 
                            // ? <i className="pi pi-bell mr-4 p-text-secondary p-overlay-badge" style={{ fontSize: '2rem' }}><Badge value="2" ></Badge></i>
                            ? <div className='shopping-cart'><ShoppingCart /> {cartManager.cart.length > 0 && <span className='badge'>{cartManager.cart.length}</span>}</div> 
                            : <Menu />
                        } 
                    </Button>
                    
                    <SideModal show={showModal} onClick={() => setShowModal(false)}/>
                </div>
            </div>
            <Button 
                variant='menu'
                className='floating-cart'
                onClick={() => setShowModal(true)}
            >
                    <div className='shopping-cart'><ShoppingCart /> {cartManager.cart.length > 0 && <span className='badge'>{cartManager.cart.length}</span>}</div> 
            </Button>
        </header>
    )
}

export default Header;