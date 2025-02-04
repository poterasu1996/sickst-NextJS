import { FloatingLabel, Form } from 'react-bootstrap';
import React from 'react';

const CustomFormField = (props) => {
    const { label, type, error, className } = props;
    // console.log("props", props)
    return (
        <>
            <FloatingLabel
                label={label}
                className={className ?  `form-field ${className}` : "form-field"}
                >
                <Form.Control 
                    type={type}
                    placeholder={label}
                    {...props}
                    className={`${error ? 'invalid-form-control' : ''}`}
                />
                <div className='invalid-field'>
                    <>{error}</>
                </div>
            </FloatingLabel>
        </>
    );
}

export default CustomFormField;