import Link from "next/link";
import logo from "../public/logo.svg";

const SimpleHeader = () => {
    return <header>
        <div className="container header register">
            <div className='logo'>
                <Link href="/" >
                    <a className='logo-link'>
                        <img src={logo.src}/>
                    </a>
                </Link>
            </div>
        </div>
    </header>
}

export default SimpleHeader;