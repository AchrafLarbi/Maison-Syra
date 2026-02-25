import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Button,
  Card,
  Form,
  Badge,
  Alert,
} from "react-bootstrap";
import DirectCheckoutForm from "../components/DirectCheckoutForm";
import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useDispatch, useSelector } from "react-redux";
import {
  createReviewAction,
  productsDetailsAction,
} from "../actions/productActions";
import { addToCartAction } from "../actions/CartActions";
import { PRODUCT_CREATE_REVIEW_RESET } from "../constants/productConstants";
import {
  flyToCart,
  showCartSuccessIndicator,
} from "../utils/flyToCartAnimation";

function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const dispatch = useDispatch();
  // get product details form state
  const product_details = useSelector((state) => state.productDetails);
  const [rating, setRating] = useState({ rating: 0, comment: "" });
  // user login
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  // create review
  const createReview = useSelector((state) => state.createReview);
  const {
    success: successReview,
    error: errorReview,
    loading: loadingReview,
  } = createReview;

  // get product
  const { loading, product, error } = product_details;

  useEffect(() => {
    // 1// make action to update
    dispatch(productsDetailsAction(id));
    // reset the rating
    if (successReview) {
      setRating({ rating: 0, comment: "" });
      // refresh the page
      dispatch(productsDetailsAction(id));
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }
  }, [dispatch, id, successReview]);
  const checkoutHandler = () => {
    navigate(`/cart/${id}?quantity=${quantity}`);
  };
  const addToCartHandler = () => {
    // Get product image and cart icon elements
    const productImage = document.querySelector(".product-main-image");
    const cartIcon =
      document.querySelector(".cart-icon") ||
      document.querySelector("[data-cart-icon]") ||
      document.querySelector(".fa-shopping-cart");

    // Trigger fly-to-cart animation with callback
    flyToCart(productImage, cartIcon, () => {
      // Add product to cart after animation completes
      dispatch(addToCartAction(id, Number(quantity)));

      // Show success indicator
      showCartSuccessIndicator(cartIcon);
    });
  };
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createReviewAction(id, rating));
  };

  return (
    // find the product with the id

    <div>
      <Link to="/" className="btn btn-outline-secondary my-3">
        <i className="bi bi-arrow-left me-2"></i> Retour aux Produits
      </Link>
      {loading ? (
        <Loader></Loader>
      ) : error ? (
        <Message variant="danger"> {error}</Message>
      ) : (
        <div className="product-page-new">
          {/* Header Section */}
          <div className="text-center mb-5">
            <h1 className="fw-bold mb-2">{product.name}</h1>
            <p className="text-muted mx-auto" style={{ maxWidth: "700px", fontSize: "1.1rem" }}>
              {product.description}
            </p>
            <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
              <h2 className="fw-bold text-primary mb-0">{product.price} DZD</h2>
              <Rating value={product.rating} text={`${product.numReviews} avis`} />
            </div>
          </div>

          <Row className="g-4">
            {/* Left Column: Checkout Form */}
            <Col lg={7} md={12}>
              <DirectCheckoutForm 
                product={product}
                variants={product.variants}
                quantity={quantity}
                onVariantChange={setSelectedVariant}
              />
            </Col>

            {/* Right Column: Image and Variants */}
            <Col lg={5} md={12}>
               <div className="sticky-top" style={{ top: "100px" }}>
                  <div
                    className="product-image-container mb-4"
                    style={{
                      border: "1px solid #eee",
                      borderRadius: "12px",
                      padding: "15px",
                      background: "#fff",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                    }}
                  >
                    <Image
                      src={`${process.env.REACT_APP_MEDIA_URL}${selectedVariant ? selectedVariant.image : product.image}`}
                      alt={selectedVariant ? selectedVariant.name : product.name}
                      fluid
                      className="product-image product-main-image mx-auto d-block"
                      style={{
                        maxHeight: "450px",
                        objectFit: "contain",
                        borderRadius: "8px"
                      }}
                    />
                  </div>


                  <div className="quantity-selector mb-4">
                    <h6 className="fw-bold mb-3">Quantité :</h6>
                    <div className="d-flex align-items-center gap-3">
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                        disabled={quantity <= 1}
                      >
                         <i className="bi bi-dash"></i>
                      </Button>
                      <span className="fw-bold fs-5 px-2">{quantity}</span>
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => setQuantity(prev => Math.min(product.countInStock, prev + 1))}
                        disabled={quantity >= product.countInStock}
                      >
                         <i className="bi bi-plus"></i>
                      </Button>
                      <span className="text-muted small">
                        ({product.countInStock > 0 ? `${product.countInStock} en stock` : 'Rupture de stock'})
                      </span>
                    </div>
                  </div>
               </div>
            </Col>
          </Row>

          {/* Reviews Section */}
          <Row className="mt-5 pt-5 border-top">
            <Col md={8} className="mx-auto">
              <h3 className="mb-4 text-center fw-bold">Ce que disent nos clients</h3>
              {product.reviews.length === 0 && (
                <Message variant="info">Aucun avis pour le moment. Soyez le premier à donner votre avis !</Message>
              )}
              <ListGroup variant="flush">
                {product.reviews.map((review) => (
                  <ListGroup.Item
                    key={review._id}
                    className="border-0 bg-light rounded mb-3 p-4"
                  >
                    <div className="d-flex justify-content-between align-items-center mb-2">
                       <div>
                          <strong className="fs-5">{review.name}</strong>
                          <div className="mt-1"><Rating value={review.rating} size="12px" /></div>
                       </div>
                       <small className="text-muted bg-white px-2 py-1 rounded shadow-sm">
                        {review.createdAt.substring(0, 10)}
                      </small>
                    </div>
                    <p className="mt-3 mb-0" style={{ fontStyle: "italic", color: "#555" }}>
                      "{review.comment}"
                    </p>
                  </ListGroup.Item>
                ))}
                
                <ListGroup.Item className="mt-5 p-4 border rounded shadow-sm">
                  <h4 className="mb-4">Partagez votre expérience</h4>
                  {errorReview && (
                    <Message variant="danger">{errorReview}</Message>
                  )}
                  {successReview && (
                    <Message variant="success">Merci ! Votre avis a été soumis avec succès.</Message>
                  )}
                  {userInfo ? (
                    userInfo.isAdmin ? (
                      <Alert variant="warning">
                        Les administrateurs ne peuvent pas écrire d'avis sur les
                        produits.
                      </Alert>
                    ) : (
                      <Form className="review-form">
                        <Form.Group controlId="rating" className="mb-3">
                          <Form.Label className="fw-bold">Note <span className="text-danger">*</span></Form.Label>
                          <Form.Select
                            value={rating.rating}
                            onChange={(e) =>
                              setRating({ ...rating, rating: e.target.value })
                            }
                            className="bg-light"
                          >
                            <option value="0">Sélectionner une note...</option>
                            <option value="1">1 - Très insuffisant</option>
                            <option value="2">2 - Passable</option>
                            <option value="3">3 - Bien</option>
                            <option value="4">4 - Très bien</option>
                            <option value="5">5 - Excellent</option>
                          </Form.Select>
                        </Form.Group>
                        <Form.Group controlId="comment" className="mb-4">
                          <Form.Label className="fw-bold">Commentaire <span className="text-danger">*</span></Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={4}
                            value={rating.comment}
                            onChange={(e) =>
                              setRating({ ...rating, comment: e.target.value })
                            }
                            placeholder="Votre expérience avec ce produit..."
                            className="bg-light"
                          ></Form.Control>
                        </Form.Group>
                        <Button
                          type="button"
                          variant="dark"
                          className="px-5 py-2 fw-bold"
                          disabled={rating.rating === 0 || loadingReview}
                          onClick={submitHandler}
                        >
                          {loadingReview ? "Envoi en cours..." : "Soumettre l'avis"}
                        </Button>
                      </Form>
                    )
                  ) : (
                    <Alert variant="info" className="text-center py-4">
                      Veuillez <Link to="/login" className="fw-bold text-decoration-underline">vous connecter</Link> pour
                      écrire un avis
                    </Alert>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}

export default ProductPage;
