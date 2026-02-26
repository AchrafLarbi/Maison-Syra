import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { saveShippingAddresAction } from "../actions/CartActions";
import CheckoutSteps from "../components/CheckoutSteps";

function ShippingPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
  const [country, setCountry] = useState(shippingAddress.country);
  const [phone, setPhone] = useState(shippingAddress.phone);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      saveShippingAddresAction({ address, city, postalCode, country, phone })
    );
    navigate("/payment");
  };

  return (
    <div>
      <CheckoutSteps step1 step2 />
      <h1>Livraison</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group controlId="address">
          <Form.Label>Adresse</Form.Label>
          <Form.Control
            type="text"
            placeholder="Entrez l'adresse"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="city">
          <Form.Label>Ville</Form.Label>
          <Form.Control
            type="text"
            placeholder="Entrez la ville"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="postalCode">
          <Form.Label>Code Postal</Form.Label>
          <Form.Control
            type="text"
            placeholder="Entrez le code postal"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="country">
          <Form.Label>Pays</Form.Label>
          <Form.Control
            type="text"
            placeholder="Entrez le pays"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="phone">
          <Form.Label>Numéro de Téléphone</Form.Label>
          <Form.Control
            type="tel"
            placeholder="Entrez le numéro de téléphone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type="submit" variant="primary">
          Continuer
        </Button>
      </Form>
    </div>
  );
}

export default ShippingPage;
