import React from "react";
import { Container, Row, Col, InputGroup, Form, Button, Card } from "react-bootstrap";
import Product from "../components/Product";
import { useEffect, useState } from "react";
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getUserDetailAction, updateUserAction } from "../actions/UserActions";
import { UserUpdateReducers } from "../reducers/UserReducers";
import {
  PRODUCT_CREATE_OR_UPDATE_RESET,
  PRODUCT_DETAILS_RESET,
} from "../constants/productConstants";
import {
  createOrUpdateProductAction,
  productsDetailsAction,
} from "../actions/productActions";

function ProductCreateUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    price: 0,
    brand: "",
    description: "",
    imageUrl: "",
    category: "",
    countInStock: 0,
  });
  const [variants, setVariants] = useState([{ name: "", image: null, preview: null }]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const userInfo = useSelector((state) => state.userLogin.userInfo);
  const productDetail = useSelector((state) => state.productDetails);
  const {
    product: productDetailData,
    loading: loadingDetail,
    error: errorDetail,
  } = productDetail;
  const dispatch = useDispatch();
  const productCreateOrUpdate = useSelector(
    (state) => state.productCreateOrUpdate
  );
  const { loading, error, success } = productCreateOrUpdate;

  useEffect(() => {
    if (!userInfo) {
      navigate("/login=redirect=admin/users");
    }
    if (id) {
      if (
        !productDetailData ||
        !productDetailData.name ||
        productDetailData.id !== Number(id)
      ) {
        dispatch(productsDetailsAction(id));
      } else {
        setProduct({
          id: id,
          name: productDetailData.name,
          price: productDetailData.price,
          brand: productDetailData.brand,
          description: productDetailData.description,
          imageUrl: productDetailData.image,
          category: productDetailData.category,
          countInStock: productDetailData.countInStock,
        });
        setImagePreview(productDetailData.image);
        if (productDetailData.variants && productDetailData.variants.length > 0) {
          setVariants(productDetailData.variants.map(v => ({
            ...v,
            preview: v.image ? `${process.env.REACT_APP_MEDIA_URL}${v.image}` : null,
            existingImage: v.image
          })));
        }
      }
    }
    if (success) {
      dispatch({ type: PRODUCT_CREATE_OR_UPDATE_RESET });
      dispatch({ type: PRODUCT_DETAILS_RESET });
      navigate("/admin/products");
    }
  }, [navigate, userInfo, productDetailData, id, success, dispatch]);

  const handlechange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };
  const handlechangeImage = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    if (file) {
      const previewURL = URL.createObjectURL(file);
      setImagePreview(previewURL);
    }
  };

  const addVariant = () => {
    setVariants([...variants, { name: "", image: null, preview: null }]);
  };

  const removeVariant = (index) => {
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    setVariants(newVariants);
  };

  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    const newVariants = [...variants];
    newVariants[index][name] = value;
    setVariants(newVariants);
  };

  const handleVariantImageChange = (index, e) => {
    const file = e.target.files[0];
    const newVariants = [...variants];
    newVariants[index].image = file;
    if (file) {
      newVariants[index].preview = URL.createObjectURL(file);
    }
    setVariants(newVariants);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    // if id is null then create a new product else update the product
    const formData = new FormData();
    formData.append("id", product.id);
    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("brand", product.brand);
    formData.append("description", product.description);
    formData.append("category", product.category);
    formData.append("countInStock", product.countInStock);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    // Append variants
    formData.append("variantCount", variants.length);
    variants.forEach((v, index) => {
      if (v.id) {
        formData.append(`variants[${index}][id]`, v.id);
      }
      formData.append(`variants[${index}][name]`, v.name);
      if (v.image && v.image instanceof File) {
        formData.append(`variants[${index}][image]`, v.image);
      } else if (v.existingImage) {
        formData.append(`variants[${index}][image_url]`, v.existingImage);
      }
    });

    dispatch(createOrUpdateProductAction(formData, id));
  };
  const { name, price, brand, description, imageUrl, category, countInStock } =
    product;
  return (
    <Container>
      <Link to="/admin/products" className="btn btn-light my-3">
        Retour
      </Link>
      <Row className="justify-content-md-center">
        <Col xs={12} md={8}>
          <h1>{id ? "Modifier Produit" : "Créer Produit"}</h1>
          {loadingDetail ? (
            <Loader size={50}></Loader>
          ) : errorDetail ? (
            <Message variant="danger"> {errorDetail}</Message>
          ) : (
            <Form
              className="p-3 border rounded shadow-sm"
              onSubmit={submitHandler}
            >
              {loading ? (
                <Loader size={50}></Loader>
              ) : error ? (
                <Message variant="danger"> {error}</Message>
              ) : success ? (
                <Message variant="success">Produit Créé</Message>
              ) : (
                ""
              )}
              <Row>
                <Col md={6}>
                  <Form.Group controlId="name" className="mb-3">
                    <Form.Label>Nom</Form.Label>
                    <Form.Control
                      type="name"
                      placeholder="Entrez le nom du produit"
                      value={name ? name : ""}
                      name="name"
                      onChange={handlechange}
                    ></Form.Control>
                  </Form.Group>
                  <Form.Group controlId="price" className="mb-3">
                    <Form.Label>Prix</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Entrez le prix du produit"
                      value={price ? price : ""}
                      name="price"
                      onChange={handlechange}
                    ></Form.Control>
                  </Form.Group>
                  <Form.Group controlId="brand" className="mb-3">
                    <Form.Label>Marque</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Entrez la marque du produit"
                      value={brand ? brand : ""}
                      name="brand"
                      onChange={handlechange}
                    ></Form.Control>
                  </Form.Group>
                  <Form.Group controlId="description" className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Entrez la description du produit"
                      value={description ? description : ""}
                      name="description"
                      onChange={handlechange}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  {/* Image preview */}
                  <div className="mb-3 text-center">
                    {imagePreview && (
                      <div>
                        <p className="mb-2">Aperçu de l'Image:</p>
                        <img
                          src={imagePreview}
                          alt="Aperçu du Produit"
                          style={{ maxHeight: "200px", maxWidth: "100%" }}
                          className="border rounded mb-3"
                        />
                      </div>
                    )}
                  </div>

                  {/* image file and label group */}
                  <Form.Group controlId="image" className="mb-3">
                    <Form.Label>Image Actuelle</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Chemin de l'image du produit"
                      value={imageUrl ? imageUrl : ""}
                      name="imageUrl"
                      disabled
                      onChange={handlechange}
                    ></Form.Control>
                  </Form.Group>

                  <InputGroup className="mb-3">
                    <div className="input-group mb-3">
                      <input
                        type="file"
                        className="form-control"
                        id="inputGroupFile02"
                        onChange={handlechangeImage}
                        accept="image/*"
                      />
                      <label
                        className="input-group-text"
                        htmlFor="inputGroupFile02"
                      >
                        Télécharger
                      </label>
                    </div>
                  </InputGroup>

                  {/* count in stock */}
                  <Form.Group controlId="countInStock" className="mb-3">
                    <Form.Label>Stock Disponible</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Entrez le stock du produit"
                      value={countInStock ? countInStock : ""}
                      name="countInStock"
                      onChange={handlechange}
                    ></Form.Control>
                  </Form.Group>

                  <Form.Group controlId="category" className="mb-3">
                    <Form.Label>Catégorie</Form.Label>
                    <Form.Select
                      name="category"
                      value={category ? category : ""}
                      onChange={handlechange}
                    >
                      <option value="">Sélectionner une catégorie</option>
                      <option value="brume intérieur">Brume Intérieur</option>
                      <option value="savon liquide">Savon Liquide</option>
                      <option value="diffuseur intérieur">Diffuseur Intérieur</option>
                      <option value="Pack">Pack</option>
                      <option value="brume auto">Brume Auto</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <hr className="my-4" />
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Variantes du Produit</h4>
                <Button variant="outline-primary" size="sm" onClick={addVariant}>
                  <i className="fas fa-plus me-1"></i> Ajouter une Variante
                </Button>
              </div>

              {variants.map((variant, index) => (
                <Card key={index} className="mb-3 border-light shadow-sm">
                  <Card.Body>
                    <Row align-items-center>
                      <Col md={4}>
                        <Form.Group controlId={`variant-name-${index}`}>
                          <Form.Label>Nom de la Variante</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="ex: Coco, Vanille..."
                            name="name"
                            value={variant.name}
                            onChange={(e) => handleVariantChange(index, e)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={5}>
                        <Form.Group controlId={`variant-image-${index}`}>
                          <Form.Label>Image de la Variante</Form.Label>
                          <div className="d-flex align-items-center">
                            {variant.preview && (
                              <img
                                src={variant.preview}
                                alt="Preview"
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  objectFit: "cover",
                                  borderRadius: "4px",
                                  marginRight: "10px",
                                }}
                              />
                            )}
                            <Form.Control
                              type="file"
                              size="sm"
                              onChange={(e) => handleVariantImageChange(index, e)}
                              accept="image/*"
                            />
                          </div>
                        </Form.Group>
                      </Col>
                      <Col md={3} className="text-end d-flex align-items-end justify-content-end">
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => removeVariant(index)}
                        >
                          <i className="bi bi-trash-fill"></i>
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}

              <div className="text-center">

                <Button
                  className="mt-3 px-4"
                  type="submit"
                  variant="primary"
                  size="md"
                >
                  {id ? "Modifier Produit" : "Créer Produit"}
                </Button>
              </div>
            </Form>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default ProductCreateUpdate;
