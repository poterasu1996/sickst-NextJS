import { Form, Button, Col, Row } from "react-bootstrap";
import React, { useContext, useRef, useState } from "react";
import { Formik } from "formik";
import CustomFormField from "../global/form/CustomFormField";
import { InputSwitch } from 'primereact/inputswitch';
import * as Yup from "yup";
import CustomPhoneFormField from "../global/form/CustomPhoneFormField";
import AccountContext from "../../store/account-context";
import AutocompleteFormField from "../global/form/AutocompleteFormField";
import IShippingInfo from "../../types/ShippingInfo.interface";

type Props = {
    onSubmit: () => void
}

export default function ShipmentForm({ onSubmit }: Props) {
  const accountManager = useContext(AccountContext);
  const [primary, setPrimary] = useState<boolean>(false);
  const [county, setCounty] = useState<string | null>(null);
  
  const addressRef = useRef<HTMLInputElement>();
  const full_name = useRef<HTMLInputElement>();
  const cityRef = useRef<HTMLInputElement>();
  const phoneRef = useRef<HTMLInputElement>();
  
  const validate = Yup.object({
    address: Yup.string().required("Campul este obligatoriu*"),
    full_name: Yup.string().required("Campul este obligatoriu*"),
    city: Yup.string().required("Campul este obligatoriu*"),
    county: Yup.string().required("Campul este obligatoriu*"),
    phone: Yup.string().required("Nr. de telefon este obligatoriu*"),
  });

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const data: IShippingInfo = {
      address: addressRef?.current?.value,
      full_name: full_name?.current?.value,
      city: cityRef?.current?.value,
      county: county!,
      phone: phoneRef?.current?.value,
      primary: primary,
    }
    console.log(data)

    accountManager!.addShippingInfo(data);
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
                  ref={full_name}
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
                <AutocompleteFormField 
                  controlid="floatingCounty"
                  name="county"
                  placeholder="Judet"
                  type="text"
                  handlecounty={(val: string) => setCounty(val)}
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
