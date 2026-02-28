import React, { useEffect } from "react";
import { Container, Navbar, Nav, NavDropdown, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { userLogoutAction } from "../actions/UserActions";

function Haeder({ isVideoSection, currentPath }) {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const {  userInfo } = userLogin;

  // Check if we're on login or register pages
  const isAuthPage = currentPath === "/login" || currentPath === "/register";

  useEffect(() => {}, [userInfo]);

  const logoutHandler = () => {
    dispatch(userLogoutAction());
  };
  return (
    <header
      className={isVideoSection ? "video-section" : ""}
      style={{
        background: isVideoSection
          ? "rgba(0, 0, 0, 0.7)"
          : "rgba(0, 0, 0, 0.9)",
        color: "var(--syra-gold)",
        fontFamily: "Inter, sans-serif",
        width: "100%",
        zIndex: 9999,
        boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
        transition:
          "background 0.5s cubic-bezier(0.4,0,0.2,1), box-shadow 0.5s cubic-bezier(0.4,0,0.2,1)",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <Navbar
        expand="xl"
        className="py-1"
        style={{
          background: "rgba(0,0,0,0)",
          color: "var(--syra-gold)",
          fontFamily: "Inter, sans-serif",
          transition: "background 0.4s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: "none",
        }}
        variant="dark"
        collapseOnSelect
      >
        <Container fluid>
          <LinkContainer to="/">
            <Navbar.Brand className="d-flex align-items-center">
              <img
                src="/images/new_logo.jpeg"
                alt="Vix Fragrance Logo"
                style={{ width: "100px", height: "auto", borderRadius: "4px" }}
                className="me-2"
              />
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto my-1 my-lg-0" style={{ maxHeight: "60px" }}>
              <LinkContainer to={userInfo && userInfo.isAdmin ? "/admin" : "/"}>
                <Nav.Link
                  href={userInfo && userInfo.isAdmin ? "/admin" : "/"}
                  className="me-2 nav-link-hover"
                >
                  <i className="bi bi-house-door me-1"></i>
                  {userInfo && userInfo.isAdmin
                    ? "Tableau de Bords"
                    : "Accueil"}
                </Nav.Link>
              </LinkContainer>
              {/* Hide cart for admins */}
              {(!userInfo || !userInfo.isAdmin) && (
                <LinkContainer to="cart/">
                  <Nav.Link className="nav-link-hover">
                    <i className="bi bi-cart me-1 cart-icon" data-cart-icon></i>{" "}
                    Panier
                  </Nav.Link>
                </LinkContainer>
              )}
            </Nav>

            <div className="d-flex justify-content-center align-items-center mt-2 mt-md-0 text-white">
              {userInfo ? (
                <NavDropdown
                  className="fw-semibold"
                  title={
                    <span>
                      <i className="bi bi-person me-1"></i> {userInfo.name}
                    </span>
                  }
                  id="username"
                >
                  <LinkContainer to="/profile">
                    <NavDropdown.Item className="py-2">
                      <i className="bi bi-person-circle me-2"></i>
                      Profil
                    </NavDropdown.Item>
                  </LinkContainer>
                  {/* Show different menu items for admin vs regular users */}
                  {userInfo.isAdmin ? (
                    <>
                      <LinkContainer to="/admin/orders">
                        <NavDropdown.Item className="py-2">
                          <i className="bi bi-bag me-2"></i>
                          Toutes les Commandes
                        </NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/products">
                        <NavDropdown.Item className="py-2">
                          <i className="bi bi-box me-2"></i>
                          Produits
                        </NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/users">
                        <NavDropdown.Item className="py-2">
                          <i className="bi bi-people me-2"></i>
                          Utilisateurs
                        </NavDropdown.Item>
                      </LinkContainer>
                    </>
                  ) : (
                    <LinkContainer to="/my-orders">
                      <NavDropdown.Item className="py-2">
                        <i className="bi bi-bag me-2"></i>
                        Mes Commandes
                      </NavDropdown.Item>
                    </LinkContainer>
                  )}
                  <NavDropdown.Divider />
                  <NavDropdown.Item className="py-2" onClick={logoutHandler}>
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Déconnexion
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                // Only show login button if not on auth pages
                !isAuthPage && (
                  <LinkContainer to="/login">
                    <Button variant="outline-light" className="ms-2 btn-hover">
                      <i className="bi bi-box-arrow-in-right me-1"></i>{" "}
                      Connexion
                    </Button>
                  </LinkContainer>
                )
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <style jsx>{`
        .navbar,
        .nav-link,
        .navbar-brand,
        .dropdown-menu,
        .dropdown-item,
        .navbar-nav,
        .nav-dropdown,
        .btn,
        .btn * {
          font-family: "Inter", sans-serif !important;
        }
        .nav-link-hover:hover {
          transform: translateY(-2px);
          transition: all 0.3s ease;
        }
        .btn-hover:hover {
          background-color: #f8f9fa !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
        }
        .navbar-brand {
          transition: all 0.3s ease;
        }
        .navbar-brand:hover {
          transform: scale(1.05);
        }
        /* Match footer link hover */
        header a:hover {
          color: #ffffff !important;
          transition: color 0.3s ease;
        }
        /* Dropdown menu styling */
        .dropdown-menu {
          background-color: rgba(0, 0, 0, 0.95) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3) !important;
        }
        .dropdown-item {
          color: #ffffff !important;
          transition: all 0.3s ease !important;
        }
        .dropdown-item:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
          color: var(--syra-gold) !important;
          transform: translateX(5px) !important;
        }
        .dropdown-item:focus {
          background-color: rgba(255, 255, 255, 0.1) !important;
          color: var(--syra-gold) !important;
        }
        /* Navbar background transition when not in video section */
        header:not(.video-section) {
          background: rgba(0, 0, 0, 0.9) !important;
        }
      `}</style>
    </header>
  );
}

export default Haeder;
