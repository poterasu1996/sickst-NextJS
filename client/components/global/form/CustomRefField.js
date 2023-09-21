import { FloatingLabel, Form } from 'react-bootstrap';
import React from 'react';

const FormField = (props, ref) => {
    return (
        <>
            <FloatingLabel
                controlid={props.controlid}
                label={props.label}
                className="form-field"
                >
                <Form.Control 
                    type={props.type}
                    placeholder={props.label}
                    name={props.name}
                    ref={ref}
                    {...props}s
                    className={`${props.error && 'invalid-form-control'}`}
                />
                <div className='invalid-field'>
                    <>{props.error}</>
                </div>
            </FloatingLabel>
        </>
    );
}

const CustomRefField = React.forwardRef(FormField);

export default CustomRefField;