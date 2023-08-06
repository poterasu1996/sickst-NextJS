import { Form, Formik } from "formik";
import { useContext, useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import CustomFormField from "../global/form/CustomFormField";
import DateFormField from "../global/form/DateFormField";
import countyService from "../../shared/services/countyService";
import * as Yup from "yup";
import { Autocomplete, TextField } from "@mui/material";
import { AppUtils } from "../../shared/utils/app.utils";
import AccountContext from "../../store/account-context";
import { GenderEnum, IUserDetailsModel } from "../../models/UserDetails.model";

const PersonalInfo = () => {
    const [formData, setFormData] = useState<{
        address: string,
        birthday: Date | string,
        city: string,
        county: string,
        full_name: string,
        gender: {title: string, value: string}[],
        phone: string,
    }>({
        address: '',
        birthday: '',
        city: '',
        county: '',
        full_name: '',
        gender: [
            {title: 'Domnul', value: 'male'}
        ],
        phone: '',
    })

    const countyList = countyService.getCountyList();
    const [personalInfo, setPersonalInfo] = useState<IUserDetailsModel | null>(null);
    const [personalInfoID, setPersonaInfoID] = useState(null);
    const genderList = [
        {title: 'Domnul', value: 'male'},
        {title: 'Doamna', value: 'female'},
        {title: 'Alta', value: 'other'}
    ];
    const accountManager = useContext(AccountContext);
    const { id } = accountManager!.currentUser!;

    const validate = Yup.object({
        address: Yup.string().required('Campul este obligatoriu*'),
        phone: Yup.string().min(10, 'Numarul de telefon nu este corect').max(10, 'Numarul de telefon nu este corect').required('Campul este obligatoriu*'),
        full_name: Yup.string().required('Campul este obligatoriu*'),
        city: Yup.string().required('Campul este obligatoriu*'),
        county: Yup.string().required('Campul este obligatoriu'),
        gender: Yup.string().required('Campul este obligatoriu'),
    })

    const submitHandler = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        let parsedName: {first_name: string, last_name: string} | null = null;
        if(formData.full_name) {
            parsedName = AppUtils.splitUserFullName(formData.full_name)
        } 

        const data: IUserDetailsModel = {
            address: formData.address,
            birthday: AppUtils.parseBirthdayDate(formData.birthday),
            city: formData.city,
            client_role: personalInfo!.client_role,
            county: formData.county,
            first_name: parsedName!.first_name,
            gender: formData.gender[0].value,
            last_name: parsedName!.last_name,
            phone_number: formData.phone,
            user_id: id
        }

        accountManager?.addPersonalInfo(data, personalInfoID!)
    }

    useEffect(() => {
        accountManager?.fetchPersonalInfo().then(response => {
            setPersonalInfo(response.data[0].attributes)
            setPersonaInfoID(response.data[0].id)
        })
    }, [])

    useEffect(() => {
        if(personalInfo) {
            setFormData({
                address: personalInfo.address ? personalInfo.address : '',
                birthday: AppUtils.parseDBBirthdayDate(personalInfo.birthday),
                city: personalInfo.city ? personalInfo.city : '',
                county: personalInfo.county ? personalInfo.county : '',
                phone: personalInfo.phone_number ? personalInfo.phone_number : '',
                full_name: personalInfo.first_name + " " + personalInfo.last_name,
                gender: [personalInfo.gender === GenderEnum.MALE 
                    ? {title: 'Domnul', value: 'male'}
                    : personalInfo.gender === GenderEnum.FEMALE 
                        ? {title: 'Doamna', value: 'female'}
                        : {title: 'Alta', value: 'other'}
                ]
            })
        }
    }, [personalInfo])

    return (
        <>
            <Formik
                enableReinitialize
                initialValues={{
                    address: formData.address,
                    full_name: formData.full_name,
                    city: formData.city,
                    county: formData.county,
                    gender: formData.gender[0].value,
                    phone: formData.phone,
                }}
                validationSchema={validate}
            >
                {(formik) => (
                    <div className="user-details">
                        <div className="title">Detalii cont</div>
                        <div className="info">Detaliile personale pot ajuta la imbunatatirea serviciului nostru.</div>
                        <Form onSubmit={submitHandler} className="user-details-form">
                            <Row>
                                <Col lg={6}>
                                    <CustomFormField 
                                        controlid="floatingFullName"
                                        name="full_name"
                                        label="Nume si Prenume"
                                        type="text"
                                        value={formData.full_name}
                                        onChange={(e: any) => {
                                            setFormData({...formData, full_name: e.target.value});
                                            formik.setFieldValue('full_name', e.target.value);
                                        }}
                                    />
                                </Col>
                                <Col lg={6}>
                                    <CustomFormField 
                                        controlid="floatingPhone"
                                        name="phone"
                                        label="Telefon"
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e: any) => {
                                            setFormData({...formData, phone: e.target.value});
                                            formik.setFieldValue('phone', e.target.value);
                                        }}
                                    />
                                </Col>
                            </Row>
                            <CustomFormField 
                                controlid="floatingAddress"
                                name="address"
                                label="Adresa"
                                type="text"
                                value={formData.address}
                                onChange={(e: any) => {
                                    setFormData({...formData, address: e.target.value});
                                    formik.setFieldValue('address', e.target.value);
                                }}
                            />
                            <Row>
                                <Col lg={6}>
                                    <CustomFormField 
                                        controlid="floatingCity"
                                        name="city"
                                        label="Oras"
                                        type="text"
                                        value={formData.city}
                                        onChange={(e: React.BaseSyntheticEvent) => {
                                            setFormData({...formData, city: e.target.value});
                                            formik.setFieldValue('city', e.target.value);
                                        }}
                                    />
                                </Col>
                                <Col lg={6}>
                                    <Autocomplete 
                                        className="custom-autocomplete"
                                        disablePortal
                                        id="county"
                                        options={countyList}
                                        value={formData.county || ''}
                                        onChange={(event, value) => {
                                            formik.setFieldValue('county', value);
                                            setFormData({...formData, county: value!})
                                        }}
                                        inputValue={formik.values.county || ""}
                                        onInputChange={(event, value) => {
                                            formik.setFieldValue('county', value);
                                            setFormData({...formData, county: value!})
                                        }}
                                        renderInput={(params) => <TextField {...params} label="Judet" />}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={6}>
                                    <DateFormField 
                                        placeholder="Data de nastere"
                                        value={formData.birthday}
                                        onChange={(val: React.BaseSyntheticEvent) => {
                                            formik.setFieldValue('birthday', val.target.value.toLocaleDateString('en-GB'));
                                            setFormData({...formData, birthday: val.target.value});
                                        }}
                                    />
                                </Col>
                                <Col lg={6}>
                                    <Autocomplete 
                                        className="custom-autocomplete"
                                        disablePortal
                                        id="gender"
                                        options={genderList}
                                        value={formData.gender[0]}
                                        getOptionLabel={(option) => option.title}
                                        onChange={(event, value) => {
                                            formik.setFieldValue('gender', value?.value);
                                            setFormData({...formData, gender: [{...value!}]});
                                        }}
                                        renderInput={(params) => <TextField {...params} label="Forma de adresare" />}
                                    />
                                </Col>
                            </Row>
                            <Button 
                                className="button-second mt-5" 
                                type="submit"
                                disabled={!(formik.isValid || formik.dirty)}
                            >Update information</Button>
                        </Form>
                    </div>
                )}
            </Formik>
        </>
    )
}

export default PersonalInfo;