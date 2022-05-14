import Link from 'next/link';
import LogInForm from '../../components/auth/LoginForm';
import GoogleLogin from 'react-google-login';

const Login = () => {

    const onSuccess = (res) => {
        console.log("SUCCESS", res.profileObj);
    }

    const onFailure = (res) => {
        console.log('FAILED', res);
    }

    return (
        <div className="main-content">
            <div className="main-body">
                <div className="container register-page">
                    <div className="row">
                        <div className="col-lg-5 title">
                            <span>Log in to your account</span>
                        </div>
                        <div className="col-lg-5">
                            <div className="form">
                                <LogInForm />
                            </div>
                        </div>
                        <div className="col-lg-5 login">
                            <div className="login-link w-100 justify-content-between">
                                <a href="#">Forgot your password?</a>
                                <Link href='register'>Don't have an account?</Link>
                            </div>
                            <div className="split">
                                <span className="line"></span>
                                <span className="text">or</span>
                                <span className="line"></span>
                            </div>{console.log(process.env.NEXT_PUBLIC_GA_ID)}
                            <GoogleLogin 
                                clientId={process.env.NEXT_PUBLIC_GA_ID}
                                buttonText='Log in with Google'
                                onSuccess={onSuccess}
                                onFailure={onFailure}
                                cookiePolicy={'single_host_origin'}
                                isSignedIn={true}
                                className="g-auth"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;