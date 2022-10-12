import { FloatingLabel, Form } from 'react-bootstrap';
import React, { useState } from 'react';
import { ErrorMessage, useField } from 'formik';

const FormField = (props, ref) => {
    const [field, meta] = useField(props);
    const [replace, setReplace] = useState('1');

    function limitInput(event, value, maxLength) {
        const key = event.keyCode || event.charCode;
        // console.log('field: ', field)
        if(key >= 48 && key <= 57) {
            if (value != undefined && replace.length > maxLength && key != 8) {
                event.preventDefault();
                return;
            }
            console.log('field: ', field)
            setReplace(prev => prev.concat('1'))
        } else if(key === 8) {
            if(replace.length <= 1) return;
            setReplace(prev => prev.slice(0, prev.length-1));
        } 
    }

    return (
        <>
            <FloatingLabel
                controlid={props.control}
                label={props.label}
                className="form-field"
            >
                <Form.Control 
                    name={props.name}
                    placeholder="Phone number"
                    ref={ref}
                    onKeyDownCapture={event => limitInput(event, meta.value, 10)}
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