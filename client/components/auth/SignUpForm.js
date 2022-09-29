import { Form, Alert, Button } from "react-bootstrap";
import { useRef, useState } from "react";
import { Formik } from "formik";
import CustomFormField from "../CustomFormField";
import * as Yup from 'yup';
import { useRouter } from "next/router";
import { Check } from 'react-feather';
import maleIcon from "../../public/img/male-icon.png"
import femaleIcon from "../../public/img/female-icon.jpg"

import axios from "../../api/axios";
import Image from "next/image";
const REGISTER_URL = '/auth/local/register';

export default function SignUpForm() {
  const router = useRouter();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cbFemale, setCbFemale] = useState(true);
  const [cbMale, setCbMale] = useState(false);
  const [newsletter, setNewsletter] = useState(true);
  
//   const { signup } = useAuth();
  const validate = Yup.object({
    email: Yup.string()
      .email('Email is invalid*')
      .required('Email is required*'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters*')
      .required('Password is required*'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Password must match*')
      .required('Confirm password*'),
  });

  function handleGender(value) {
    if(value === 'female') {
      cbMale && setCbMale(!cbMale);
      !cbFemale && setCbFemale(!cbFemale);
    } else {
      !cbMale && setCbMale(!cbMale);
      cbFemale && setCbFemale(!cbFemale);
    }
  }

  function handleNewsletter() {
    setNewsletter((prev) => !prev);
  }

  const submitHandler = async (e) => {
    e.preventDefault();

    const username = emailRef.current.value;
    const email = emailRef.current.value;
    const pw = passwordRef.current.value;

    try {
      setError("");
      setLoading(true);

      const response = await axios.post(REGISTER_URL, {
        username: username,
        email: email,
        password: pw,
        sex: cbFemale ? 'female' : 'male',
        newsletter: newsletter
      })

      if (response.status === 200) {
        router.push('/account/login');
      }
    } catch {
      setError("Failed to create an account.");
    }
    setLoading(false);
  }

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
        confirmPassword: ''
      }}
      validationSchema={validate}
    >
      {formik => (
        <Form onSubmit={submitHandler}>
          <div className="gender-icons">
            <Form.Check>
              <Form.Check.Label onChange={() => {handleGender('female')}}>
                <Image src={femaleIcon} width={100} height={100} />
                {cbFemale && <div className="checked"><Check strokeWidth={'3px'} height={22} width={22} stroke={'#cc3633'}/></div>}
                <Form.Check.Input type="radio" checked={cbFemale}/>
              </Form.Check.Label>
              <p>Feminin</p>
            </Form.Check>
            <Form.Check>
              <Form.Check.Label onChange={() => {handleGender('male')}}>
                <Image src={maleIcon} width={100} height={100} />
                {cbMale && <div className="checked"><Check strokeWidth={'3px'} height={22} width={22} stroke={'#cc3633'}/></div>}
                <Form.Check.Input type="radio" checked={cbMale}/>
              </Form.Check.Label>
              <p>Masculin</p>
            </Form.Check>
          </div>
          <CustomFormField controlid='floatingEmail' name='email' label='Email address' type='email' ref={emailRef}  />
          <CustomFormField controlid='floatingPassword' name='password' label='Password' type='password' ref={passwordRef}  />
          <CustomFormField controlid='floatingPasswordConfirm' name='confirmPassword' label='Password confirmation' type='password' ref={passwordConfirmRef}  />
          
          <div className="form-field newsletter">
            <label className="check-box" onChange={() => handleNewsletter()}>
              <input className="cb" type="checkbox" checked={newsletter}></input>
              <span className="custom-cb"></span>
              <span className="text">Sign me up for details from Sickst</span>
            </label>
            <div className="terms">
              <span className="title">
                By hitting the "Sign up" button, you agree to the
              </span>
              <span className="tc">
                <a href="#">Terms and Conditions</a> and{" "}
                <a href="#">Privacy Policy</a>
              </span>
            </div>
          </div>
          <Button className="button-second mt-5" type="submit">Sign up</Button>
        </Form>
      )}
    </Formik>
  );
};