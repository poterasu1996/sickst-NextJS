import maleIcon from "../../public/img/male-icon.png"
import femaleIcon from "../../public/img/female-icon.jpg"
import Link from "next/link";
import Image from "next/image";
import SignUpForm from "../../components/auth/SignUpForm";

const Register = () => {
    return <>
        <div className="main-content">
            <div className="main-body">
                <div className="container register-page">
                    <div className="row">
                        <div className="col-lg-5 title">
                            <span>Creeaza contul</span>
                        </div>
                        <div className="col-lg-5 subtitle">
                            <span>Selecteaza sexul</span>
                        </div>
                        {/* <div className="col-lg-5 gender-icons">
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
                        </div> */}
                        <div className="col-lg-5">
                            <div className="form">
                                <SignUpForm />
                            </div>
                        </div>
                        <div className="col-lg-5 login">
                            <span className="login-link">
                                Have an account? <Link href='login'><a>Log In</a></Link>
                            </span>
                            <div className="split">
                                <span className="line"></span>
                                <span className="text">or</span>
                                <span className="line"></span>
                            </div>
                            <div className="g-auth">
                                <span className='g-icon'></span>
                                <span className='g-btn-text'>Sign in with Google</span>
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