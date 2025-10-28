import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: '🎨',
      title: 'Customizable Design',
      description: 'Create stunning QR codes with custom colors, heart shapes, frames, and logos',
    },
    {
      icon: '📊',
      title: 'Advanced Analytics',
      description: 'Track scans, location data, device types, and user behavior in real-time',
    },
    {
      icon: '🔄',
      title: 'Dynamic QR Codes',
      description: 'Edit destination URLs anytime without reprinting your QR code',
    },
    {
      icon: '💰',
      title: 'Free Trial',
      description: 'Start with a 10-day free trial - no credit card required',
    },
    {
      icon: '🔒',
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with 99.9% uptime guarantee',
    },
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Instant QR code generation and lightning-fast redirects',
    },
  ];

  const useCases = [
    {
      icon: '🍽️',
      title: 'Restaurants',
      description: 'Digital menus that you can update instantly',
    },
    {
      icon: '🏪',
      title: 'Retail',
      description: 'Product information and promotions',
    },
    {
      icon: '🎉',
      title: 'Events',
      description: 'Event registration and check-ins',
    },
    {
      icon: '💼',
      title: 'Business',
      description: 'Digital business cards and contact info',
    },
    {
      icon: '📱',
      title: 'Marketing',
      description: 'Campaign tracking and lead generation',
    },
    {
      icon: '🎓',
      title: 'Education',
      description: 'Course materials and resources',
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="py-5" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="text-white mb-4 mb-lg-0">
              <h1 className="display-3 fw-bold mb-4 fade-in">
                Create Dynamic QR Codes with Style ♥
              </h1>
              <p className="lead mb-4 fade-in">
                Generate beautiful, trackable QR codes with heart shapes, custom frames, and advanced analytics.
                Perfect for restaurants, businesses, events, and marketing campaigns.
              </p>
              <div className="fade-in">
                <Link to="/register">
                  <Button variant="light" size="lg" className="me-3 mb-3">
                    🚀 Get Started Free
                  </Button>
                </Link>
                <Link to="/create">
                  <Button variant="outline-light" size="lg" className="mb-3">
                    ✨ Try Generator
                  </Button>
                </Link>
              </div>
              <p className="mt-3">
                <small>✅ Free 10-day trial • No credit card required • Cancel anytime</small>
              </p>
            </Col>
            <Col lg={6} className="fade-in">
              <Card className="shadow-lg border-0" style={{ transform: 'rotate(-5deg)' }}>
                <Card.Body className="p-5 text-center">
                  <div className="mb-3" style={{ fontSize: '80px' }}>
                    ♥
                  </div>
                  <h3>Heart-Shaped QR Codes</h3>
                  <p className="text-muted">Make your QR codes stand out with beautiful designs</p>
                  <div className="bg-light p-4 rounded">
                    <div style={{ fontSize: '100px' }}>█▓▒░</div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold gradient-text">Powerful Features</h2>
            <p className="lead text-muted">Everything you need to create and manage QR codes</p>
          </div>
          <Row>
            {features.map((feature, index) => (
              <Col md={6} lg={4} key={index} className="mb-4">
                <Card className="h-100 border-0 shadow-sm fade-in">
                  <Card.Body className="text-center p-4">
                    <div className="mb-3" style={{ fontSize: '48px' }}>
                      {feature.icon}
                    </div>
                    <h5 className="fw-bold">{feature.title}</h5>
                    <p className="text-muted mb-0">{feature.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* How It Works */}
      <section className="py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold gradient-text">How It Works</h2>
            <p className="lead text-muted">Create your dynamic QR code in 3 simple steps</p>
          </div>
          <Row>
            <Col md={4} className="text-center mb-4">
              <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px', fontSize: '32px' }}>
                1️⃣
              </div>
              <h4>Customize Design</h4>
              <p className="text-muted">
                Choose colors, shapes, frames, and add your logo to create a unique QR code
              </p>
            </Col>
            <Col md={4} className="text-center mb-4">
              <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px', fontSize: '32px' }}>
                2️⃣
              </div>
              <h4>Generate & Download</h4>
              <p className="text-muted">
                Get your dynamic QR code instantly with a short URL you can share anywhere
              </p>
            </Col>
            <Col md={4} className="text-center mb-4">
              <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px', fontSize: '32px' }}>
                3️⃣
              </div>
              <h4>Track & Analyze</h4>
              <p className="text-muted">
                Monitor scans, locations, devices, and update your destination URL anytime
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Use Cases */}
      <section className="py-5 bg-light">
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold gradient-text">Perfect For Every Industry</h2>
            <p className="lead text-muted">Trusted by businesses worldwide</p>
          </div>
          <Row>
            {useCases.map((useCase, index) => (
              <Col md={6} lg={4} key={index} className="mb-4">
                <Card className="h-100 border-0 shadow-sm fade-in">
                  <Card.Body className="d-flex align-items-center p-4">
                    <div className="me-3" style={{ fontSize: '36px' }}>
                      {useCase.icon}
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">{useCase.title}</h6>
                      <p className="text-muted mb-0 small">{useCase.description}</p>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-5" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Container>
          <Row className="text-center text-white">
            <Col>
              <h2 className="display-5 fw-bold mb-4">Ready to Get Started?</h2>
              <p className="lead mb-4">
                Join thousands of businesses using our QR code platform
              </p>
              <Link to="/register">
                <Button variant="light" size="lg" className="me-3">
                  Start Free Trial
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline-light" size="lg">
                  View Pricing
                </Button>
              </Link>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default LandingPage;

