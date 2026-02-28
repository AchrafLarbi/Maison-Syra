import React, { useEffect } from "react";
import CheckoutSteps from "../components/CheckoutSteps";
import { Button, Card, Col, ListGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { createOrderAction } from "../actions/OrderActions";
import { ORDER_CREATE_RESET } from "../constants/OrderConstants";

function PlaceOrderScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success, error, loading } = orderCreate;

  useEffect(() => {
    if (!cart.shippingAddress) {
      navigate("/shipping");
    } else if (!cart.paymentMethod) {
      navigate("/payment");
    }
    if (success) {
      navigate(`/order/${order.id}`);
      // reset Order
      dispatch({ type: ORDER_CREATE_RESET });
    }
  }, [success, cart.paymentMethod, cart.shippingAddress, dispatch, navigate, order]);

  cart.itemsPrice = cart.cartItems
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2);
  cart.shippingPrice = (cart.itemsPrice > 500 ? 0 : 10).toFixed(2);
  cart.taxPrice = Number((0.15 * cart.itemsPrice).toFixed(2));
  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice)
  ).toFixed(2);
  const placOrderHandler = () => {
    const order = {
      orderItems: cart.cartItems,
      paymentMethod: cart.paymentMethod,
      shippingAddress: cart.shippingAddress,
      itemsPrice: cart.itemsPrice,
      totalPrice: cart.totalPrice,
      taxPrice: cart.taxPrice,
      shippingPrice: cart.shippingPrice,
    };
    dispatch(createOrderAction(order));
  };
  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4 />
      <h1>Place Order</h1>
      <Row>
        {loading ? <Loader></Loader> : null}
        {error ? <Message variant="danger"> {error}</Message> : null}

        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Shipping: </strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city},{" "}
                {cart.shippingAddress.postalCode},{" "}
                {cart.shippingAddress.country}
                <br />
                {cart.shippingAddress.phone && (
                  <>
                    <strong>Phone: </strong>
                    {cart.shippingAddress.phone}
                  </>
                )}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method: </strong>
              {cart.paymentMethod}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <Message variant="info">Votre panier est vide</Message>
              ) : (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <img
                            src={`${process.env.REACT_APP_MEDIA_URL}${item.image}`}
                            alt={item.name}
                            className="img-fluid"
                          />
                        </Col>
                        <Col>{item.name}</Col>
                        <Col md={4}>
                          {item.quantity} x {item.price} DZD =
                          {item.quantity * item.price} DZD
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <div>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>Résumé de la Commande</h2>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Articles</Col>
                    <Col>{cart.itemsPrice} DZD</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Livraison</Col>
                    <Col>{cart.shippingPrice} DZD</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Taxe</Col>
                    <Col>{cart.taxPrice} DZD</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Total</Col>
                    <Col>{cart.totalPrice} DZD</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Button
                    type="button"
                    className="btn-block"
                    disabled={cart.cartItems === 0}
                    onClick={placOrderHandler}
                  >
                    Passer la Commande
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default PlaceOrderScreen;
