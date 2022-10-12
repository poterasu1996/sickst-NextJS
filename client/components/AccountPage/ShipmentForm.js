import { Form, Button, Col, Row } from "react-bootstrap";
import { useContext, useRef, useState } from "react";
import { Formik } from "formik";
import CustomFormField from "../global/form/CustomFormField";
import { InputSwitch } from 'primereact/inputswitch';
import * as Yup from "yup";
import CustomPhoneFormField from "../global/form/CustomPhoneFormField";
import AccountContext from "../../store/account-context";

export default function ShipmentForm({ onSubmit }) {
  const { accountManager } = useContext(AccountContext);
  const [loading, setLoading] = useState(false);
  const [primary, setPrimary] = useState(false);
  
  const addressRef = useRef();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const cityRef = useRef();
  const countyRef = useRef();
  const apartmentRef = useRef();
  const phoneRef = useRef();
  
  const validate = Yup.object({
    address: Yup.string().required("Campul este obligatoriu*"),
    first_name: Yup.string().required("Campul este obligatoriu*"),
    last_name: Yup.string().required("Campul este obligatoriu*"),
    city: Yup.string().required("Campul este obligatoriu*"),
    county: Yup.string().required("Campul este obligatoriu*"),
    phone: Yup.string().required("Nr. de telefon este obligatoriu*"),
  });

  const submitHandler = async (e) => {
    e.preventDefault();

    const data = {
      address: addressRef.current.value,
      first_name: firstNameRef.current.value,
      last_name: lastNameRef.current.value,
      city: cityRef.current.value,
      county: countyRef.current.value,
      appartment: apartmentRef.current.value,
      phone: phoneRef.current.value,
      primary: primary,
    }
    accountManager.addShippingInfo(data);
    setLoading(false);
  };

  return (
    <>
      <Formik
        initialValues={{
          address: "",
          first_name: "",
          last_name: "",
          city: "",
          county: "",
          appartment: "",
          phone: "",
          primary: ""
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
                  name="first_name"
                  label="Nume"
                  type="text"
                  ref={firstNameRef}
                />
              </Col>
              <Col lg={6}>
                <CustomFormField
                  controlid="floatingLastName"
                  name="last_name"
                  label="Prenume"
                  type="text"
                  ref={lastNameRef}
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
                  ref={cityRef}
                />
              </Col>
              <Col lg={6}>
                <CustomFormField
                  controlid="floatingCounty"
                  name="county"
                  label="Judet"
                  type="text"
                  ref={countyRef}
                />
              </Col>
            </Row>
            <Row>
              <Col lg={6}>
                <CustomFormField
                  controlid="floatingAppartment"
                  name="appartment"
                  label="App (opt)"
                  type="text"
                  ref={apartmentRef}
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
            <div className="custom-switch-input">
              <label>Make this address primary</label>
              <InputSwitch 
                checked={primary}
                name="primary"
                onChange={(e) => setPrimary(e.value)}
              />
            </div>
            <Button className="button-second mt-5" type="submit" onClick={onSubmit}>Add new address</Button>
          </Form>
        )}
      </Formik>
    </>
  );
}
