import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "./CheckoutSteps";
import { Button, Col, Form } from "react-bootstrap";
import { savePaymentMethodAction } from "../actions/CartActions";

function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState("livrasion");
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (!shippingAddress) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethodAction(paymentMethod));
    navigate("/placeorder");
  };

  return (
    <div>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">Select Method</Form.Label>
          <Col className="my-3">
            <Form.Check
              type="radio"
              label="A livrasion"
              id="livrasion"
              name="paymentMethod"
              value="livrasion"
              checked
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
          </Col>
        </Form.Group>

        <Button type="submit" variant="primary">
          {" "}
          Continue
        </Button>
      </Form>
    </div>
  );
}

export default PaymentPage;
