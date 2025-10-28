import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Badge,
  Form,
  InputGroup,
  Dropdown,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import type { QRCode } from '../types';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchQRCodes();
  }, [currentPage]);

  const fetchQRCodes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/qr/dynamic', {
        params: { page: currentPage, limit: 10 },
      });
      setQrCodes(response.data.qrCodes);
      setTotalPages(response.data.pagination.pages);
    } catch (error: any) {
      toast.error('Failed to fetch QR codes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this QR code?')) return;

    try {
      await api.delete(`/api/qr/dynamic/${id}`);
      toast.success('QR code deleted successfully');
      fetchQRCodes();
    } catch (error: any) {
      toast.error('Failed to delete QR code');
    }
  };

  const getStatusBadge = (status: string, isTrial: boolean, trialEndsAt?: string) => {
    if (isTrial && trialEndsAt && new Date(trialEndsAt) < new Date()) {
      return <Badge bg="danger">Trial Expired</Badge>;
    }
    switch (status) {
      case 'ACTIVE':
        return <Badge bg="success">Active</Badge>;
      case 'INACTIVE':
        return <Badge bg="secondary">Inactive</Badge>;
      case 'EXPIRED':
        return <Badge bg="danger">Expired</Badge>;
      case 'SUSPENDED':
        return <Badge bg="warning">Suspended</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const filteredQRCodes = qrCodes.filter((qr) => {
    const matchesSearch =
      qr.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      qr.destinationUrl.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || qr.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalScans = qrCodes.reduce((acc, qr) => acc + qr.scanCount, 0);
  const activeQRCodes = qrCodes.filter((qr) => qr.status === 'ACTIVE').length;

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="gradient-text">My QR Codes</h2>
            <Link to="/create">
              <Button variant="primary" size="lg">
                ➕ Create New QR Code
              </Button>
            </Link>
          </div>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="shadow-sm border-0 fade-in">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Total QR Codes</h6>
                  <h2 className="mb-0">{qrCodes.length}</h2>
                </div>
                <div
                  className="bg-primary bg-opacity-10 p-3 rounded-circle"
                  style={{ fontSize: '24px' }}
                >
                  📱
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm border-0 fade-in">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Total Scans</h6>
                  <h2 className="mb-0">{totalScans}</h2>
                </div>
                <div
                  className="bg-success bg-opacity-10 p-3 rounded-circle"
                  style={{ fontSize: '24px' }}
                >
                  📊
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm border-0 fade-in">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Active QR Codes</h6>
                  <h2 className="mb-0">{activeQRCodes}</h2>
                </div>
                <div
                  className="bg-info bg-opacity-10 p-3 rounded-circle"
                  style={{ fontSize: '24px' }}
                >
                  ✅
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="shadow-sm border-0 mb-4 fade-in">
        <Card.Body>
          <Row>
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>🔍</InputGroup.Text>
                <Form.Control
                  placeholder="Search QR codes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="EXPIRED">Expired</option>
                <option value="SUSPENDED">Suspended</option>
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* QR Codes Table */}
      <Card className="shadow-sm border-0 fade-in">
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : filteredQRCodes.length === 0 ? (
            <div className="text-center py-5">
              <div style={{ fontSize: '48px' }} className="mb-3">
                📱
              </div>
              <h5>No QR Codes Found</h5>
              <p className="text-muted">
                {searchTerm || filterStatus !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Create your first QR code to get started'}
              </p>
              <Link to="/create">
                <Button variant="primary">Create QR Code</Button>
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Short URL</th>
                    <th>Destination</th>
                    <th>Status</th>
                    <th>Scans</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQRCodes.map((qr) => (
                    <tr key={qr.id}>
                      <td>
                        <strong>{qr.title || 'Untitled'}</strong>
                        {qr.isTrial && (
                          <Badge bg="warning" className="ms-2">
                            Trial
                          </Badge>
                        )}
                      </td>
                      <td>
                        <a
                          href={qr.shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-decoration-none"
                        >
                          {qr.shortCode}
                        </a>
                      </td>
                      <td>
                        <small className="text-muted text-truncate d-block" style={{ maxWidth: '200px' }}>
                          {qr.destinationUrl}
                        </small>
                      </td>
                      <td>{getStatusBadge(qr.status, qr.isTrial, qr.trialEndsAt)}</td>
                      <td>
                        <Badge bg="info">{qr.scanCount}</Badge>
                      </td>
                      <td>
                        <small>{format(new Date(qr.createdAt), 'MMM dd, yyyy')}</small>
                      </td>
                      <td>
                        <Dropdown>
                          <Dropdown.Toggle variant="outline-secondary" size="sm">
                            •••
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item as={Link} to={`/dashboard/qr/${qr.id}`}>
                              📊 View Analytics
                            </Dropdown.Item>
                            <Dropdown.Item as={Link} to={`/edit/${qr.id}`}>
                              ✏️ Edit
                            </Dropdown.Item>
                            <Dropdown.Item
                              href={qr.shortUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              🔗 Open Link
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item
                              onClick={() => handleDelete(qr.id)}
                              className="text-danger"
                            >
                              🗑️ Delete
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Button
                variant="outline-primary"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="me-2"
              >
                Previous
              </Button>
              <span className="align-self-center mx-3">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline-primary"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="ms-2"
              >
                Next
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Dashboard;

