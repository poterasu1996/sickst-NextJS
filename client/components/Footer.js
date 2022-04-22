import Link from "next/link";
import insta from "../public/img/svg/instagram.svg";
import facebook from "../public/img/svg/facebook.svg";
import Image from 'next/image';

const Footer = () => {
    return <footer>
        <div className="container footer">
            <div className="row">
                <div className="col-4">
                    <span className="logo">Sickst</span>
                    <span className="text">Descopera un nou parfum in fiecare luna pentru 60 RON.</span>
                </div>
                <div className="col-2">
                    <span className="title">Despre Sickst</span>
                    <ul>
                        <li className="list-item">
                            <Link href="/about-us">
                                <a>Despre noi</a>
                            </Link>
                        </li>
                        <li className="list-item">
                            <Link href="#">
                                <a>Ajutor</a>
                            </Link>
                        </li>
                        <li className="list-item">
                            <Link href="#">
                                <a>Contact</a>
                            </Link>
                        </li>
                        <li className="list-item">
                            <Link href="#">
                                <a>Reviews</a>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="col-2">
                    <span className="title">Shop</span>
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
                            <Link href="/subscriptions-men">
                                <a>Shop pentru el</a>
                            </Link>
                        </li>
                        <li className="list-item">
                            <Link href="/subscriptions-women">
                                <a>Shop pentru ea</a>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="col">
                    <span className="title">Follow us</span>
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
                    <ul className="pt-5">
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
                    </ul>
                </div>
            </div>
        </div>
    </footer>;
}

export default Footer;