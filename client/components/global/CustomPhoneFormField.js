import { FloatingLabel, Form } from 'react-bootstrap';
import React, { useState } from 'react';
import { ErrorMessage, useField } from 'formik';
import PhoneInput from 'react-phone-number-input/input';

const FormField = (props, ref) => {
    const [field, meta] = useField(props);

    return (
        <>
            <FloatingLabel
                controlid={props.control}
                label={props.label}
                className="form-field"
            >
                <PhoneInput 
                    name={props.name}
                    placeholder="Phone number"
                    country="RO" 
                    ref={ref}
                    {...field}{...props}
                    className={`form-control ${meta.touched && meta.error && 'invalid-form-control'}`}
                />
                <div className='invalid-field'>
                    <ErrorMessage name={field.name} />
                </div>
            </FloatingLabel>
        </>
    );
}

const CustomPhoneFormField = React.forwardRef(FormField);

export default CustomPhoneFormField;