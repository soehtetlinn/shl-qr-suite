import React from 'react';
import { Navbar as BSNavbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <BSNavbar expand="lg" className="navbar shadow-sm">
      <Container>
        <BSNavbar.Brand as={Link} to="/" className="fw-bold">
          <span className="gradient-text" style={{ fontSize: '24px' }}>
            ♥ QR Suite
          </span>
        </BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="navbar-nav" />
        <BSNavbar.Collapse id="navbar-nav">
          <Nav className="ms-auto align-items-center">
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/dashboard" className="me-2">
                  Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/create" className="me-2">
                  Create QR
                </Nav.Link>
                <Nav.Link as={Link} to="/pricing" className="me-3">
                  Pricing
                </Nav.Link>
                <Dropdown align="end">
                  <Dropdown.Toggle variant="outline-primary" id="user-dropdown">
                    👤 {user?.username || 'User'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/profile">
                      Profile
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/subscription">
                      Subscription
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/pricing" className="me-2">
                  Pricing
                </Nav.Link>
                <Nav.Link as={Link} to="/about" className="me-2">
                  About
                </Nav.Link>
                <Link to="/login" className="me-2">
                  <Button variant="outline-primary">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary">Get Started</Button>
                </Link>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;

