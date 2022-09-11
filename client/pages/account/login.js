import Link from "next/link";
import LogInForm from "../../components/auth/LoginForm";
import gIcon from "../../public/img/svg/g-icon.svg";

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
                <Link href="register">Don't have an account?</Link>
              </div>
              <div className="split">
                <span className="line"></span>
                <span className="text">or</span>
                <span className="line"></span>
              </div>
              {console.log(process.env.NEXT_PUBLIC_GA_ID)}
             
              <button
                className="g-auth"
                onClick={() =>
                  (window.location = `${process.env.NEXT_PUBLIC_STRAPI_ROOTURL}api/connect/google`)
                }
              >
                <div className="g-icon">
                    <img src={gIcon.src}></img>
                </div>
                <span>Login with Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
