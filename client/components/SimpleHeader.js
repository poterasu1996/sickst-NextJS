import Link from "next/link";

const SimpleHeader = () => {
    return <header>
        <div className="container header register">
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
        </div>
    </header>
}

export default SimpleHeader;