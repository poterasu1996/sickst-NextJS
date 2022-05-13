import Image from 'next/image'
import Link from 'next/link'
import subs1 from '../../public/img/parfume-img.jpg'

const Subscriptions = () => {
    return <div className="row subscriptions">
        <div className="col">
            <div className="container flex-column-reverse flex-sm-row-reverse">
                <div className="col col-sm-6 left-side">
                    <Image src={subs1} />
                </div>
                <div className='col col-sm-6 right-side'>
                    <div className="text">
                        <div className="title">Esti o fire misterioasa? Iti place sa incerci lucruri noi?</div>
                        <div className="subtitle">Alege abonamentul "Mystery" care te va ajuta sa descoperi lunar noi arome.</div>
                    </div>
                    <Link href="/">
                        <a className='button-second big'>Mystery</a>
                    </Link>
                </div>
            </div>
        </div>
    </div>
}

export default Subscriptions;