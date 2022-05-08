import Cards from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";
import { Button, Form, Alert, Row, Col } from "react-bootstrap";
import useForm from "./UseForm";
import CustomFormField from "../CustomFormField";
import { Lock } from "react-feather";

const CreditCardForm = () => {
  const { handleChange, handleFocus, handleSubmit, values, errors } = useForm();

  return (
    <>
      <div className="credit-card">
        <div className="title">Enter your card details</div>
        <div className="description">
          <Lock
            height={22}
            width={22}
            stroke={"#35895c"}
            strokeWidth={".3rem"}
          />{" "}
          All data is encrypted. Your card number is never stored on Sickst
          servers.
        </div>
        <div className="credit-card-form">
          <Cards
            cvc={values.cvc}
            expiry={values.expiration}
            focused={values.focus}
            name={values.name}
            number={values.number}
          />
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              {/* <Form.Control
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Card holder Name"
                    values={values.name}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    // isValid={errors.cname}
                /> */}
              <CustomFormField
                controlId="floatingCardholder"
                type="text"
                id="name"
                name="name"
                label="Cardholder Name"
                placeholder="Card holder Name"
                values={values.name}
                onChange={handleChange}
                onFocus={handleFocus}
              />
            </Form.Group>
            <Form.Group>
              {console.log(errors)}
              {/* <Form.Control
                                type="number"
                                id="number"
                                name="number"
                                placeholder="Card number"
                                values={values.number}
                                onChange={handleChange}
                                onFocus={handleFocus}
                                // isValid={errors.cnumber}
                            /> */}
              <CustomFormField
                controlId="floatingCardholder"
                type="number"
                id="number"
                name="number"
                label="Card number"
                placeholder="Card number"
                values={values.number}
                onChange={handleChange}
                onFocus={handleFocus}
              />
            </Form.Group>
            <Row>
              <Col>
                <Form.Group>
                  {/* <Form.Control
                                        type="number"
                                        id="expiration"
                                        name="expiration"
                                        placeholder="Expiration"
                                        values={values.expiration}
                                        onChange={handleChange}
                                        onFocus={handleFocus}
                                        // isValid={errors.cexpiration}
                                    /> */}
                  <CustomFormField
                    controlId="floatingExpiration"
                    type="number"
                    id="expiration"
                    name="expiration"
                    label="MM / YY"
                    placeholder="Expiration"
                    values={values.expiration}
                    onChange={handleChange}
                    onFocus={handleFocus}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <CustomFormField
                    controlId="floatingCVV"
                    type="number"
                    id="cvc"
                    name="cvc"
                    label="CVC"
                    placeholder="CVC"
                    values={values.cvc}
                    onChange={handleChange}
                    onFocus={handleFocus}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button
              className="button-second mt-5"
              id="validateButton"
              type="submit"
            >
              Validate
            </Button>
            {/* <Button size='block' id='validateButton' type='submit'>Validate</Button> */}
          </Form>
          {/* <Alert
                        id="alerMessage" 
                        variant={errors.variant} show={errors.show}
                    >
                        {errors.message}
                    </Alert> */}
        </div>
      </div>
    </>
  );
};

export default CreditCardForm;
