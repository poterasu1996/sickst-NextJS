import Image from "next/image";
import Link from "next/link";
import img from "../public/img/svg/404.svg";

const PageNotFound = () => {
    return <>
        <div className="page-not-found">
            <div className="wrapper">
                <Image src={img}/>
                <div className="wrapper--info">
                    <div className="title">Oops! Our bad.</div>
                    <div className="text">
                        The page you are looking for does not exist.<br/>
                        Stay calm, take a deep breath and smile.<br/>
                        Try going to sickst.ro<br/>
                    </div>
                    <Link href="/"><a className="button-second my-5">Go to sickst.ro</a></Link>
                </div>
            </div>
        </div>
    </>
}

export default PageNotFound;