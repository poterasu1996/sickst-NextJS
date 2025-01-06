import { useContext } from "react";
import AuthContext from "../../store/auth-context";
import SecondaryButtonEmpty from "../global/SecondaryButtonEmpty";

const BannerBottom = () => {
    const { isAuth } = useContext(AuthContext);

    return <div className="banner-bottom">
        <div className="container">
            <div className="col col-sm-6 left-side">
                <div>
                    <span className="title">Acceseaza peste 500 de produse in fiecare luna!</span>
                </div>
                <div>
                    {!isAuth && <div className="max-w-80"><SecondaryButtonEmpty href="/auth/register" className="mt-5">Autentificare</SecondaryButtonEmpty></div>}
                    {isAuth && <div className="max-w-80"><SecondaryButtonEmpty href="/subscriptions" className="mt-5">Subscribe</SecondaryButtonEmpty></div>}
                </div>
            </div>
        </div>
    </div>
}

export default BannerBottom;