import { Button } from "react-bootstrap"

const Banner = () => {

    return <div className="banner">
        <div className="container">
            <div className="row">
                <div className="col-12 col-md-6 left-side">
                    <span className="title">Beneficiaza de 10% discount in prima luna!</span>
                    <span className="subtitle mt-5">Acum ai ocazia de a construi colectia de parfumuri mult dorita mult mai usor decat ai crede. De ce sa te limitezi la un parfum, cand poti avea 6?</span>
                    <Button href="/register" className="button-primary big mt-5">Autentificare</Button>
                    <span className="subtitle">*Valabil doar pentru subscriptie!</span>
                </div>
            </div>
        </div>
    </div>
}

export default Banner;