import { TextField } from "@mui/material";
import { FloatingLabel, Form } from "react-bootstrap";

interface Props {
    controlid: string,
    label: string,
    type: string,
    placeholder?: string,
    name: string,
    value: string,
    onChange: (e: string | React.ChangeEvent<any>) => void,
}

const CustomInputField = ({ 
    controlid,
    label,
    type,
    placeholder,
    name,
    value,
    onChange
}: Props) => {
    return (
        <FloatingLabel
            controlId={controlid}
            label={label}
            className="form-field"
        >
            <Form.Control 
                type={type}
                placeholder={placeholder}
                name={name}
                value={value}
                onChange={onChange}
            />

        </FloatingLabel>
    )
}

export default CustomInputField;