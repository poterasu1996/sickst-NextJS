import { useContext, useState } from 'react';
import { Button } from 'react-bootstrap';
import Link from 'next/link';
import SideModal from './global/SideModal';
import AuthContext from '../store/auth-context';
import { Menu, ShoppingCart } from 'react-feather';

const Header = () => {
    const [showModal, setShowModal] = useState(false);
    const { auth } = useContext(AuthContext);

    // if (auth) {
    //     console.log('auth on header',auth)
    // }

    return (
        <header>
            <div className="container header sticky-header">

                <div className='logo'>
                    <Link href="/" >
                        <a className='logo-link'>
                            <h1 className='big-s'>S</h1>
                            <div className='sickst'>
                                <h3 className='pt-1'>ickst</h3>
                                <h4 className='pt-2'>&bull;Bucharest</h4>
                            </div>
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
                            <a>Account</a>
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
                            ? <ShoppingCart />
                            : <Menu />
                        } 
                    </Button>

                    <SideModal show={showModal} onClick={() => setShowModal(false)}/>
                </div>
            </div>
        </header>
    )
}

export default Header;