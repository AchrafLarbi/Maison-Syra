import React, { useEffect, useState } from "react";
import { Button, Card, Col, ListGroup, Row, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import Message from "../components/Message";
import {
  deliverOrderAction,
  getOrderDetailsAction,
  payOrderAction,
} from "../actions/OrderActions";
import {
  adminDeliverOrderAction,
  adminGetOrderDetailsAction,
  adminPayOrderAction,
} from "../actions/AdminActions";
import {
  ORDER_DELIVER_RESET,
  ORDER_DETAILS_RESET,
  ORDER_PAY_RESET,
} from "../constants/OrderConstants";

function OrderScreen() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [deliveryImage, setDeliveryImage] = useState(null);
  const [showImageUpload, setShowImageUpload] = useState(false);

  // user login state
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const orderDetails = useSelector((state) => state.orderDetails);

  const { order, error, loading } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { success: successPay, loading: loadingPay } = orderPay;

  // order delivere state
  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { success: successDeliver, loading: loadingDeliver } = orderDeliver;
  useEffect(() => {
    console.log(`[OrderScreen] useEffect triggered - ID: ${id}`);
    console.log(`[OrderScreen] User info:`, userInfo);
    console.log(`[OrderScreen] Is Admin:`, userInfo?.isAdmin);

    // Always reset and fetch fresh data when id changes
    dispatch({ type: ORDER_PAY_RESET });
    dispatch({ type: ORDER_DELIVER_RESET });
    dispatch({ type: ORDER_DETAILS_RESET });

    if (userInfo && userInfo.isAdmin) {
      console.log(`[OrderScreen] Using ADMIN route for order ${id}`);
      dispatch(adminGetOrderDetailsAction(id));
    } else {
      console.log(`[OrderScreen] Using REGULAR route for order ${id}`);
      dispatch(getOrderDetailsAction(id));
    }
  }, [id, successDeliver, successPay, dispatch, userInfo]);

  // Debug loading state changes
  useEffect(() => {
    console.log(`[OrderScreen] Loading state changed: ${loading}`);
    console.log(`[OrderScreen] Error state: ${error}`);
    console.log(`[OrderScreen] Order exists: ${!!order}`);
  }, [loading, error, order]);

  const markAsPaidHandler = () => {
    const paymentResult = {
      id: `admin_payment_${Date.now()}`,
      status: "COMPLETED",
      update_time: new Date().toISOString(),
      email_address: "admin@ecommerce.com",
    };

    // Use admin route for payment
    if (userInfo && userInfo.isAdmin) {
      dispatch(adminPayOrderAction(id, paymentResult));
    } else {
      dispatch(payOrderAction(id, paymentResult));
    }
  };

  const deliverHandler = () => {
    if (deliveryImage) {
      // If image is selected, upload it first then mark as delivered
      const formData = new FormData();
      formData.append("deliveryImage", deliveryImage);
      formData.append("orderId", id);

      // Use admin route for delivery with image
      if (userInfo && userInfo.isAdmin) {
        dispatch(adminDeliverOrderAction(id, formData));
      } else {
        dispatch(deliverOrderAction(id, formData));
      }
    } else {
      // Mark as delivered without image - use admin route if admin
      if (userInfo && userInfo.isAdmin) {
        dispatch(adminDeliverOrderAction(id));
      } else {
        dispatch(deliverOrderAction(id));
      }
    }
    setShowImageUpload(false);
    setDeliveryImage(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDeliveryImage(file);
    }
  };

  return (
    <div>
      <h1>Order {id}</h1>

      {/* Debug info for development */}
      {process.env.NODE_ENV === "development" && (
        <div
          style={{
            background: "#f8f9fa",
            padding: "10px",
            margin: "10px 0",
            borderRadius: "5px",
            fontSize: "12px",
          }}
        >
          <strong>Debug Info:</strong>
          <br />
          Loading: {loading ? "Yes" : "No"} | Error: {error || "None"} | Order:{" "}
          {order ? `Loaded (ID: ${order.id})` : "Not loaded"} | Admin:{" "}
          {userInfo?.isAdmin ? "Yes" : "No"} | API URL:{" "}
          {process.env.REACT_APP_API_URL || "http://localhost:8000"}
        </div>
      )}

      {loading ? (
        <Loader></Loader>
      ) : error ? (
        <Message variant="danger"> {error}</Message>
      ) : !order ? (
        <Loader></Loader>
      ) : (
        <Row>
          <Col md={8}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>
                  <i className="bi bi-truck me-2"></i>
                  Shipping
                </h2>
                <p>
                  <strong>Name: </strong>
                  {order.user ? order.user.name : "Guest"}
                  <br />
                  <strong>Email: </strong>
                  {order.user ? (
                    <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                  ) : (
                    "N/A"
                  )}
                </p>
                <p>
                  <strong>Shipping: </strong>
                  {order && order.shippingAddress
                    ? `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`
                    : "Loading..."}
                  <br />
                  {order &&
                    order.shippingAddress &&
                    order.shippingAddress.phone && (
                      <>
                        <strong>Phone: </strong>
                        {order.shippingAddress.phone}
                      </>
                    )}
                </p>
                {order.isDelivered ? (
                  <div>
                    <Message variant="success">
                      Livré le {order.deliveredAt}
                    </Message>
                    {order.deliveryImage && (
                      <div className="mt-2">
                        <small className="text-muted">
                          Preuve de Livraison:
                        </small>
                        <br />
                        <img
                          src={`${process.env.REACT_APP_MEDIA_URL}${order.deliveryImage}`}
                          alt="Preuve de Livraison"
                          style={{ maxWidth: "200px", maxHeight: "150px" }}
                          className="img-thumbnail"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <Message variant="warning">Non Livré</Message>
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                <h2>
                  <i className="bi bi-credit-card me-2"></i>
                  Payment Method
                </h2>
                <strong>Method: </strong>
                {order.paymentMethod}
                {order.isPaid ? (
                  <Message variant="success">Payé le {order.paidAt}</Message>
                ) : (
                  <Message variant="warning">Non Payé</Message>
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                <h2>
                  <i className="bi bi-bag me-2"></i>
                  Order Items
                </h2>
                {order.orderItems.length === 0 ? (
                  <Message variant="info">Votre commande est vide</Message>
                ) : (
                  <ListGroup variant="flush">
                    {order.orderItems.map((item, index) => (
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
                            {item.quantity} x {item.price} DZD ={" "}
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
                    <h2>Order Summary</h2>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Items Price</Col>
                      <Col>{order.itemsPrice} DZD</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Shipping</Col>
                      <Col>{order.shippingPrice} DZD</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Tax</Col>
                      <Col>{order.taxPrice} DZD</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Total</Col>
                      <Col>{order.totalPrice} DZD</Col>
                    </Row>
                  </ListGroup.Item>
                  {/* payment */}
                  <ListGroup.Item>
                    {loadingPay && <Loader></Loader>}
                    {/* Admin Mark as Paid Button */}
                    {userInfo && userInfo.isAdmin && !order.isPaid && (
                      <Button
                        type="button"
                        className="btn btn-success w-100"
                        onClick={markAsPaidHandler}
                        disabled={loadingPay}
                      >
                        <i className="bi bi-check-circle me-2"></i>
                        {loadingPay
                          ? "Traitement..."
                          : "Marquer Paiement Effectué"}
                      </Button>
                    )}
                  </ListGroup.Item>
                  {/* deliver - Now works for both paid and unpaid orders */}
                  {loadingDeliver ? (
                    <Loader></Loader>
                  ) : (
                    userInfo &&
                    userInfo.isAdmin &&
                    !order.isDelivered && (
                      <ListGroup.Item>
                        {!showImageUpload ? (
                          <div>
                            <Button
                              type="button"
                              className="btn btn-primary w-100 mb-2"
                              onClick={() => setShowImageUpload(true)}
                            >
                              <i className="bi bi-truck me-2"></i>
                              Mark As Delivered
                            </Button>
                            <Button
                              type="button"
                              className="btn btn-outline-primary w-100"
                              onClick={deliverHandler}
                            >
                              <i className="bi bi-check-circle me-2"></i>
                              Mark As Delivered (No Image)
                            </Button>
                          </div>
                        ) : (
                          <div>
                            <Form.Group className="mb-3">
                              <Form.Label>
                                <i className="bi bi-camera me-2"></i>
                                Upload Delivery Proof Image
                              </Form.Label>
                              <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                              />
                            </Form.Group>
                            <div className="d-flex gap-2">
                              <Button
                                type="button"
                                className="btn btn-success flex-fill"
                                onClick={deliverHandler}
                                disabled={!deliveryImage}
                              >
                                <i className="bi bi-upload me-2"></i>
                                Confirm Delivery
                              </Button>
                              <Button
                                type="button"
                                className="btn btn-secondary flex-fill"
                                onClick={() => {
                                  setShowImageUpload(false);
                                  setDeliveryImage(null);
                                }}
                              >
                                <i className="bi bi-x me-2"></i>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}
                      </ListGroup.Item>
                    )
                  )}
                </ListGroup>
              </Card>
            </div>
          </Col>
        </Row>
      )}
    </div>
  );
}

export default OrderScreen;
