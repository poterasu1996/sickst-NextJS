import Link from "next/link";
import LogInForm from "../../components/auth/LoginForm";
import gIcon from "../../public/img/svg/g-icon.svg";

const Login = () => {

  return (
    <div className="layout">
      <div className="container auth-page">
        <div className="row">
          <div className="title justify-center">
            <span>Log in to your account</span>
          </div>
          <div className="form">
            <LogInForm />
          </div>
          <div className="login">
            <div className="login-link w-full justify-between">
              <a href="#">Forgot your password?</a>
              <Link href="register">Don't have an account?</Link>
            </div>

            {/* <div className="split">
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
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
