import { FloatingLabel, Form } from 'react-bootstrap';
import React from 'react';
import { ErrorMessage, useField } from 'formik';

const FormField = (props, ref) => {
    const [field, meta] = useField(props);
    return (
        <>
            <FloatingLabel
                controlid={props.control}
                label={props.label}
                className="form-field"
            >
                <Form.Control 
                    type={props.type}
                    placeholder="Email address"
                    name={props.name}
                    ref={ref}
                    required
                    {...field}{...props}
                    className={`${meta.touched && meta.error && 'invalid-form-control'}`}
                />
                <div className='invalid-field'>
                    <ErrorMessage name={field.name} />
                </div>
            </FloatingLabel>
        </>
    );
}

const CustomFormField = React.forwardRef(FormField);

export default CustomFormField;