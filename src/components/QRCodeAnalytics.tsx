import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ButtonGroup, Table, Badge } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import api from '../utils/api';
import type { QRCode, Analytics } from '../types';
import { QRCodeSVG } from 'qrcode.react';
import { format } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const QRCodeAnalytics: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [qrCode, setQrCode] = useState<QRCode | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('7d');

  useEffect(() => {
    fetchData();
  }, [id, period]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [qrResponse, analyticsResponse] = await Promise.all([
        api.get(`/api/qr/dynamic/${id}`),
        api.get(`/api/qr/dynamic/${id}/analytics`, { params: { period } }),
      ]);
      setQrCode(qrResponse.data);
      setAnalytics(analyticsResponse.data);
    } catch (error: any) {
      toast.error('Failed to fetch analytics');
    } finally {
      setLoading(false);
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

  if (!qrCode || !analytics) {
    return (
      <Container className="py-5 text-center">
        <h4>QR Code not found</h4>
        <Link to="/dashboard">
          <Button variant="primary">Back to Dashboard</Button>
        </Link>
      </Container>
    );
  }

  const scansByDateData = {
    labels: analytics.scansByDate.map((s) => format(new Date(s.date), 'MMM dd')),
    datasets: [
      {
        label: 'Scans',
        data: analytics.scansByDate.map((s) => s.count),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const deviceData = {
    labels: analytics.scansByDevice.map((s) => s.device),
    datasets: [
      {
        data: analytics.scansByDevice.map((s) => s.count),
        backgroundColor: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'],
      },
    ],
  };

  const countryData = {
    labels: analytics.scansByCountry.map((s) => s.country),
    datasets: [
      {
        label: 'Scans by Country',
        data: analytics.scansByCountry.map((s) => s.count),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
      },
    ],
  };

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <Link to="/dashboard" className="text-decoration-none">
            <Button variant="outline-secondary" className="mb-3">
              ← Back to Dashboard
            </Button>
          </Link>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="gradient-text">{qrCode.title || 'QR Code Analytics'}</h2>
              <p className="text-muted mb-0">{qrCode.destinationUrl}</p>
            </div>
            <Link to={`/edit/${qrCode.id}`}>
              <Button variant="primary">Edit QR Code</Button>
            </Link>
          </div>
        </Col>
      </Row>

      {/* Period Selector */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <ButtonGroup>
                <Button
                  variant={period === '1d' ? 'primary' : 'outline-primary'}
                  onClick={() => setPeriod('1d')}
                >
                  Last 24 Hours
                </Button>
                <Button
                  variant={period === '7d' ? 'primary' : 'outline-primary'}
                  onClick={() => setPeriod('7d')}
                >
                  Last 7 Days
                </Button>
                <Button
                  variant={period === '30d' ? 'primary' : 'outline-primary'}
                  onClick={() => setPeriod('30d')}
                >
                  Last 30 Days
                </Button>
                <Button
                  variant={period === '90d' ? 'primary' : 'outline-primary'}
                  onClick={() => setPeriod('90d')}
                >
                  Last 90 Days
                </Button>
              </ButtonGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Stats Overview */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="shadow-sm border-0 fade-in">
            <Card.Body>
              <h6 className="text-muted mb-1">Total Scans</h6>
              <h2 className="mb-0">{analytics.totalScans}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0 fade-in">
            <Card.Body>
              <h6 className="text-muted mb-1">Today</h6>
              <h2 className="mb-0">{analytics.scansToday}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0 fade-in">
            <Card.Body>
              <h6 className="text-muted mb-1">This Week</h6>
              <h2 className="mb-0">{analytics.scansThisWeek}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0 fade-in">
            <Card.Body>
              <h6 className="text-muted mb-1">This Month</h6>
              <h2 className="mb-0">{analytics.scansThisMonth}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row className="mb-4">
        <Col lg={8}>
          <Card className="shadow-sm border-0 fade-in">
            <Card.Body>
              <h5 className="mb-4">Scans Over Time</h5>
              <Line
                data={scansByDateData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0,
                      },
                    },
                  },
                }}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="shadow-sm border-0 fade-in">
            <Card.Body>
              <h5 className="mb-4">Device Types</h5>
              <Doughnut
                data={deviceData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={6}>
          <Card className="shadow-sm border-0 fade-in">
            <Card.Body>
              <h5 className="mb-4">Scans by Country</h5>
              <Bar
                data={countryData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0,
                      },
                    },
                  },
                }}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="shadow-sm border-0 fade-in">
            <Card.Body className="text-center">
              <h5 className="mb-4">QR Code Preview</h5>
              <div className="qr-preview-container">
                <QRCodeSVG
                  value={qrCode.shortUrl}
                  size={200}
                  bgColor={qrCode.metadata?.bgColor || '#ffffff'}
                  fgColor={qrCode.metadata?.fgColor || '#000000'}
                  level={qrCode.metadata?.level || 'M'}
                  includeMargin={qrCode.metadata?.includeMargin}
                />
              </div>
              <div className="mt-3">
                <Button variant="primary" href={qrCode.shortUrl} target="_blank">
                  Open Short URL
                </Button>
              </div>
              <div className="mt-2">
                <small className="text-muted">{qrCode.shortUrl}</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Scans */}
      <Row>
        <Col>
          <Card className="shadow-sm border-0 fade-in">
            <Card.Body>
              <h5 className="mb-4">Recent Scans</h5>
              {qrCode.scans && qrCode.scans.length > 0 ? (
                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr>
                        <th>Date & Time</th>
                        <th>Location</th>
                        <th>Device</th>
                        <th>Browser</th>
                        <th>OS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {qrCode.scans.slice(0, 10).map((scan) => (
                        <tr key={scan.id}>
                          <td>{format(new Date(scan.scannedAt), 'MMM dd, yyyy HH:mm')}</td>
                          <td>
                            {scan.city && scan.country
                              ? `${scan.city}, ${scan.country}`
                              : scan.country || 'Unknown'}
                          </td>
                          <td>
                            <Badge bg="info">{scan.device || 'Unknown'}</Badge>
                          </td>
                          <td>{scan.browser || 'Unknown'}</td>
                          <td>{scan.os || 'Unknown'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-4 text-muted">
                  <p>No scans yet</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default QRCodeAnalytics;

