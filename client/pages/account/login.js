import Link from 'next/link';
import LogInForm from '../../components/auth/LoginForm';

const Login = () => {
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
                            </div>
                            <div className="g-auth">
                                <span className='g-icon'></span>
                                <span className='g-btn-text'>Sign in with Google</span>
                            </div>
                        </div>
                        <div className="col-5 copyright">
                            <span>&copy; Sickst</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;