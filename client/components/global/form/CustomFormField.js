import { FloatingLabel, Form } from 'react-bootstrap';
import React from 'react';
import { ErrorMessage, useField } from 'formik';

const FormField = (props, ref) => {
    // const [field, meta] = useField(props);

    // {console.log(props.error)}
    return (
        <>
            <FloatingLabel
                controlid={props.controlid}
                label={props.label}
                className="form-field"
            >
                <Form.Control 
                    type={props.type}
                    placeholder="Email address"
                    name={props.name}
                    ref={ref}
                    onChange={props.onChange}
                    required
                    // {...field}
                    {...props}
                    // className={`${meta.touched && meta.error && 'invalid-form-control'}`}
                    className={`${props.error && 'invalid-form-control'}`}
                />
                <div className='invalid-field'>
                    <>{props.error}</>
                    {/* <ErrorMessage name={field.name} /> */}
                </div>
            </FloatingLabel>
        </>
    );
}

const CustomFormField = React.forwardRef(FormField);

export default CustomFormField;