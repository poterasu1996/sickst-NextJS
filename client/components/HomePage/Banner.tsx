import Image from "next/image";
import { useContext } from "react";
import bannerImg from "../../public/img/fougere-fragrance-family-Clive-Christian-Perfumes-1555x1100.jpg"
import AuthContext from "../../store/auth-context";

const Banner = () => {
    const { isAuth } = useContext(AuthContext);

    return <div className="banner">
        <div className="container">
            <div className="row">
                <div className="col-12 col-md-6 left-side">
                    <span className="title">Beneficiaza de 10% discount in prima luna!</span>
                    <span className="subtitle mt-5">Acum ai ocazia de a construi colectia de parfumuri mult dorita mult mai usor decat ai crede. De ce sa te limitezi la un parfum, cand poti avea 6?</span>
                    {/* {isAuth
                        ? <button href="/subscriptions" className="button-primary big mt-5">Abonamente</button>
                        : <button href="/auth/register" className="button-primary big mt-5">Autentificare</button>
                    } */}
                    <span className="subtitle">*Valabil doar pentru subscriptie!</span>
                </div>
                <div className="col-12 col-md-6 right-side">
                    <Image src={bannerImg}/>
                    {/* <img src={bannerImg.src}></img> */}
                </div>
            </div>
        </div>
    </div>
}

export default Banner;