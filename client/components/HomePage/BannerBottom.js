import { Button } from "react-bootstrap";

const BannerBottom = () => {
    return <div className="banner-bottom">
        <div className="container">
            <div className="col-6 left-side">
                <div>
                    <span className="title">Acceseaza peste 50 de produse in fiecare luna!</span>
                </div>
                <div>
                    <Button href="/register" className="button-primary big mt-5">Autentificare</Button>
                </div>
            </div>
        </div>
    </div>
}

export default BannerBottom;