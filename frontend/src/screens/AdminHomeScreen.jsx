import React, { useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Badge,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { adminGetAllOrdersAction } from "../actions/AdminActions";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { formatCurrency } from "../utils/currency";
import {
  FiShoppingCart,
  FiCheck,
  FiTruck,
  FiDollarSign,
  FiPackage,
  FiUsers,
  FiEye,
  FiActivity,
} from "react-icons/fi";

function AdminHomeScreen() {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const allOrders = useSelector((state) => state.allOrders);
  const { orders, loading, error } = allOrders;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(adminGetAllOrdersAction());
    }
  }, [dispatch, userInfo]);

  const getTotalStats = () => {
    if (!orders)
      return {
        totalOrders: 0,
        paidOrders: 0,
        deliveredOrders: 0,
        totalRevenue: 0,
      };

    const totalOrders = orders.length;
    const paidOrders = orders.filter((order) => order.isPaid).length;
    const deliveredOrders = orders.filter((order) => order.isDelivered).length;
    const totalRevenue = orders.reduce(
      (sum, order) => sum + parseFloat(order.totalPrice || 0),
      0
    );

    return { totalOrders, paidOrders, deliveredOrders, totalRevenue };
  };

  const stats = getTotalStats();

  return (
    <Container>
      <Row className="my-4">
        <Col>
          <h1>Tableau de Bord Admin</h1>
          <p className="text-muted">
            Bon retour, {userInfo?.name}! Voici votre aperçu d'activité.
          </p>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center bg-primary text-white">
            <Card.Body>
              <FiShoppingCart size={32} className="mb-2" />
              <h3>{stats.totalOrders}</h3>
              <Card.Text>Total des Commandes</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center bg-success text-white">
            <Card.Body>
              <FiCheck size={32} className="mb-2" />
              <h3>{stats.paidOrders}</h3>
              <Card.Text>Commandes Payées</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center bg-info text-white">
            <Card.Body>
              <FiTruck size={32} className="mb-2" />
              <h3>{stats.deliveredOrders}</h3>
              <Card.Text>Commandes Livrées</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center bg-warning text-white">
            <Card.Body>
              <FiDollarSign size={32} className="mb-2" />
              <h3>{formatCurrency(stats.totalRevenue)}</h3>
              <Card.Text>Chiffre d'Affaires Total</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="h-100">
            <Card.Body className="text-center">
              <FiActivity size={48} className="text-primary mb-3" />
              <Card.Title>Gestion des Commandes</Card.Title>
              <Card.Text>
                Voir, gérer et traiter les commandes clients
              </Card.Text>
              <Link to="/admin/orders">
                <Button variant="primary" size="lg">
                  <FiShoppingCart className="me-2" />
                  Gérer les Commandes
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100">
            <Card.Body className="text-center">
              <FiPackage size={48} className="text-success mb-3" />
              <Card.Title>Gestion des Produits</Card.Title>
              <Card.Text>
                Ajouter, modifier et gérer votre catalogue de produits
              </Card.Text>
              <Link to="/admin/products">
                <Button variant="success" size="lg">
                  <FiPackage className="me-2" />
                  Gérer les Produits
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100">
            <Card.Body className="text-center">
              <FiUsers size={48} className="text-info mb-3" />
              <Card.Title>Gestion des Utilisateurs</Card.Title>
              <Card.Text>Voir et gérer les comptes clients</Card.Text>
              <Link to="/admin/users">
                <Button variant="info" size="lg">
                  <FiUsers className="me-2" />
                  Gérer les Utilisateurs
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Orders Table */}
      <Row>
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h4>Commandes Récentes</h4>
              <Link to="/admin/orders">
                <Button variant="outline-primary" size="sm">
                  <FiEye className="me-1" />
                  Voir Toutes les Commandes
                </Button>
              </Link>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <Loader />
              ) : error ? (
                <Message variant="danger">{error}</Message>
              ) : (
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                  <Table striped bordered hover responsive>
                    <thead
                      style={{
                        position: "sticky",
                        top: 0,
                        backgroundColor: "#fff",
                        zIndex: 1,
                      }}
                    >
                      <tr>
                        <th>ID Commande</th>
                        <th>Client</th>
                        <th>Téléphone</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Paiement</th>
                        <th>Livraison</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders &&
                        orders.slice(0, 10).map((order) => (
                          <tr key={order.id}>
                            <td>
                              <Link
                                to={`/order/${order.id}`}
                                className="text-decoration-none"
                              >
                                #{order.id}
                              </Link>
                            </td>
                            <td>{order.shippingAddress?.name || order.user?.name || "N/A"}</td>
                            <td>{order.shippingAddress?.phone || "N/A"}</td>
                            <td>
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td>{formatCurrency(order.totalPrice)}</td>
                            <td>
                              <Badge bg={order.isPaid ? "success" : "warning"}>
                                {order.isPaid ? "Payé" : "Non Payé"}
                              </Badge>
                            </td>
                            <td>
                              <Badge
                                bg={order.isDelivered ? "success" : "secondary"}
                              >
                                {order.isDelivered ? "Livré" : "En Attente"}
                              </Badge>
                            </td>
                            <td>
                              <Link to={`/order/${order.id}`}>
                                <Button variant="outline-primary" size="sm">
                                  Gérer
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AdminHomeScreen;
