import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import { Button, Form, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { userLoginAction } from "../actions/UserActions";
import Message from "../components/Message";
import Loader from "../components/Loader";

function LoginPage() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const redirect = window.location.search
    ? "/" + window.location.search.split("=")[1]
    : "/";
  const navigate = useNavigate();
  // make action
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, userInfo, error } = userLogin;
  useEffect(() => {
    if (userInfo) {
      // redirect to the home page
      if (redirect) {
        navigate(redirect);
      } else {
        navigate("/");
      }
    }
  }, [userInfo, navigate, redirect]);
  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(userLoginAction(email, password));
  };
  return (
    <FormContainer>
      <Card className="shadow-sm border-0">
        <Card.Body className="p-4">
          <div className="text-center mb-4">
            <img
              src="/images/new_logo.jpeg"
              alt="Logo"
              height="100"
              className="mb-3"
              style={{ borderRadius: "8px" }}
            />
            <h2 className="fw-bold">Se Connecter</h2>
            <p className="text-muted">Accédez à votre compte</p>
          </div>

          {error && <Message variant="danger">{error}</Message>}
          {loading && (
            <div className="text-center">
              <Loader size={50} />
            </div>
          )}

          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Adresse Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Entrez votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="py-2"
                required
              ></Form.Control>
            </Form.Group>

            <Form.Group className="mb-4" controlId="password">
              <Form.Label>Mot de Passe</Form.Label>
              <Form.Control
                type="password"
                placeholder="Entrez votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="py-2"
                required
              ></Form.Control>
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              className="w-100 py-2 mb-3"
              disabled={loading}
            >
              {loading ? "Connexion..." : "Se Connecter"}
            </Button>
          </Form>

          <div className="text-center mt-3">
            <p className="mb-0">
              Nouveau Client ?{" "}
              <Link
                to={redirect ? `/register?redirect=${redirect}` : "/register"}
                className="text-primary fw-bold"
              >
                Créer un Compte
              </Link>
            </p>
          </div>
        </Card.Body>
      </Card>
    </FormContainer>
  );
}

export default LoginPage;
