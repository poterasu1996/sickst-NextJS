import { Form, Formik } from "formik";
import { useRef, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import AutocompleteFormField from "../global/form/AutocompleteFormField";
import CustomFormField from "../global/form/CustomFormField";
import CustomPhoneFormField from "../global/form/CustomPhoneFormField";
import DateFormField from "../global/form/DateFormField";
import CustomGenderFormField from "../global/form/CustomGenderFormField";

const PersonalInfo = () => {
    const phoneRef = useRef();
    const [county, setCounty] = useState<string | null>(null);

    return (
        <>
            <Formik
                initialValues={{
                    fullName: '',
                    phoneNumber: '',
                    address: '',
                    city: '',
                    county: county!,
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
                                        controlid="floatingFullName"
                                        name="fullName"
                                        label="Nume si Prenume"
                                        type="text"
                                    />
                                </Col>
                                <Col lg={6}>
                                <CustomPhoneFormField 
                                    controlid="floatingPhoneNumber"
                                    name="phoneNumber"
                                    label="Telefon"
                                    type="tel"
                                    ref={phoneRef}
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
                                        type="text"
                                        handlecounty={(val: string) => setCounty(val)}
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