import { useContext } from "react";
import { Button } from "react-bootstrap";
import AuthContext from "../../store/auth-context";

const BannerBottom = () => {
    const { auth } = useContext(AuthContext);

    return <div className="banner-bottom">
        <div className="container">
            <div className="col col-sm-6 left-side">
                <div>
                    <span className="title">Acceseaza peste 500 de produse in fiecare luna!</span>
                </div>
                <div>
                    {!auth && <Button href="/auth/register" className="button-primary big mt-5">Autentificare</Button>}
                    {auth && <Button href="/subscriptions" className="button-primary big mt-5">Subscribe</Button>}
                </div>
            </div>
        </div>
    </div>
}

export default BannerBottom;