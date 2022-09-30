import Link from "next/link";
import SignUpForm from "../../components/auth/SignUpForm";
import gIcon from "../../public/img/svg/g-icon.svg";

const Register = () => {

  return (
    <>
      <div className="main-content account-page">
        <div className="main-body">
          <div className="container register-page">
            <div className="row">
              <div className="col-lg-5 title">
                <span>Creeaza contul</span>
              </div>
              <div className="col-lg-5 subtitle">
                <span>Ce tip de parfum preferati?</span>
              </div>
              <div className="col-lg-5">
                <div className="form">
                  <SignUpForm />
                </div>
              </div>
              <div className="col-lg-5 login">
                <span className="login-link">
                  Have an account?{" "}
                  <Link href="login">
                    <a>Log In</a>
                  </Link>
                </span>

                {/* <div className="split">
                  <span className="line"></span>
                  <span className="text">or</span>
                  <span className="line"></span>
                </div>
               
                <button
                  className="g-auth"
                  onClick={() =>
                    (window.location = `${process.env.NEXT_PUBLIC_STRAPI_ROOTURL}api/connect/google`)
                  }
                >
                  <div className="g-icon">
                    <img src={gIcon.src}></img>
                  </div>
                  <span>Signup with Google</span>
                </button> */}
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
