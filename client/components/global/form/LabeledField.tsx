import { ErrorMessage, useField } from "formik";
import React, { 
    forwardRef,
} from "react";
import { Form } from "react-bootstrap";
import { InputType } from "../../../shared/enums/input.enum";

interface Props {
    name: string,
    controlId: string,
    class: string,
    label: string,
    placeholder?: string,
    type: string
}

type Ref = HTMLInputElement;


const CustomLabeledField = forwardRef<Ref, Props>((props, ref) => {
    const [field, meta] = useField(props);
    console.log(props.type)
    return (
        <Form.Group
            className={props?.class}
            controlId={props.controlId}
        >
            <Form.Label>{props.label}</Form.Label>
            {props.type === InputType.TEXTAREA
                ? <Form.Control 
                    ref={ref}
                    // as={props.type}
                    // rows={4}
                    placeholder={props.placeholder}
                    {...field}
                    />
                : <Form.Control 
                    ref={ref}
                    type={props.type}
                    placeholder={props.placeholder && props.placeholder}
                    {...field}
                    />
            }
            <div className="invalid-field">
                <ErrorMessage name={field.name} />
            </div>
        </Form.Group>
    )
})

export default CustomLabeledField;