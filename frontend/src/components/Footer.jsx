import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

function Footer() {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Newsletter subscription:", email);
    setEmail("");
  };

  return (
    <footer
      style={{
        background:
          "linear-gradient(135deg, var(--syra-green) 70%, var(--syra-burgundy) 100%)",
        color: "var(--syra-gold)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <Container>
        <Row className="py-5 gx-5 justify-content-between align-items-start" style={{ rowGap: '2rem', columnGap: '3rem' }}>
          {/* CONTACT Section */}
          <Col lg={3} md={6} className="mb-4 text-start">
            <h6
              className="text-uppercase fw-bold mb-4"
              style={{
                fontFamily: "Inter, sans-serif",
                color: "var(--syra-gold)",
                letterSpacing: "0.1em",
                fontWeight: 700,
              }}
            >
              CONTACT
            </h6>
            <div style={{ color: "#cccccc", lineHeight: "1.8" }}>
              <p className="mb-2">Anis Lotfi, Oran, Algérie</p>
              <p className="mb-2">Email: contact@vixfragrance.com</p>
              <p className="mb-2">Numéro : 050645168</p>
            </div>
          </Col>

          {/* NEWSLETTER Section */}
          <Col lg={3} md={6} className="mb-4 text-end ms-auto">
            
            {/* Social Media Icons */}
            <div className="d-flex gap-3 mt-4 justify-content-end">
              <a
                href="https://www.facebook.com/profile.php?id=61587218295112"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#cccccc", fontSize: "1.2rem" }}
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#cccccc", fontSize: "1.2rem" }}
              >
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </Col>
        </Row>

        {/* Bottom Section */}
        <Row className="py-3" style={{ borderTop: "1px solid #444" }}>
          <Col className="text-center">
            <p
              className="mb-0"
              style={{
                color: "var(--syra-gold)",
                fontSize: "0.9rem",
                fontFamily: "Inter, sans-serif",
              }}
            >
              © 2025 Vix Fragrance, tous les droits sont réservés.
            </p>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        footer a:hover {
          color: #ffffff !important;
          transition: color 0.3s ease;
        }
        .fab:hover {
          transform: translateY(-2px);
          transition: transform 0.3s ease;
          color: #ffffff !important;
        }
        input::placeholder {
          color: #999 !important;
        }
        input:focus {
          background-color: transparent !important;
          border-color: #666 !important;
          box-shadow: none !important;
          color: #cccccc !important;
        }
      `}</style>
    </footer>
  );
}

export default Footer;
