import Link from "next/link";
import insta from "../public/img/svg/instagram.svg";
import facebook from "../public/img/svg/facebook.svg";
import Image from 'next/image';

const Footer = () => {
    return <footer>
        <div className="container footer">
            <div className="row">
                <div className="col-6 col-sm-3 col-md-3">
                    <div className="logo">Sickst</div>
                    <div className="text">Descopera un nou parfum in fiecare luna pentru 60 RON.</div>
                </div>
                <div className="col-6 col-sm-3 col-md-3 col-about" >
                    <div className="title">Despre Sickst</div>
                    <ul>
                        <li className="list-item">
                            <Link href="/about-us">
                                <a>Despre noi</a>
                            </Link>
                        </li>
                        <li className="list-item">
                            <Link href="/help">
                                <a>Ajutor</a>
                            </Link>
                        </li>
                        <li className="list-item">
                            <Link href="/contact-us">
                                <a>Contact</a>
                            </Link>
                        </li>
                        {/* <li className="list-item">
                            <Link href="#">
                                <a>Reviews</a>
                            </Link>
                        </li> */}
                    </ul>
                </div>
                <div className="col-6 col-sm-3 col-md-3 col-shop">
                    <div className="title">Shop</div>
                    <ul>
                        <li className="list-item">
                            <Link href="#">
                                <a>Shop</a>
                            </Link>
                        </li>
                        <li className="list-item">
                            <Link href="/gift">
                                <a>Ofera cadou</a>
                            </Link>
                        </li>
                        <li className="list-item">
                            <Link href="/shop/shop-for-him">
                                <a>Shop pentru el</a>
                            </Link>
                        </li>
                        <li className="list-item">
                            <Link href="/shop/shop-for-her">
                                <a>Shop pentru ea</a>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="col-6 col-sm-3 col-md-3 col-last">
                    <div className="title">Follow us</div>
                    <div className="social-links">
                        <Link href="#">
                            <a className="insta">
                                <Image src={insta} width={24} height={24}/>
                            </a>
                        </Link>
                        <Link href="#">
                            <a className="facebook">
                                <Image src={facebook} width={24} height={24}/>
                            </a>
                        </Link>
                    </div>
                    {/* <ul className="pt-5">
                        <li className="list-item">
                            <Link href="/referall">
                                <a>Invita prietenii</a>
                            </Link>
                        </li>
                        <li className="list-item">
                            <Link href="/monthly-pool">
                                <a>Pool lunar</a>
                            </Link>
                        </li>
                    </ul> */}
                </div>
            </div>
        </div>
    </footer>;
}

export default Footer;