import Link from "next/link";
import Image from "next/image";

const SimpleHeader = () => {
    return <header>
        <div className="container header register print">
            <div className='logo'>
                <Link href="/" >
                    <a className='logo-link'>
                        <Image src='/logo-white.svg' alt="Logo" width={126} height={37} priority />
                    </a>
                </Link>
            </div>
        </div>
    </header>
}

export default SimpleHeader;