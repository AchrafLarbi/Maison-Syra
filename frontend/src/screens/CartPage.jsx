import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addToCartAction, removeItemCartAction } from "../actions/CartActions";
import Message from "../components/Message";
import DirectCheckoutForm from "../components/DirectCheckoutForm";

function CartPage() {
  const { id } = useParams();
  const [showCheckout, setShowCheckout] = useState(false);

  // get quantit from the url
  const quantity = window.location.search
    ? Number(window.location.search.split("=")[1])
    : 1;
  const dispatch = useDispatch();
  // select cart from the state
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  useEffect(() => {
    if (id) {
      dispatch(addToCartAction(id, quantity));
    }
  }, [dispatch, id, quantity]);
  const removeFromCartHandler = (id) => {
    dispatch(removeItemCartAction(id)); // remove the item from the cart
  };
  const checkoutHandler = () => {
    setShowCheckout(true);
  };

  return (
    <div>
      <h1>Panier d'Achat</h1>
      {/* if the cart is empty */}
      {cartItems.length === 0 ? (
        <Message>
          {" "}
          Votre panier est vide <Link to="/">Retourner</Link>
        </Message>
      ) : (
        <Link to="/">Retourner</Link>
      )}
      <Row>
        <Col md={showCheckout ? 6 : 8}>
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroup.Item key={item.product}>
                <Row className="align-items-center">
                  <Col md={2}>
                    <Image
                      src={`${process.env.REACT_APP_MEDIA_URL}${item.image}`}
                      alt={item.name}
                      fluid
                      rounded
                    />
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>{item.price} DZD</Col>
                  <Col md={3}>
                    <Form.Control
                      as="select"
                      value={item.quantity}
                      onChange={(e) =>
                        dispatch(
                          addToCartAction(item.product, Number(e.target.value))
                        )
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => removeFromCartHandler(item.product)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        
        {!showCheckout ? (
          <Col md={4}>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2 className="fs-4">
                    Sous-total ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
                    articles
                  </h2>
                  <div className="fs-3 fw-bold text-primary">
                    {cartItems
                      .reduce((acc, item) => acc + item.quantity * item.price, 0)
                      .toFixed(2)}{" "}
                    DZD
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid gap-2">
                    <Button
                      type="button"
                      variant="dark"
                      size="lg"
                      disabled={cartItems.length === 0}
                      onClick={checkoutHandler}
                    >
                      Procéder au Paiement
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        ) : (
          <Col md={6}>
            <DirectCheckoutForm items={cartItems} />
            <div className="text-center mt-3">
              <Button variant="link" onClick={() => setShowCheckout(false)}>
                Modifier le panier
              </Button>
            </div>
          </Col>
        )}
      </Row>{" "}
    </div>
  );
}

export default CartPage;
