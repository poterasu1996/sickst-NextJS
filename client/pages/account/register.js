import Link from "next/link";
import SignUpForm from "../../components/auth/SignUpForm";
import GoogleLogin from 'react-google-login';

const Register = () => {

    const onSuccess = (res) => {
        console.log("SUCCESS", res.profileObj);
    }

    const onFailure = (res) => {
        console.log('FAILED', res);
    }

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
                            <GoogleLogin 
                                clientId={process.env.NEXT_PUBLIC_GA_ID}
                                buttonText='Sign up with Google'
                                onSuccess={onSuccess}
                                onFailure={onFailure}
                                cookiePolicy={'single_host_origin'}
                                isSignedIn={true}
                                className="g-auth"
                            />
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