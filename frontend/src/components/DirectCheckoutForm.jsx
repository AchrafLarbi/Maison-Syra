import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createOrderAction } from "../actions/OrderActions";
import { ORDER_CREATE_RESET } from "../constants/OrderConstants";
import { ALGERIAN_WILAYAS } from "../utils/algerianWilayas";
import Loader from "./Loader";
import Message from "./Message";

const DirectCheckoutForm = ({ items, product, variants, onVariantChange, quantity = 1 }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState(""); 
  const [phone, setPhone] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [daira, setDaira] = useState("");
  const [address, setAddress] = useState("");
  const [validated, setValidated] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(variants && variants.length > 0 ? variants[0] : null);

  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success, error, loading } = orderCreate;

  useEffect(() => {
    if (success) {
      navigate(`/order/${order.id}`);
      dispatch({ type: ORDER_CREATE_RESET });
    }
  }, [success, navigate, order, dispatch]);

  // Initial notify to parent of the default selection
  useEffect(() => {
    if (selectedVariant && onVariantChange) {
      onVariantChange(selectedVariant);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVariantSelect = (v) => {
    setSelectedVariant(v);
    if (onVariantChange) {
      onVariantChange(v);
    }
  };

  // If items are passed (cart mode), use them. If product/variants are passed (details mode), create items locally.
  const displayItems = items ? items : [
    {
      product: product?.id,
      name: selectedVariant ? `${product?.name} - ${selectedVariant.name}` : product?.name,
      image: selectedVariant ? selectedVariant.image : product?.image,
      price: product?.price,
      quantity: quantity,
      countInStock: product?.countInStock
    }
  ];

  const itemsPrice = displayItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);
  const shippingPrice = (wilaya === "" ? 0 : 500).toFixed(2);
  const totalPrice = (Number(itemsPrice) + Number(shippingPrice)).toFixed(2);

  const submitHandler = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    const orderData = {
      orderItems: displayItems.map(item => ({
        product: item.product,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      })),
      shippingAddress: {
        name,
        phone,
        address,
        city: daira,
        postalCode: "00000",
        country: "Algeria",
        wilaya: wilaya,
      },
      paymentMethod: "COD",
      itemsPrice: itemsPrice,
      shippingPrice: shippingPrice,
      taxPrice: 0,
      totalPrice: totalPrice,
    };

    dispatch(createOrderAction(orderData));
  };

  return (
    <Card className="shadow-sm border-0 mt-4" style={{ borderRadius: "12px", background: "#fdfdfd" }}>
      <Card.Body className="p-4">
        <h4 className="mb-4 text-center fw-bold" style={{ color: "#333" }}>Acheter Maintenant</h4>
        
        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader />}

        <Form noValidate validated={validated} onSubmit={submitHandler}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="phone">
                <Form.Label className="small fw-bold">Numéro de Téléphone <span className="text-danger">*</span></Form.Label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <i className="bi bi-telephone text-muted"></i>
                  </span>
                  <Form.Control
                    required
                    type="tel"
                    placeholder="06XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="border-start-0"
                    style={{ borderRadius: "0 8px 8px 0" }}
                  />
                  <Form.Control.Feedback type="invalid">
                    Veuillez entrer un numéro de téléphone valide.
                  </Form.Control.Feedback>
                </div>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label className="small fw-bold">Nom Complet <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Votre nom et prénom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ borderRadius: "8px" }}
                />
                <Form.Control.Feedback type="invalid">
                  Veuillez entrer votre nom.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="wilaya">
                <Form.Label className="small fw-bold">Wilaya <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  required
                  value={wilaya}
                  onChange={(e) => setWilaya(e.target.value)}
                  style={{ borderRadius: "8px" }}
                >
                  <option value="">Sélectionner...</option>
                  {ALGERIAN_WILAYAS.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  Veuillez sélectionner votre wilaya.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="daira">
                <Form.Label className="small fw-bold">Commune / Daira <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Votre commune"
                  value={daira}
                  onChange={(e) => setDaira(e.target.value)}
                  style={{ borderRadius: "8px" }}
                />
                <Form.Control.Feedback type="invalid">
                  Veuillez entrer votre commune.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-4" controlId="address">
            <Form.Label className="small fw-bold">Adresse <span className="text-danger">*</span></Form.Label>
            <Form.Control
              required
              as="textarea"
              rows={2}
              placeholder="Ex: Rue 123, Bâtiment A, Appt 4..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{ borderRadius: "8px" }}
            />
            <Form.Control.Feedback type="invalid">
              Veuillez entrer votre adresse exacte.
            </Form.Control.Feedback>
          </Form.Group>

          {/* Variants Selection UI - Only for Single Product mode */}
          {variants && variants.length > 0 && (
            <div className="mb-4 p-3 border rounded bg-white shadow-sm">
              <h6 className="fw-bold mb-3 d-flex align-items-center">
                <i className="bi bi-grid-3x3-gap me-2 text-primary"></i>
                Choisir une variante :
              </h6>
              <div className="d-flex flex-wrap gap-2">
                {/* Option for the main product if applicable or just variants */}
                {variants.map((v) => (
                  <Button
                    key={v.id}
                    variant={selectedVariant?.id === v.id ? "dark" : "outline-secondary"}
                    className={`px-3 py-2 fw-semibold d-flex align-items-center gap-2 ${selectedVariant?.id === v.id ? "active-variant shadow-sm" : ""}`}
                    onClick={() => handleVariantSelect(v)}
                    style={{ borderRadius: "8px", fontSize: "0.9rem" }}
                  >
                    {selectedVariant?.id === v.id && <i className="bi bi-check2-circle"></i>}
                    {v.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="order-summary border rounded p-3 mb-4" style={{ backgroundColor: "#f8f9fa", borderColor: "#eee !important" }}>
             <h6 className="fw-bold mb-3 border-bottom pb-2">Récapitulatif de votre commande</h6>
             {displayItems.map((item, index) => (
               <div key={index} className="d-flex justify-content-between mb-2 small">
                 <span>{item.name} x {item.quantity}</span>
                 <span>{(item.price * item.quantity).toFixed(2)} DZD</span>
               </div>
             ))}
             <div className="d-flex justify-content-between mb-2 small">
               <span>Frais de livraison ({wilaya || "..."})</span>
               <span>{shippingPrice} DZD</span>
             </div>
             <hr />
             <div className="d-flex justify-content-between fw-bold">
               <span>TOTAL À PAYER</span>
               <span className="text-primary">{totalPrice} DZD</span>
             </div>
          </div>

          <div className="d-grid gap-2">
            <Button
              variant="dark"
              size="lg"
              type="submit"
              disabled={loading || displayItems.some(item => item.countInStock === 0)}
              className="py-3 shadow-sm fw-bold"
              style={{ borderRadius: "8px", textTransform: "uppercase", letterSpacing: "1px" }}
            >
              {loading ? "Traitement..." : "Confirmer la Commande"}
            </Button>
            <p className="text-muted text-center small mt-2">
              <i className="bi bi-shield-check me-1"></i> Paiement à la livraison
            </p>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default DirectCheckoutForm;
