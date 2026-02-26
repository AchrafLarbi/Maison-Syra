import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import Message from "../components/Message";
import {
  Alert,
  Button,
  Card,
  Col,
  Row,
  Table,
  Badge,
  Form,
  InputGroup,
} from "react-bootstrap";
import AlertModal from "../components/AertModal";
import {
  deleteProductAction,
  productsListAction,
} from "../actions/productActions";
import Paginator from "../components/Paginator";
import SearchBox from "../components/SearchBox";
import { FiEdit3, FiTrash2, FiEye } from "react-icons/fi";

function ProductsListScreen() {
  const searchQuery = window.location.search ? window.location.search : "";
  const keyword = searchQuery
    ? searchQuery.split("keyword=")[1].split("&")[0]
    : "";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userLogin.userInfo);
  const productsList = useSelector((state) => state.productsList);
  const { loading, error, products, page, pages } = productsList;
  const productDelete = useSelector((state) => state.productDelete);
  const {
    error: errorDelete,
    success: successDelete,
  } = productDelete;
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate("/login?redirect=admin/users");
    } else {
      dispatch(productsListAction(searchQuery));
    }
  }, [dispatch, navigate, userInfo, successDelete, searchQuery]);

  const deleteHandler = (id) => {
    dispatch(deleteProductAction(id));
  };

  return (
    <div className="product-list-container py-4">
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col lg={4}>
              <h2 className="mb-0">
                <i className="fas fa-box me-2 text-primary"></i>
                Product Management
              </h2>
            </Col>
            <Col lg={4} className="my-3 my-lg-0">
              <InputGroup>
                <SearchBox className="border-start-0" />
              </InputGroup>
            </Col>
            <Col lg={4} className="text-end">
              <Button
                className="rounded-pill"
                size="sm"
                variant="primary"
                onClick={() => navigate("/admin/products/add")}
              >
                <i className="fas fa-plus me-2"></i> Add New Product
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {errorDelete && (
        <Alert variant="danger" className="d-flex align-items-center">
          <i className="fas fa-exclamation-circle me-2"></i>
          {errorDelete}
        </Alert>
      )}

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Card className="shadow-sm border-0">
          <Card.Header className="bg-light">
            <Row className="align-items-center">
              <Col>
                <h5 className="mb-0">Liste des Produits</h5>
              </Col>
              <Col xs="auto">
                <Form.Select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="form-select-sm"
                >
                  <option value="all">Toutes les Catégories</option>
                  <option value="brume intérieur">Brume Intérieur</option>
                  <option value="savon liquide">Savon Liquide</option>
                  <option value="diffuseur intérieur">Diffuseur Intérieur</option>
                  <option value="Pack">Pack</option>
                  <option value="brume auto">Brume Auto</option>
                </Form.Select>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover className="align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>ID</th>
                    <th>PRODUIT</th>
                    <th>PRIX</th>
                    <th>CATÉGORIE</th>
                    <th>MARQUE</th>
                    <th>STOCK</th>
                    <th className="text-center">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {products
                    .filter((p) => filter === "all" || p.category === filter)
                    .map((product) => (
                    <tr key={product.id}>
                      <td>
                        <Badge bg="light" text="dark" pill>
                          #{product.id}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div
                            className="product-img-wrapper me-3"
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "8px",
                              overflow: "hidden",
                              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            }}
                          >
                            <img
                              src={`${process.env.REACT_APP_MEDIA_URL}${product.image}`}
                              alt={product.name}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                          <div>
                            <h6 className="mb-0">{product.name}</h6>
                            <small className="text-muted">
                              SKU: {product.id}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <h6 className="mb-0 text-primary">
                          {product.price}DZD
                        </h6>
                      </td>
                      <td>
                        <Badge bg="info" text="dark" pill>
                          {product.category}
                        </Badge>
                      </td>
                      <td>
                        <span className="fw-medium">{product.brand}</span>
                      </td>
                      <td>
                        {product.countInStock > 0 ? (
                          <Badge bg="success" pill>
                            En Stock ({product.countInStock})
                          </Badge>
                        ) : (
                          <Badge bg="danger" pill>
                            Rupture de Stock
                          </Badge>
                        )}
                      </td>
                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          <Button
                            as={Link}
                            to={`/admin/products/${product.id}/edit`}
                            variant="outline-primary"
                            size="md"
                            className="border-0 rounded-pill px-3"
                          >
                            <FiEdit3 className="me-1" /> Edit
                          </Button>

                          <AlertModal
                            myaction={() => deleteHandler(product.id)}
                            customebutton={
                              <Button
                                variant="outline-danger"
                                size="md"
                                className="border-0 rounded-pill px-3"
                              >
                                <FiTrash2 className="me-1" /> Delete
                              </Button>
                            }
                            title="Supprimer le Produit"
                          />

                          <Button
                            variant="outline-secondary"
                            size="md"
                            as={Link}
                            to={`/product/${product.id}`}
                            target="_blank"
                            className="border-0 rounded-pill px-3"
                          >
                            <FiEye className="me-1" /> Voir
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            {products.length === 0 && (
              <div className="text-center py-5">
                <i className="fas fa-box-open fa-3x text-muted mb-3"></i>
                <h5>No products found</h5>
                <p className="text-muted">
                  Try changing your search criteria or add a new product
                </p>
              </div>
            )}
          </Card.Body>
          <Card.Footer className="bg-white">
            <Paginator
              page={page}
              pages={pages}
              isAdmin={true}
              keyword={keyword}
            />
          </Card.Footer>
        </Card>
      )}
    </div>
  );
}

export default ProductsListScreen;
