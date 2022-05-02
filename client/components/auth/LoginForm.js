import { Form, Button } from "react-bootstrap";
import { useRef, useState, useContext } from "react";
import { Formik } from "formik";
import CustomFormField from "../CustomFormField";
import * as Yup from 'yup';
import AuthContext from "../../store/auth-context";
import { useRouter } from 'next/router';

import axios from '../../api/axios';
const LOGIN_URL = '/auth/local';

export default function LogInForm() {
  const { setAuth } = useContext(AuthContext);
  const emailRef = useRef();
  const passwordRef = useRef();
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


  const submitHandler = async (event) => {
    event.preventDefault();

    // extract data from refs
    const enteredEmail = emailRef.current.value;
    const enteretPasword = passwordRef.current.value;

    try {
      const response = await axios.post(LOGIN_URL, {
        identifier: enteredEmail,
        password: enteretPasword
      });
      // console.log(JSON.stringify(response?.data.user));
      const jwt = response?.data?.jwt;
      const role = response?.data?.user.client_role;

      if (jwt) {
        setAuth(jwt);
        localStorage.setItem('jwt', jwt);
        router.push('/');
      }
    } catch (err) {
      // console.log(Object.keys(err))
      if (!err?.response) {
        setError('No server response');
      } else if (err.response?.status === 400) {
        setError('Invalid email or password');
        console.log('Missing Username or Password'); 
      } else if (err.response?.status === 401) {
        setError(err.response.data.error.message);
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
          <Button className="button-second mt-5" type="submit">Log In</Button>
        </Form>
      )}
    </Formik>
  );
};

