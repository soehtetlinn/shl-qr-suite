import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  ListGroup,
  Modal,
  Alert,
  ProgressBar,
  Table,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import type { UserSubscription, SubscriptionPlan } from '../types';
import { format, addDays } from 'date-fns';

interface UsageStats {
  qrCodesUsed: number;
  qrCodesLimit: number;
  scansThisMonth: number;
  scansLimit: number;
}

interface Invoice {
  id: string;
  amount: number;
  currency: string;
  status: 'PAID' | 'PENDING' | 'FAILED';
  paidAt?: string;
  createdAt: string;
}

const Subscription: React.FC = () => {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedPlan] = useState<SubscriptionPlan | null>(null);

  useEffect(() => {
    fetchSubscription();
    fetchPlans();
    fetchUsage();
    fetchInvoices();
  }, []);

  const fetchSubscription = async () => {
    try {
      const response = await api.get('/api/subscription');
      setSubscription(response.data);
    } catch (error: any) {
      // User may not have a subscription yet
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      await api.get('/api/subscription-plans');
      // Plans loaded but not used in current UI
    } catch (error) {
      // Plans endpoint may not exist yet
    }
  };

  const fetchUsage = async () => {
    try {
      const response = await api.get('/api/subscription/usage');
      setUsage(response.data);
    } catch (error) {
      // Default usage if endpoint fails
      setUsage({
        qrCodesUsed: 0,
        qrCodesLimit: 5,
        scansThisMonth: 0,
        scansLimit: 1000,
      });
    }
  };

  const fetchInvoices = async () => {
    try {
      const response = await api.get('/api/subscription/invoices');
      setInvoices(response.data);
    } catch (error) {
      setInvoices([]);
    }
  };

  const confirmUpgrade = async () => {
    if (!selectedPlan) return;

    try {
      await api.post('/api/subscription/upgrade', {
        planId: selectedPlan.id,
      });
      toast.success(`Successfully upgraded to ${selectedPlan.name}!`);
      fetchSubscription();
      fetchUsage();
      setShowUpgradeModal(false);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to upgrade subscription');
    }
  };

  const handleCancelSubscription = async () => {
    try {
      await api.post('/api/subscription/cancel');
      toast.success('Subscription cancelled successfully');
      fetchSubscription();
      setShowCancelModal(false);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to cancel subscription');
    }
  };

  const handleResumeSubscription = async () => {
    try {
      await api.post('/api/subscription/resume');
      toast.success('Subscription resumed successfully');
      fetchSubscription();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to resume subscription');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge bg="success">Active</Badge>;
      case 'CANCELLED':
        return <Badge bg="warning">Cancelled</Badge>;
      case 'EXPIRED':
        return <Badge bg="danger">Expired</Badge>;
      case 'PAUSED':
        return <Badge bg="secondary">Paused</Badge>;
      case 'PENDING':
        return <Badge bg="info">Pending</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
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
      <Row className="mb-4">
        <Col>
          <h2 className="gradient-text">Subscription & Billing</h2>
          <p className="text-muted">Manage your subscription and view billing history</p>
        </Col>
      </Row>

      {/* Current Subscription */}
      <Row className="mb-4">
        <Col lg={8}>
          <Card className="shadow-sm border-0 mb-4 fade-in">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h4 className="mb-1">
                    {subscription?.plan.name || 'Free Trial'} Plan
                  </h4>
                  <p className="text-muted mb-0">
                    {subscription?.plan.description || 'Get started with limited features'}
                  </p>
                </div>
                {subscription && getStatusBadge(subscription.status)}
              </div>

              {subscription && subscription.status === 'ACTIVE' ? (
                <>
                  <div className="mb-3">
                    <Row>
                      <Col md={6}>
                        <p className="mb-1 text-muted">Current Period</p>
                        <p className="mb-0">
                          <strong>
                            {format(new Date(subscription.startDate), 'MMM dd, yyyy')} -{' '}
                            {subscription.nextBillingDate
                              ? format(new Date(subscription.nextBillingDate), 'MMM dd, yyyy')
                              : 'Ongoing'}
                          </strong>
                        </p>
                      </Col>
                      <Col md={6}>
                        <p className="mb-1 text-muted">Monthly Cost</p>
                        <p className="mb-0">
                          <strong className="text-primary" style={{ fontSize: '1.5rem' }}>
                            ${subscription.plan.price.toFixed(2)}
                          </strong>
                        </p>
                      </Col>
                    </Row>
                  </div>

                  {subscription.nextBillingDate && (
                    <Alert variant="info" className="mb-3">
                      <small>
                        💡 Next billing date:{' '}
                        <strong>{format(new Date(subscription.nextBillingDate), 'MMMM dd, yyyy')}</strong>
                        {subscription.autoRenew ? ' (Auto-renew enabled)' : ''}
                      </small>
                    </Alert>
                  )}

                  {subscription.trialEndsAt && new Date(subscription.trialEndsAt) > new Date() && (
                    <Alert variant="warning">
                      <strong>Trial Period</strong> - Your trial ends on{' '}
                      {format(new Date(subscription.trialEndsAt), 'MMMM dd, yyyy')}
                    </Alert>
                  )}
                </>
              ) : (
                <Alert variant="warning">
                  <strong>No Active Subscription</strong> - Upgrade to unlock premium features
                </Alert>
              )}

              <div className="d-flex gap-2">
                {subscription && subscription.status === 'ACTIVE' ? (
                  <Button
                    variant="outline-danger"
                    onClick={() => setShowCancelModal(true)}
                  >
                    Cancel Subscription
                  </Button>
                ) : subscription && subscription.status === 'CANCELLED' && subscription.endDate && new Date(subscription.endDate) > new Date() ? (
                  <Button variant="success" onClick={handleResumeSubscription}>
                    Resume Subscription
                  </Button>
                ) : (
                  <Link to="/pricing">
                    <Button variant="primary">View Plans</Button>
                  </Link>
                )}
              </div>
            </Card.Body>
          </Card>

          {/* Usage Statistics */}
          <Card className="shadow-sm border-0 fade-in">
            <Card.Body className="p-4">
              <h5 className="mb-4">Usage This Month</h5>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted">QR Codes Created</span>
                  <span>
                    <strong>
                      {usage?.qrCodesUsed || 0}
                    </strong>{' '}
                    / {usage?.qrCodesLimit === -1 ? 'Unlimited' : usage?.qrCodesLimit || 5}
                  </span>
                </div>
                <ProgressBar
                  now={
                    usage?.qrCodesLimit === -1
                      ? 0
                      : ((usage?.qrCodesUsed || 0) / (usage?.qrCodesLimit || 5)) * 100
                  }
                  variant={
                    usage?.qrCodesLimit === -1
                      ? 'success'
                      : ((usage?.qrCodesUsed || 0) / (usage?.qrCodesLimit || 5)) * 100 > 80
                      ? 'danger'
                      : 'primary'
                  }
                />
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted">Total Scans</span>
                  <span>
                    <strong>
                      {usage?.scansThisMonth?.toLocaleString() || 0}
                    </strong>{' '}
                    / {usage?.scansLimit === -1 ? 'Unlimited' : usage?.scansLimit?.toLocaleString() || '1,000'}
                  </span>
                </div>
                <ProgressBar
                  now={
                    usage?.scansLimit === -1
                      ? 0
                      : ((usage?.scansThisMonth || 0) / (usage?.scansLimit || 1000)) * 100
                  }
                  variant={
                    usage?.scansLimit === -1
                      ? 'success'
                      : ((usage?.scansThisMonth || 0) / (usage?.scansLimit || 1000)) * 100 > 80
                      ? 'danger'
                      : 'primary'
                  }
                />
              </div>

              {usage && usage.qrCodesLimit !== -1 && usage.qrCodesUsed >= usage.qrCodesLimit * 0.8 && (
                <Alert variant="warning" className="mb-0">
                  <small>
                    ⚠️ You're approaching your plan limits. Consider upgrading for unlimited access.
                  </small>
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Quick Actions */}
        <Col lg={4}>
          <Card className="shadow-sm border-0 fade-in mb-4">
            <Card.Body>
              <h5 className="mb-3">Quick Actions</h5>
              <ListGroup variant="flush">
                <ListGroup.Item className="px-0 d-flex justify-content-between align-items-center">
                  <span>🔄 Change Plan</span>
                  <Link to="/pricing">
                    <Button variant="outline-primary" size="sm">
                      View Plans
                    </Button>
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item className="px-0 d-flex justify-content-between align-items-center">
                  <span>💳 Payment Method</span>
                  <Button variant="outline-secondary" size="sm" disabled>
                    Coming Soon
                  </Button>
                </ListGroup.Item>
                <ListGroup.Item className="px-0 d-flex justify-content-between align-items-center">
                  <span>📧 Billing Email</span>
                  <Button variant="outline-secondary" size="sm" disabled>
                    Update
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>

          {/* Plan Features */}
          {subscription?.plan && (
            <Card className="shadow-sm border-0 fade-in">
              <Card.Body>
                <h5 className="mb-3">Your Plan Features</h5>
                <ListGroup variant="flush">
                  {(subscription.plan.features || []).map((feature, idx) => (
                    <ListGroup.Item key={idx} className="px-0 d-flex align-items-start">
                      <span className="text-success me-2">✓</span>
                      <span className="small">{feature}</span>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      {/* Billing History */}
      <Row>
        <Col>
          <Card className="shadow-sm border-0 fade-in">
            <Card.Body className="p-4">
              <h5 className="mb-4">Billing History</h5>
              {invoices.length === 0 ? (
                <Alert variant="info">No billing history available yet</Alert>
              ) : (
                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((invoice) => (
                        <tr key={invoice.id}>
                          <td>{format(new Date(invoice.createdAt), 'MMM dd, yyyy')}</td>
                          <td>Monthly Subscription</td>
                          <td>
                            ${invoice.amount.toFixed(2)} {invoice.currency}
                          </td>
                          <td>
                            {invoice.status === 'PAID' && <Badge bg="success">Paid</Badge>}
                            {invoice.status === 'PENDING' && <Badge bg="warning">Pending</Badge>}
                            {invoice.status === 'FAILED' && <Badge bg="danger">Failed</Badge>}
                          </td>
                          <td>
                            <Button variant="outline-secondary" size="sm" disabled>
                              Download
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Upgrade Modal */}
      <Modal show={showUpgradeModal} onHide={() => setShowUpgradeModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Upgrade to {selectedPlan?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPlan && (
            <>
              <h5 className="mb-3">Plan Details</h5>
              <p className="text-muted">{selectedPlan.description}</p>
              <h4 className="mb-3">${selectedPlan.price}/month</h4>
              <ListGroup variant="flush" className="mb-3">
                {(selectedPlan.features || []).map((feature, idx) => (
                  <ListGroup.Item key={idx} className="px-0 d-flex align-items-start">
                    <span className="text-success me-2">✓</span>
                    <span>{feature}</span>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Alert variant="info">
                <small>
                  You will be charged ${selectedPlan.price} on{' '}
                  {format(addDays(new Date(), 30), 'MMMM dd, yyyy')}
                </small>
              </Alert>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpgradeModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmUpgrade}>
            Confirm Upgrade
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Cancel Confirmation Modal */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cancel Subscription</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="warning">
            <strong>Are you sure?</strong>
          </Alert>
          <p>
            Your subscription will remain active until{' '}
            {subscription?.nextBillingDate
              ? format(new Date(subscription.nextBillingDate), 'MMMM dd, yyyy')
              : 'the end of your billing period'}
            . After that, you'll lose access to premium features.
          </p>
          <p className="text-muted">You can always resubscribe later.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            Keep Subscription
          </Button>
          <Button variant="danger" onClick={handleCancelSubscription}>
            Yes, Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Subscription;

