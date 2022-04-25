import maleIcon from "../../public/img/male-icon.png"
import femaleIcon from "../../public/img/female-icon.jpg"
import Link from "next/link";
import Image from "next/image";
import Signup from "../../components/SignUp";

const Register = () => {
    return <>
        <div className="main-content">
            <div className="main-body">
                <div className="container register-page">
                    <div className="row">
                        <div className="col-5 title">
                            <span>Creeaza contul</span>
                        </div>
                        <div className="col-5 subtitle">
                            <span>Selecteaza sexul</span>
                        </div>
                        <div className="col-5 gender-icons">
                            <div className="female">
                                <a href="#">
                                    <Image src={femaleIcon} width={100} height={100} />
                                    <span>Female</span>
                                </a>
                            </div>
                            <div className="male">
                                <a href="#">
                                    <Image src={maleIcon} width={100} height={100} />
                                    <span>Male</span>
                                </a>
                            </div>
                        </div>
                        <div className="col-5">
                            <div className="form">
                                <Signup />
                            </div>
                        </div>
                        <div className="col-5 login">
                            <span className="login-link">
                                Have an account? <Link href='/account/login'><a>Log In</a></Link>
                            </span>
                            <div className="split">
                                <span className="line"></span>
                                <span className="text">or</span>
                                <span className="line"></span>
                            </div>
                            <div className="fb-signup">
                                <h1>Facebook</h1>
                                <h1>Google</h1>
                            </div>
                        </div>

                        {/* simple footer */}
                        {/* <div className="col-5 copyright">
                            <span>&copy; Sickst</span>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default Register;