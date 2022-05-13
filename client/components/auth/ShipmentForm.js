import { Form, Alert, Button, Col, Row } from "react-bootstrap";
import { useRef, useState } from "react";
import { Formik } from "formik";
import CustomFormField from "../CustomFormField";
import * as Yup from "yup";
import { useRouter } from "next/router";
import PhoneInput from "react-phone-number-input/input";

import axios from "../../api/axios";
import CustomPhoneFormField from "../global/CustomPhoneFormField";
import { Lock } from "react-feather";
import CreditCardForm from "../SubscriptionPage/CreditCardForm";
const REGISTER_URL = "/auth/local/register";

export default function ShipmentForm({ cartTotal }) {
  const router = useRouter();
  const addressRef = useRef();
  const phoneRef = useRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState();

  //   const { signup } = useAuth();
  const validate = Yup.object({
    address: Yup.string().required("Required field*"),
    phone: Yup.number()
      // .min(10, "Invalid phone number")
      .max(10, "Invalid phone number")
      .required("Phone is required*"),
  });

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
              label="Street address"
              type="text"
              ref={addressRef}
            />
            <Row>
              <Col lg={6}>
                <CustomFormField
                  controlid="floatingFirstName"
                  name="firstName"
                  label="First Name"
                  type="text"
                />
              </Col>
              <Col lg={6}>
                <CustomFormField
                  controlid="floatingLastName"
                  name="lastName"
                  label="Last Name"
                  type="text"
                />
              </Col>
            </Row>
            <Row>
              <Col lg={6}>
                <CustomFormField
                  controlid="floatingCity"
                  name="city"
                  label="City"
                  type="text"
                />
              </Col>
              <Col lg={6}>
                <CustomFormField
                  controlid="floatingCounty"
                  name="county"
                  label="County"
                  type="text"
                />
              </Col>
            </Row>
            <Row>
              <Col lg={6}>
                <CustomFormField
                  controlid="floatingZipCode"
                  name="zipCode"
                  label="Zip code (opt)"
                  type="text"
                />
              </Col>
              <Col lg={6}>
                <CustomPhoneFormField
                  controlid="floatingPhone"
                  name="phone"
                  label="Phone number"
                  ref={phoneRef}
                />
              </Col>
            </Row>

            <Button className="button-second mt-5" type="submit">Total {cartTotal} lei</Button>
          </Form>
        )}
      </Formik>
    </>
  );
}
