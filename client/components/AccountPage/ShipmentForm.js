import { Form, Button, Col, Row } from "react-bootstrap";
import { useContext, useRef, useState } from "react";
import { Formik } from "formik";
import CustomFormField from "../global/form/CustomFormField";
import { InputSwitch } from 'primereact/inputswitch';
import * as Yup from "yup";
import CustomPhoneFormField from "../global/form/CustomPhoneFormField";
import AccountContext from "../../store/account-context";
import AutocompleteFormField from "../global/form/AutocompleteFormField";

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
          full_name: "",
          phone: "",
          city: "",
          county: "",
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
                  name="full_name"
                  label="Nume si Prenume"
                  type="text"
                  ref={firstNameRef}
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
                {/* <CustomFormField
                  controlid="floatingCounty"
                  name="county"
                  label="Judet"
                  type="text"
                  ref={countyRef}
                /> */}
                <AutocompleteFormField 
                  controlid="floatingCounty"
                  name="county"
                  placeholder="Judet"
                  type="text"
                  ref={countyRef}
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
