import { Form, Formik } from "formik";
import { useRef } from "react";
import { Button, Col, Row } from "react-bootstrap";
import AutocompleteFormField from "../global/form/AutocompleteFormField";
import CustomFormField from "../global/form/CustomFormField";
import CustomPhoneFormField from "../global/form/CustomPhoneFormField";
import DateFormField from "../global/form/DateFormField";
import CustomGenderFormField from "../global/form/CustomGenderFormField";

const PersonalInfo = () => {
    const phoneRef = useRef();

    return (
        <>
            <Formik
                initialValues={{
                    firstName: '',
                    lastName: '',
                    address: '',
                    city: '',
                    county: '',
                    phoneNumber: '',
                    zipCode: '',
                    birthday: '',
                    gender: '',
                }}
            >
                {(formik) => (
                    <div className="user-details">
                        <Form className="user-details-form">
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
                            <CustomFormField 
                                controlid="floatingAddress"
                                name="address"
                                label="Adresa"
                                type="text"
                            />
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
                                    <AutocompleteFormField 
                                        placeholder="Judet"
                                        name="county"
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={6}>
                                    <CustomFormField 
                                        controlid="floatingZipCode"
                                        name="zipCode"
                                        label="Cod postal"
                                        type="number"
                                    />
                                </Col>
                                <Col lg={6}>
                                    <CustomPhoneFormField 
                                       controlid="floatingPhone"
                                       name="phone"
                                       label="Telefon"
                                       type="tel"
                                       ref={phoneRef}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={6}>
                                    <DateFormField 
                                        placeholder="Data de nastere"
                                    />
                                </Col>
                                <Col lg={6}>
                                    <CustomGenderFormField 
                                        controlid="floatingGender"
                                        name="gender"
                                        label="Forma de adresare"
                                    />
                                </Col>
                            </Row>
                            <Button className="button-second mt-5" type="submit">Update information</Button>
                        </Form>
                    </div>
                )}
            </Formik>
        </>
    )
}

export default PersonalInfo;