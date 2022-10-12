import { FloatingLabel, Form } from "react-bootstrap";

const CustomGenderFormField = (props) => {
    return (
        <>
            <FloatingLabel
                controlId={props.controlId}
                label={props.label}
                className="form-field"
            >
                <Form.Select>
                    <option value="male">Domnul</option>
                    <option value="female">Doamna</option>
                </Form.Select>
            </FloatingLabel>
        </>
    )
}

export default CustomGenderFormField;