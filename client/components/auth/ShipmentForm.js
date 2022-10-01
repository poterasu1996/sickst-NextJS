import { Form, Alert, Button, Col, Row } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import { Formik } from "formik";
import CustomFormField from "../CustomFormField";
import * as Yup from "yup";
import { useRouter } from "next/router";

import axios from "../../api/axios";
import CustomPhoneFormField from "../global/CustomPhoneFormField";
const REGISTER_URL = "/auth/local/register";
import { loadStripe } from "@stripe/stripe-js";

let stripePromise;

const getStripe = () => {
  // check if there is any stripe instance
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
  }

  return stripePromise;
};

const USER_URL = "/users/me";
const USER_DETAILS = "/user-details?populate=*"

export default function ShipmentForm({ cartTotal }) {
  const router = useRouter();
  const addressRef = useRef();
  const phoneRef = useRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState();

  // stripe item   
  const item = {
    price: "price_1L7IrEIdXAYNRuBx0Yi8bleX",
    quantity: 1,
  };
  
  //   const { signup } = useAuth();
  const validate = Yup.object({
    address: Yup.string().required("Campul este obligatoriu*"),
    firstName: Yup.string().required("Campul este obligatoriu*"),
    lastName: Yup.string().required("Campul este obligatoriu*"),
    city: Yup.string().required("Campul este obligatoriu*"),
    county: Yup.string().required("Campul este obligatoriu*"),
    phone: Yup.string().required("Nr. de telefon este obligatoriu*"),
  });

  let checkoutOptions;
  useEffect(() => {
    checkoutOptions = {
      lineItems: [item],
      mode: "subscription",
      successUrl: `${window.location.origin}/subscription/payment/success`,
      cancelUrl: `${window.location.origin}/subscription/payment/cancel`,
    };
  }, []);

  useEffect(async () => {
    const jwt = localStorage.getItem('jwt');
    const header = {
      headers: {
        authorization: `Bearer ${jwt}`,
      }
    }

    const response = await axios.get(USER_URL, header);
    const orderList = await axios.get(USER_DETAILS);
    console.log('USER: ', response.data);
  }, [])

  const redirectToCheckout = async () => {
    console.log("redirectToCheckout");

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout(checkoutOptions);
    console.log("Stripe error", error);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const username = addressRef.current.value;
    const email = emailRef.current.value;
    const pw = passwordRef.current.value;

    try {
      setError("");
      setLoading(true);

      const response = await axios.post(REGISTER_URL, {
        username: username,
        email: email,
        password: pw,
      });

      if (response.status === 200) {
        router.push("/account/login");
      }
    } catch {
      setError("Failed to create an account.");
    }
    setLoading(false);
  };

  return (
    <>
      <Formik
        initialValues={{
          address: "",
          phone: "",
        }}
        validationSchema={validate}
      >
        {(formik) => (
          <Form onSubmit={submitHandler} className="shipment-details-form">
            <CustomFormField
              controlid="floatingAddress"
              name="address"
              label="Adresa"
              type="text"
              ref={addressRef}
            />
            <Row>
              <Col lg={6}>
                <CustomFormField
                  controlid="floatingFirstName"
                  name="firstName"
                  label="Nume"
                  type="text"
                />
              </Col>
              <Col lg={6}>
                <CustomFormField
                  controlid="floatingLastName"
                  name="lastName"
                  label="Prenume"
                  type="text"
                />
              </Col>
            </Row>
            <Row>
              <Col lg={6}>
                <CustomFormField
                  controlid="floatingCity"
                  name="city"
                  label="Oras"
                  type="text"
                />
              </Col>
              <Col lg={6}>
                <CustomFormField
                  controlid="floatingCounty"
                  name="county"
                  label="Judet"
                  type="text"
                />
              </Col>
            </Row>
            <Row>
              <Col lg={6}>
                <CustomFormField
                  controlid="floatingZipCode"
                  name="zipCode"
                  label="Cod postal (opt)"
                  type="text"
                />
              </Col>
              <Col lg={6}>
                <CustomPhoneFormField
                  controlid="floatingPhone"
                  name="phone"
                  label="Telefon"
                  type="text"
                  ref={phoneRef}
                />
              </Col>
            </Row>
            {cartTotal 
              ? <Button className="button-second mt-5" type="submit">Total {cartTotal} lei</Button>
              : <Button className="button-second mt-5" type="submit" onClick={redirectToCheckout}>Subscribe</Button>
            }
          </Form>
        )}
      </Formik>
    </>
  );
}
