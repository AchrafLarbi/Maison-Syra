import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import Loader from "../components/Loader";
import Message from "../components/Message";
import {
  Alert,
  Button,
  Table,
  Row,
  Col,
  Form,
  Card,
  InputGroup,
  Badge,
  Pagination,
} from "react-bootstrap";
import { allOrdersAction } from "../actions/OrderActions";
import { FiEye } from "react-icons/fi";

function OrdersListScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userLogin.userInfo);
  const allOrders = useSelector((state) => state.allOrders);
  const { loading, error, orders } = allOrders;
  // delete user
  const userDelete = useSelector((state) => state.userDelete);
  const { success: successDelete, error: errorDelete } = userDelete;

  // Search and pagination states
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate("/login?redirect=admin/users");
    } else {
      dispatch(allOrdersAction());
    }
  }, [dispatch, navigate, userInfo, successDelete]);

  // Helper to get client name from order (shipping address first, then user)
  const getClientName = (order) =>
    order.shippingAddress?.name || order.user?.name || "N/A";

  // Helper to get client phone from order
  const getClientPhone = (order) =>
    order.shippingAddress?.phone || "N/A";

  // Filter orders based on search term
  const filteredOrders = orders
    ? orders.filter(
        (order) =>
          getClientName(order)
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (getClientPhone(order))
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.id.toString().includes(searchTerm),
      )
    : [];

  // Get current orders for pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder,
  );

  // Calculate total pages for pagination
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Generate pagination items
  let paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => setCurrentPage(number)}
      >
        {number}
      </Pagination.Item>,
    );
  }

  return (
    <div>
      {errorDelete && <Alert variant="danger">{errorDelete}</Alert>}

      {/* Breadcrumb Navigation */}
      <Row className="mb-3">
        <Col>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Accueil</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/admin">Admin</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Commandes
              </li>
            </ol>
          </nav>
        </Col>
      </Row>

      <Card className="mb-4 shadow-sm">
        <Card.Header className="bg-primary text-white">
          <Row>
            <Col>
              <h3>
                <i className="bi bi-cart me-2"></i> Gestion des Commandes
              </h3>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <Row className="mb-3 align-items-center">
            <Col md={6}>
              <h5>
                Total Commandes:{" "}
                <Badge bg="secondary">{filteredOrders.length}</Badge>
              </h5>
            </Col>
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Rechercher par nom de client ou ID de commande"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
          </Row>

          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <>
              <div className="table-responsive">
                <Table striped bordered hover responsive className="table-sm">
                  <thead className="bg-light">
                    <tr>
                      <th>ID</th>
                      <th>CLIENT</th>
                      <th>TÉLÉPHONE</th>
                      <th>DATE</th>
                      <th>TOTAL</th>
                      <th>STATUT PAIEMENT</th>
                      <th>STATUT LIVRAISON</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentOrders &&
                      currentOrders.map((order) => (
                        <tr key={order.id}>
                          <td>#{order.id}</td>
                          <td>{getClientName(order)}</td>
                          <td>{getClientPhone(order)}</td>
                          <td>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="fw-bold">{order.totalPrice} DZD</td>
                          <td>
                            {order.isPaid ? (
                              <Badge bg="success">
                                Payé le{" "}
                                {new Date(order.paidAt).toLocaleDateString()}
                              </Badge>
                            ) : (
                              <Badge bg="danger">Non Payé</Badge>
                            )}
                          </td>
                          <td>
                            {order.isDelivered ? (
                              <Badge bg="success">
                                Livré le{" "}
                                {new Date(
                                  order.deliveredAt,
                                ).toLocaleDateString()}
                              </Badge>
                            ) : (
                              <Badge bg="warning" text="dark">
                                En Attente
                              </Badge>
                            )}
                          </td>
                          <td>
                            <Link to={`/order/${order.id}/`}>
                              <Button
                                className="btn-sm me-2"
                                variant="outline-primary"
                              >
                                <FiEye className="me-1" /> Voir
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-3">
                  <Pagination>
                    <Pagination.First
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                    />
                    <Pagination.Prev
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    />
                    {paginationItems}
                    <Pagination.Next
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    />
                    <Pagination.Last
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

export default OrdersListScreen;
