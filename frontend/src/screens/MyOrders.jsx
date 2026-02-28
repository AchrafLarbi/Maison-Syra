import React from "react";
import { Container, Row, Col, Card, Badge } from "react-bootstrap";
import { useEffect } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Link, useNavigate } from "react-router-dom";
import { MyOrdersAction } from "../actions/OrderActions";

function MyOrders() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const myOrders = useSelector((state) => state.myOrdersReducers);

  const {
    loading: loadingOrders,
    error: errorOrders,
    orders,
    success: successOrders,
  } = myOrders;

  useEffect(() => {
    if (!userLogin.userInfo) {
      navigate("/login");
    } else {
      // load orders
      if (!orders || !successOrders) {
        dispatch(MyOrdersAction());
      }
    }
  }, [dispatch, navigate, userLogin.userInfo, successOrders, orders]);

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Container className="py-4">
      <Card className="shadow border-0 mb-4">
        <Card.Header className="bg-primary text-white py-3">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <h3 className="mb-0 me-2">
              <i className="bi bi-bag me-2"></i>
              <span className="d-none d-sm-inline">Mes Commandes</span>
              <span className="d-inline d-sm-none">Commandes</span>
            </h3>
            <Badge
              bg="light"
              text="dark"
              pill
              className="px-2 py-1 fs-6 flex-shrink-0"
            >
              {orders ? orders.length : 0}
              <span className="d-none d-sm-inline"> Commandes</span>
            </Badge>
          </div>
        </Card.Header>

        <Card.Body className="p-4">
          {loadingOrders ? (
            <div className="text-center py-5">
              <Loader />
            </div>
          ) : errorOrders ? (
            <Message variant="danger">
              <i className="bi bi-exclamation-circle me-2"></i>
              {errorOrders}
            </Message>
          ) : orders && orders.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-cart fa-4x mb-3 text-muted"></i>
              <h4 className="mb-3">Vous n'avez encore passé aucune commande</h4>
              <p className="text-muted mb-4">
                Parcourez nos produits et passez votre première commande
                aujourd'hui !
              </p>
              <Link to="/" className="btn btn-primary px-4 py-2">
                <i className="bi bi-shop me-2"></i>
                Commencer les Achats
              </Link>
            </div>
          ) : (
            <Row>
              {orders &&
                orders.map((order) => (
                  <Col md={6} lg={4} key={order.id} className="mb-4">
                    <Card className="h-100 shadow-sm border-0 order-card">
                      <Card.Header className="d-flex justify-content-between align-items-center bg-light">
                        <h5 className="mb-0">Commande #{order.id}</h5>
                        <small className="text-muted">
                          {formatDate(order.createdAt)}
                        </small>
                      </Card.Header>

                      <Card.Body className="d-flex flex-column">
                        <div className="mb-3">
                          <div className="d-flex justify-content-between mb-2">
                            <span className="text-muted">Total Commande:</span>
                            <span className="fw-bold">
                              {order.totalPrice} DZD
                            </span>
                          </div>

                          <div className="d-flex justify-content-between mb-2">
                            <span className="text-muted">
                              Statut de Paiement:
                            </span>
                            {order.isPaid ? (
                              <Badge bg="success" pill className="px-3 py-2">
                                <i className="bi bi-check me-1"></i> Payé
                              </Badge>
                            ) : (
                              <Badge
                                bg="warning"
                                text="dark"
                                pill
                                className="px-3 py-2"
                              >
                                <i className="bi bi-clock me-1"></i> En Attente
                              </Badge>
                            )}
                          </div>

                          <div className="d-flex justify-content-between">
                            <span className="text-muted">
                              Statut de Livraison:
                            </span>
                            {order.isDelivered ? (
                              <Badge bg="success" pill className="px-3 py-2">
                                <i className="bi bi-truck me-1"></i> Livré
                              </Badge>
                            ) : (
                              <Badge
                                bg="info"
                                text="white"
                                pill
                                className="px-3 py-2"
                              >
                                <i className="bi bi-box me-1"></i> En Traitement
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="mt-auto">
                          <Button
                            variant="primary"
                            className="w-100 py-2"
                            onClick={() => navigate(`/order/${order.id}`)}
                          >
                            <i className="bi bi-eye me-2"></i>
                            View Order Details
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
            </Row>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
export default MyOrders;
