import { useContext, useState } from 'react';
import { Button } from 'react-bootstrap';
import Link from 'next/link';
import SideModal from './global/SideModal';
import AuthContext from '../store/auth-context';
import { Menu, ShoppingCart, User } from 'react-feather';
import { Badge } from 'primereact/badge'; 
import CartContext from '../store/cart-context';

const Header = () => {
    const [showModal, setShowModal] = useState(false);
    const { auth } = useContext(AuthContext);
    const { cartManager } = useContext(CartContext);

    // if (auth) {
    //     console.log('auth on header',auth)
    // }

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
                    { auth 
                        ? <Link href="/account">
                            <a className='account'><User /></a>
                        </Link>
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