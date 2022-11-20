import { Form, Button, Spinner } from "react-bootstrap";
import { useRef, useState, useContext } from "react";
import { Formik } from "formik";
import CustomFormField from "../global/form/CustomFormField";
import * as Yup from 'yup';
import AuthContext from "../../store/auth-context";
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

import axios from '../../api/axios';
const LOGIN_URL = '/auth/local';

export default function LogInForm() {
  const { setAuth } = useContext(AuthContext);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validate = Yup.object({
    email: Yup.string()
      .email('Email is invalid*')
      .required('Email is required*'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters*')
      .required('Password is required*'),
  });

  function createCookieInHour(cookieName: string, cookieValue: any, hourToExpire: number) {
    let date =  new Date();
    date.setTime(date.getTime()+(hourToExpire*60*60*1000)); // number of hours
    document.cookie = cookieName + "=" + cookieValue + ";path = " + "/" + "; expires = " + date.toString();
  }

  const submitHandler = async (event: any) => {
    event.preventDefault();

    // extract data from refs
    const enteredEmail = emailRef?.current?.value;
    const enteredPasword = passwordRef?.current?.value;

    // setLoading(preVal => !preVal);
    try {
      const response = await axios.post(LOGIN_URL, {
        identifier: enteredEmail,
        password: enteredPasword
      });
      // console.log(JSON.stringify(response?.data.user));
      const jwt = response?.data?.jwt;
    //   const role = response?.data?.user.client_role;

      if (jwt) {
        setAuth(jwt);
        createCookieInHour('jwt', jwt, 1); // create cookie with jwt

        setLoading(preVal => !preVal);
        router.push('/');

        // adding auto-logout
        const oneHour = 1000 * 60 * 60; 
        setTimeout(() => {
          Cookies.remove("jwt");
          setAuth(null);
          router.push("/account/login");
        }, oneHour);
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('No server response');
      } else if (err.response?.status === 400) {
        setError('Invalid email or password');
      } else {
        setError('Login Failed');
      } 
    }
  }

  return (
    <Formik
      initialValues={{
        email: '',
        password: ''
      }}
      validationSchema={validate}
    >
      {formik => (
        <Form onSubmit={submitHandler}>
          <CustomFormField controlid='floatingEmail' name='email' label='Email address' type='email' ref={emailRef}  />
          <CustomFormField controlid='floatingPassword' name='password' label='Password' type='password' ref={passwordRef}  />
          {error && 
            <div className="form-errors">
              ERROR: {error}
            </div>
          }
          { loading 
            ? <div className="loader">
                <Spinner animation="border" style={{color: "#cc3633"}}/>
              </div>
            : <Button className="button-second mt-5" type="submit">Log In</Button>
          }
        </Form>
      )}
    </Formik>
  );
};

