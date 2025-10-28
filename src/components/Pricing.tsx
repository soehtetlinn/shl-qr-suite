import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, ListGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import type { SubscriptionPlan } from '../types';
import { useAuth } from '../context/AuthContext';

const Pricing: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await api.get('/api/subscription-plans');
      const apiPlans = response.data.filter((plan: any) => plan.isActive).map((plan: any) => {
        // Convert features object to array
        let featuresArray: string[] = [];
        if (plan.features && typeof plan.features === 'object') {
          // Convert features object to readable array
          const maxQr = plan.maxQrCodes === -1 ? 'Unlimited' : plan.maxQrCodes;
          const maxScans = plan.maxScansPerMonth === -1 ? 'Unlimited' : plan.maxScansPerMonth?.toLocaleString();
          
          featuresArray = [
            `${maxQr} QR codes`,
            `${maxScans} scans/month`,
            plan.features.analytics ? 'Advanced analytics' : 'Basic analytics',
            `${plan.features.customization === 'unlimited' ? 'Unlimited' : plan.features.customization || 'No'} customization`,
            `${plan.features.support || 'Community'} support`,
          ];
        } else {
          featuresArray = [];
        }
        
        return {
          ...plan,
          features: featuresArray,
          currency: 'USD',
          prioritySupport: plan.features?.support !== 'community',
          analyticsAccess: plan.features?.analytics || false,
          customBranding: plan.features?.customization !== false,
          apiAccess: false,
        };
      });
      setPlans(apiPlans);
    } catch (error: any) {
      // If endpoint doesn't exist, use default plans
      setPlans([
        {
          id: '1',
          name: 'Free',
          description: 'Perfect for trying out',
          price: 0,
          currency: 'USD',
          billingInterval: 'monthly',
          features: [
            '10-day trial',
            '5 QR codes',
            'Basic analytics',
            'Standard support',
            'Custom colors',
          ],
          prioritySupport: false,
          analyticsAccess: true,
          customBranding: false,
          apiAccess: false,
          isActive: true,
          createdAt: '',
          updatedAt: '',
        },
        {
          id: '2',
          name: 'Starter',
          description: 'For small businesses',
          price: 9.99,
          currency: 'USD',
          billingInterval: 'monthly',
          features: [
            '50 QR codes',
            'Advanced analytics',
            'Custom frames & logos',
            'Priority support',
            'No expiration',
            'Edit anytime',
          ],
          prioritySupport: true,
          analyticsAccess: true,
          customBranding: true,
          apiAccess: false,
          isActive: true,
          createdAt: '',
          updatedAt: '',
        },
        {
          id: '3',
          name: 'Professional',
          description: 'For growing businesses',
          price: 29.99,
          currency: 'USD',
          billingInterval: 'monthly',
          features: [
            'Unlimited QR codes',
            'Advanced analytics',
            'Custom branding',
            'Priority support',
            'API access',
            'Team collaboration',
            'White-label option',
          ],
          prioritySupport: true,
          analyticsAccess: true,
          customBranding: true,
          apiAccess: true,
          isActive: true,
          createdAt: '',
          updatedAt: '',
        },
        {
          id: '4',
          name: 'Enterprise',
          description: 'For large organizations',
          price: 99.99,
          currency: 'USD',
          billingInterval: 'monthly',
          features: [
            'Unlimited everything',
            'Dedicated support',
            'Custom integrations',
            'SLA guarantee',
            'Training & onboarding',
            'Custom features',
            'Volume discounts',
          ],
          prioritySupport: true,
          analyticsAccess: true,
          customBranding: true,
          apiAccess: true,
          isActive: true,
          createdAt: '',
          updatedAt: '',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = (_planId: string, planName: string) => {
    if (!isAuthenticated) {
      toast.info('Please login to subscribe');
      navigate('/login');
      return;
    }

    if (planName === 'Free') {
      navigate('/dashboard');
      return;
    }

    // In a real app, this would redirect to payment
    toast.info('Payment integration coming soon!');
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold gradient-text mb-3">Simple, Transparent Pricing</h1>
        <p className="lead text-muted">
          Choose the perfect plan for your business. Start free, upgrade anytime.
        </p>
      </div>

      <Row className="justify-content-center">
        {plans.map((plan, index) => (
          <Col key={plan.id} lg={3} md={6} className="mb-4">
            <Card
              className={`h-100 shadow-lg border-0 fade-in ${
                index === 1 ? 'border-primary border-3' : ''
              }`}
              style={{
                transform: index === 1 ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform 0.3s ease',
              }}
            >
              {index === 1 && (
                <div className="position-absolute top-0 start-50 translate-middle">
                  <Badge bg="primary" className="px-3 py-2">
                    MOST POPULAR
                  </Badge>
                </div>
              )}
              <Card.Body className="p-4 d-flex flex-column">
                <div className="text-center mb-4">
                  <h4 className="fw-bold">{plan.name}</h4>
                  <p className="text-muted small mb-3">{plan.description}</p>
                  <div className="mb-3">
                    <span className="display-4 fw-bold">
                      ${plan.price}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-muted">/month</span>
                    )}
                  </div>
                </div>

                <ListGroup variant="flush" className="mb-4 flex-grow-1">
                  {(plan.features || []).map((feature, idx) => (
                    <ListGroup.Item
                      key={idx}
                      className="border-0 ps-0 d-flex align-items-start"
                    >
                      <span className="text-success me-2">✓</span>
                      <span className="small">{feature}</span>
                    </ListGroup.Item>
                  ))}
                </ListGroup>

                <Button
                  variant={index === 1 ? 'primary' : 'outline-primary'}
                  size="lg"
                  onClick={() => handleSubscribe(plan.id, plan.name)}
                  className="w-100"
                >
                  {plan.price === 0 ? 'Start Free' : 'Subscribe Now'}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* FAQ Section */}
      <Row className="mt-5">
        <Col lg={8} className="mx-auto">
          <Card className="shadow-sm border-0">
            <Card.Body className="p-5">
              <h3 className="text-center mb-4 gradient-text">Frequently Asked Questions</h3>
              
              <div className="mb-4">
                <h5>Can I change plans later?</h5>
                <p className="text-muted">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect
                  immediately, and we'll prorate the charges.
                </p>
              </div>

              <div className="mb-4">
                <h5>What happens after the trial ends?</h5>
                <p className="text-muted">
                  After your 10-day free trial, your QR codes will stop redirecting unless you
                  upgrade to a paid plan. Your data is saved and will be restored when you subscribe.
                </p>
              </div>

              <div className="mb-4">
                <h5>Can I cancel anytime?</h5>
                <p className="text-muted">
                  Yes, you can cancel your subscription at any time. Your QR codes will remain
                  active until the end of your billing period.
                </p>
              </div>

              <div className="mb-4">
                <h5>Do you offer refunds?</h5>
                <p className="text-muted">
                  We offer a 30-day money-back guarantee. If you're not satisfied, contact us for
                  a full refund.
                </p>
              </div>

              <div className="text-center mt-4">
                <p className="text-muted mb-3">Still have questions?</p>
                <Link to="/contact">
                  <Button variant="primary">Contact Support</Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Pricing;

