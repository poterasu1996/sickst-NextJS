import Image from "next/image"
import brandImg from '../../public/img/parfume-img.jpg'
import logo1 from '../../public/img/svg/sephora.svg'
import logo2 from '../../public/img/svg/parfumerie-douglas-vector-logo.svg'

const Brands = () => {
    return <div className="row brands">
        <div className="col-12 col-md-6 left-side">
            <div className="img-wrapper">
                <Image src={brandImg}/>
            </div>
        </div>
        <div className="col-12 col-md-6 right-side">
            <div className="text">
                <span className="title">Doar produse autentice.</span>
                <span className="subtitle">Colaboram doar cu distribuitori autorizati, asigurand produse 100% autentice.</span>
            </div>

            <div className="logo-grid">
                <div className="row">
                    <div className="col-4">
                        <Image src={logo1} />
                    </div>
                    <div className="col-4">
                        <Image src={logo2} />
                    </div>
                    <div className="col-4">
                        <Image src={logo1} />
                    </div>
                    <div className="col-4">
                        <Image src={logo2} />
                    </div>
                    <div className="col-4">
                        <Image src={logo1} />
                    </div>
                    <div className="col-4">
                        <Image src={logo2} />
                    </div>
                    <div className="col-4">
                        <Image src={logo1} />
                    </div>
                    <div className="col-4">
                        <Image src={logo2} />
                    </div>
                    <div className="col-4">
                        <Image src={logo1} />
                    </div>
                    <div className="col-4">
                        <Image src={logo2} />
                    </div>
                    <div className="col-4">
                        <Image src={logo1} />
                    </div>
                    <div className="col-4">
                        <Image src={logo2} />
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default Brands;