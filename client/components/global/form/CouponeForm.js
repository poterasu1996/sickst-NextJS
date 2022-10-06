import { Form, Button } from "react-bootstrap";
import { useRef, useState } from "react";
import { Formik } from "formik";
import * as Yup from 'yup';
import CustomFormField from "./CustomFormField";

import axios from '../../../api/axios';
const COUPONE_URL = '/coupone-codes';

export default function CouponeForm({ couponeValue, loading }) {
    const [error, setError] = useState("");
    const couponeRef = useRef();

    const validate = Yup.object({
        // coupone: Yup.string()
        //   .required('Enter a coupone code'),
      });

      const submitHandler = async (event) => {
        event.preventDefault();
        // check for code in DB
        const enteredCode = couponeRef.current.value;

        try {
            const response = await axios.get(COUPONE_URL);
            const couponeExist = response.data.data.find(item => item.attributes.name.toUpperCase() === enteredCode.toUpperCase()) ;
            
            if(couponeExist && couponeExist.attributes.active) {
                console.log('???coupon',couponeExist)
                couponeValue({
                    discount: couponeExist.attributes.discount_procent,
                    active: true,
                })
                loading(true)

                console.log('cName', couponeExist)
            } else {
                couponeValue({
                    discount: 0,
                    active: false
                });
                console.log('Coupone not found')
            }
            
            // console.log('couponul', couponeExist)
            console.log('response', response);
        } catch (error) {
            console.log(error)
            setError('Eroare');
        }

        console.log('Checking for code...')
      }

    return (
    <Formik
        initialValues={{
        coupone: '',
        }}
        validationSchema={validate}
    >
        {formik => (
        <Form onSubmit={submitHandler}>
            <CustomFormField controlid='floatingCoupone' name='coupone' label='Have a coupone?' type='text' ref={couponeRef}/>
            {error && 
                <div className="form-errors">
                    ERROR: {error}
                </div>
            }
            <Button className="button-check-code" type="submit">Apply</Button>
        </Form>
        )}
    </Formik>
    );
    
}